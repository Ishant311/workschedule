const Report = require('../models/reportModel');

exports.uploadReport = async (req, res) => {
  try {
    const { date, notes } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const newReport = await Report.create({
      user: req.user.id,
      filePath: req.file.path,
      date,
      notes,
    });

    res.status(201).json({ message: 'Report uploaded', report: newReport });
  } catch (err) {
    console.error('Upload failed:', err.message);
    res.status(500).json({ message: 'Upload error' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Fetch error' });
  }
};
