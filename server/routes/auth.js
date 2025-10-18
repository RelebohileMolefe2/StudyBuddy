const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// Register route: handle multipart/form-data
router.post('/register', upload.single('profile_picture'), authController.register);

// Login remains the same
router.post('/login', authController.login);

module.exports = router;
