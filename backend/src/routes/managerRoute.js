const express = require('express');
const isManagerAuth = require('../middleware/isManagerMiddleware');
const { getTeamOverview, assignSchedule, getWeeklySchedule, getAllLeaveRequests, getWeeklyLeaves, getAllReports } = require('../controllers/managerController');
const { updateLeaveStatus } = require('../controllers/leaveController');
const router = express.Router();

router.get('/team',isManagerAuth,getTeamOverview)

router.post("/assign-schedule", isManagerAuth, assignSchedule);

router.get('/weekly-schedules',isManagerAuth , getWeeklySchedule);

router.get("/leaves", isManagerAuth, getAllLeaveRequests);
router.patch("/leave/:id", isManagerAuth, updateLeaveStatus);
router.get('/leaves-weekly', isManagerAuth, getWeeklyLeaves);
router.get('/reports',isManagerAuth, getAllReports);

module.exports = router;