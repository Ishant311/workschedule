const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMySchedule } = require("../controllers/employeeController");

router.get("/my-schedule", protect, getMySchedule);

module.exports = router;
