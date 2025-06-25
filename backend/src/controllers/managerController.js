const Report = require('../models/reportModel');
const User = require("../models/userModel");
const Schedule = require("../models/shiftModel");
const Leave = require("../models/leaveSchema");
const { sendEmail } = require("../lib/mailer"); // adjust path as needed
const { format } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");


exports.getTeamOverview = async (req, res) => {
  try {
    const team = await User.find({ userType: "employee" });

    res.status(200).json({
      success: true,
      message: "Team fetched successfully",
      data: team,
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({
      success: false,
      message: "Server Error while fetching team",
    });
  }
};



exports.assignSchedule = async (req, res) => {
  try {
    const { employeeId, date, startTime, endTime, notes } = req.body;

    if (!employeeId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    if (isNaN(startDateTime) || isNaN(endDateTime)) {
      return res.status(400).json({ message: "Invalid date or time format." });
    }

    if (startDateTime >= endDateTime) {
      return res.status(400).json({ message: "Start time must be before end time." });
    }

    const employee = await User.findById(employeeId);
    if (!employee || employee.userType !== "employee") {
      return res.status(404).json({ message: "Employee not found or invalid role." });
    }

    const existing = await Schedule.findOne({
      employeeId,
      $or: [
        {
          startTime: { $lt: endDateTime },
          endTime: { $gt: startDateTime },
        }
      ],
    });

    if (existing) {
      return res.status(409).json({
        message: "Employee already has a schedule that overlaps with this time slot."
      });
    }

    const newSchedule = await Schedule.create({
      employeeId,
      startTime: startDateTime,
      endTime: endDateTime,
      notes: notes || '',
      date: new Date(date),
      createdBy: req.user.id,
    });

    const options = { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: 'numeric', hour12: true };
    const dateOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' };

    const startFormatted = new Date(startDateTime).toLocaleString('en-IN', options);
    const endFormatted = new Date(endDateTime).toLocaleString('en-IN', options);
    const dateFormatted = new Date(date).toLocaleDateString('en-IN', dateOptions);


    await sendEmail({
      to: employee.email,
      subject: "🗓️ New Work Schedule Assigned",
      html: `
        <p>Hi ${employee.name || "Employee"},</p>
        <p>You have been assigned a new work schedule:</p>
        <ul>
          <li><strong>Date:</strong> ${dateFormatted}</li>
          <li><strong>Time:</strong> ${startFormatted} - ${endFormatted}</li>
          ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ""}
        </ul>
        <p>Please check your schedule in the portal.</p>
        <br/>
        <p>Regards,<br/>Workforce Management System</p>
      `
    });

    return res.status(201).json({
      message: "✅ Schedule assigned and email sent!",
      schedule: newSchedule
    });

  } catch (err) {
    console.error("Error in assignSchedule:", err);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};


exports.getWeeklySchedule = async (req, res) => {
  try {
    const { start, end } = req.query;
    const schedules = await Schedule.find({
      date: { $gte: new Date(start), $lte: new Date(end) }
    }).lean();

    res.json({ data: schedules });
  } catch (err) {
    console.error("Error fetching weekly schedules:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employeeId", "name email userType")
      .sort({ appliedAt: -1 });

    res.status(200).json({ data: leaves });
  } catch (err) {
    console.error("Error fetching leaves:", err);
    res.status(500).json({ message: "Server error while fetching leave requests." });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({ message: "Leave request not found." });

    if (leave.status !== "pending") {
      return res.status(400).json({ message: "Leave already reviewed." });
    }

    leave.status = status;
    await leave.save();

    res.status(200).json({ message: `Leave ${status} successfully.` });
  } catch (err) {
    console.error("Error updating leave status:", err);
    res.status(500).json({ message: "Server error while updating status." });
  }
};

exports.getWeeklyLeaves = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: "Start and end dates are required." });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const leaves = await Leave.find({
      status: "approved",
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    }).select("employeeId startDate endDate replaced");

    res.json({ data: leaves });
  } catch (err) {
    console.error("Error fetching weekly leaves:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('user', 'name email')
      .sort({ date: -1 });

    res.status(200).json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ message: 'Could not fetch reports' });
  }
};


