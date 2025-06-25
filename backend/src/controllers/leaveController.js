const Leave = require('../models/leaveSchema');

exports.applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, type, reason } = req.body;
    const employeeId = req.user.id;

    if (!startDate || !endDate || !type || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newLeave = await Leave.create({ employeeId, startDate, endDate, type, reason });
    res.status(201).json({ message: "Leave applied successfully", leave: newLeave });
  } catch (err) {
    console.error("Error applying for leave:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.user.id }).sort({ createdAt: -1 });
    res.json({ data: leaves });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leave records." });
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
