// JWT generation
import jwt from 'jsonwebtoken'
export const generateAccessToken = (user) => jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
);

export const generateRefreshToken = (user) => jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
);