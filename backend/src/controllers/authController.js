const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '123456';
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};


exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  if (role && role !== user.userType) {
    return res.status(403).json({
      message: `Access denied. You are registered as a ${user.userType}, not a ${role}.`,
    });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, COOKIE_OPTIONS);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    userType: user.userType,
  });
};


exports.getMe = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    res.status(200).json(req.user);
};

exports.logout = async (req, res) => {
    res.cookie('token',{...COOKIE_OPTIONS, maxAge: 0}); // Set cookie to expire immediately
    res.status(200).json({ message: 'Logged out successfully' });
};
