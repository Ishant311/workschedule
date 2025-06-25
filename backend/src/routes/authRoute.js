const express = require('express');
const router = express.Router();
const {  login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);

// Protected route
router.get('/me', protect, getMe);
router.post('/logout',logout);

module.exports = router;
