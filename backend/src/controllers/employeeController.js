const Schedule = require("../models/shiftModel");

const getMySchedule = async (req, res) => {
  try {
    const { start, end } = req.query;

    const schedules = await Schedule.find({
      employeeId: req.user.id,
      date: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
    }).sort({ date: 1 });

    res.json({ data: schedules });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ message: "Failed to fetch your schedule" });
  }
};

module.exports = { getMySchedule };
