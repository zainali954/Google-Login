import express from 'express'
import axios from 'axios'
import User from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';

const router = express.Router();

// Google login route
router.post('/google-login', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
    }

    try {
        // Exchange authorization code for tokens
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: "postmessage",  // Use postmessage for SPAs
            grant_type: 'authorization_code',
        });

        const { access_token } = tokenResponse.data;  // Get only access token

        // Fetch user data from Google
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,  // Use the access token to fetch user data
            },
        });

        const userData = userInfoResponse.data;

        // Check if user already exists in DB
        let user = await User.findOne({ email: userData.email });

        if (!user) {
            user = new User({
                email: userData.email,
                googleId: userData.id,
                name: userData.name,
                picture: userData.picture,
            });
            await user.save();  // Save new user to the database
        }

        // Generate JWT tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set cookies with tokens
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000, // 15 minutes for access token
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
        });

        res.status(200).json({
            success: true,
            message: "User authenticated successfully.",
            user: { name: user.name, email: user.email, picture: user.picture },  // Send user data only
        });

    } catch (error) {
        console.error('Error during Google login:', error.response || error.message || error);
        res.status(500).json({ success: false, message: 'Failed to log in with Google' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
});


export default router;
