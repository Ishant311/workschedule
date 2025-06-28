const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '123456';

exports.protect = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token verification failed' });
    }
};
