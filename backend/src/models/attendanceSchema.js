const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shiftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shift',
        required: true
    },
    clockIn: {
        type: Date
    },
    clockOut: {
        type: Date
    },
    totalHours: {
        type: Number
    },
    lateBy: {
        type: Number 
    },
    overtime: {
        type: Number 
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
