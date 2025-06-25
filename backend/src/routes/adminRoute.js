const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const {protect} = require('../middleware/authMiddleware');
const { createUser, getAllUsersExceptSelf } = require('../controllers/adminController');
const router = express.Router();

router.get('/users', protect, adminMiddleware,getAllUsersExceptSelf);
router.post('/users',protect, adminMiddleware,createUser);


module.exports = router;

