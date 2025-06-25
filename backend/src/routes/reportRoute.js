const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const { uploadReport, getReports } = require('../controllers/reportController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/reports/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDFs are allowed'), false);
};

const upload = multer({ storage, fileFilter });

router.post('/upload', protect, upload.single('report'), uploadReport);
router.get('/', protect, getReports);

module.exports = router;
