const express = require('express');
const { applyLeave, getMyLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/apply', protect, applyLeave);
router.get('/my-leaves', protect, getMyLeaves);
router.post('/update-status', protect, updateLeaveStatus);

module.exports = router;
