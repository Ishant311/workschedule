const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filePath: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
