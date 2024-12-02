# Google Login Integration with React and Node.js

This repository demonstrates a Google OAuth2 login integration using React for the frontend and Node.js for the backend. It includes features like user authentication, token management, and database integration.

## Features
- Google OAuth2 login with a secure token exchange process.
- Backend integration with Express.js for authentication and token handling.
- User data is stored in MongoDB.
- Protected routes implemented in the frontend.
- Responsive and accessible UI with Tailwind CSS.
- Full-stack JWT-based authentication flow with secure cookies.

## Tech Stack

### Frontend
- **React**: Library for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: HTTP client for API calls.
- **React Router**: For client-side routing.
- **React Hot Toast**: For user notifications.
- **@react-oauth/google**: For managing Google OAuth flows.

### Backend
- **Node.js**: Backend runtime environment.
- **Express**: Framework for building REST APIs.
- **Mongoose**: ODM for MongoDB integration.
- **jsonwebtoken**: For generating and verifying JWTs.
- **dotenv**: For environment variable management.

## Setup Instructions

### Prerequisites
- Install Node.js and npm.
- Set up MongoDB (local or cloud instance).
- Obtain Google OAuth credentials from the [Google Developers Console](https://console.developers.google.com/).

### Installation
Clone the repository:

```bash
git clone https://github.com/zainali954/Google-Login.git
cd GoogleLogin
```

### Backend Setup

1. Install dependencies (from the root directory, this will install both frontend and backend dependencies):

```bash
npm install
```

2. Create a `.env` file in the root folder (if not already present) and add the following configuration:

```env
NODE_ENV=development
PORT=port
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGO_URI=your-mongodb-uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_jwt_secret
FRONTEND_URL='http://localhost:5173'
```

3. Start the backend server:

```bash
npm start
```

### Frontend Setup

1. Configure the Google OAuth client ID in `main.jsx`:

```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

<GoogleOAuthProvider clientId="your-google-client-id">
    <App />
</GoogleOAuthProvider>
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Key Code Snippets

### Protected Route

This ensures only authenticated users can access certain routes:

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
```

### Backend: Token Generation Utility

This utility generates the access and refresh tokens:

```javascript
import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
```

### Backend: Google Login Route

This route handles Google login and token exchange:

```javascript
import express from 'express';
import axios from 'axios';
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
```

## Scripts

### Frontend
- **`npm run dev`**: Starts the frontend in development mode.
- **`npm run build`**: Builds the frontend for production.

### Backend
- **`npm run dev`**: Starts the backend in development mode using nodemon.
- **`npm start`**: Starts the backend in production mode.

---

## License

This project is licensed under the MIT License. Feel free to use it as a base for your own projects.

---

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request. 😊

