const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models/db');
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// =======================
// Multer Config for Uploads
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Store in /uploads
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // e.g. .jpg
    cb(null, `profile_${req.user.user_id}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

// =======================
// GET: Profile
// =======================
router.get('/profile', verifyToken, (req, res) => {
  const userId = req.user.user_id;

  db.query(
    'SELECT user_id, full_name, email, department, year_of_study, study_style, availability, profile_picture, created_at FROM users WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error('Error fetching profile:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return full image URL
      const user = results[0];
      if (user.profile_picture) {
        user.profile_picture = `${req.protocol}://${req.get('host')}/${user.profile_picture}`;
      }

      res.json(user);
    }
  );
});

// =======================
// PUT: Update Profile
// =======================
router.put('/update', verifyToken, (req, res) => {
  const userId = req.user.user_id;
  const {
    full_name,
    password,
    department,
    year_of_study,
    study_style,
    availability,
    profile_picture
  } = req.body;

  db.query('SELECT * FROM users WHERE user_id = ?', [userId], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Hash password if provided
    let hashedPassword = user.password;
    if (password && password.trim() !== '') {
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (hashErr) {
        console.error('Error hashing password:', hashErr);
        return res.status(500).json({ message: 'Error updating password' });
      }
    }

    const updatedUser = {
      full_name: full_name || user.full_name,
      password: hashedPassword,
      department: department || user.department,
      year_of_study: year_of_study || user.year_of_study,
      study_style: study_style || user.study_style,
      availability: availability || user.availability,
      profile_picture: profile_picture || user.profile_picture,
    };

    db.query(
      `UPDATE users SET 
        full_name = ?, 
        password = ?, 
        department = ?, 
        year_of_study = ?, 
        study_style = ?, 
        availability = ?, 
        profile_picture = ?
      WHERE user_id = ?`,
      [
        updatedUser.full_name,
        updatedUser.password,
        updatedUser.department,
        updatedUser.year_of_study,
        updatedUser.study_style,
        updatedUser.availability,
        updatedUser.profile_picture,
        userId
      ],
      (updateErr) => {
        if (updateErr) {
          console.error('Error updating user:', updateErr);
          return res.status(500).json({ message: 'Database error' });
        }

        res.json({ message: 'Profile updated successfully' });
      }
    );
  });
});

// =======================
// POST: Upload Profile Picture
// =======================
router.post('/upload-profile-picture', verifyToken, upload.single('profile_picture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const filePath = req.file.path; // Relative path, e.g., uploads/profile_1.jpg

  db.query(
    'UPDATE users SET profile_picture = ? WHERE user_id = ?',
    [filePath, req.user.user_id],
    (err) => {
      if (err) {
        console.error('Error saving profile picture:', err);
        return res.status(500).json({ message: 'Failed to update profile picture' });
      }

      const fullUrl = `${req.protocol}://${req.get('host')}/${filePath}`;
      res.json({ message: 'Profile picture updated successfully', url: fullUrl });
    }
  );
});

// =======================
// DELETE: User Account
// =======================
router.delete('/delete', verifyToken, (req, res) => {
  const userId = req.user.user_id;

  db.query('DELETE FROM users WHERE user_id = ?', [userId], (err) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json({ message: 'Account deleted successfully' });
  });
});

module.exports = router;
