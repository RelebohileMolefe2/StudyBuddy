const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register
exports.register = async (req, res) => {
  const {
  full_name,
  email,
  password,
  department,
  year_of_study,
  study_style,
  availability
} = req.body;

const profile_picture = req.file ? req.file.path : null;


  try {
    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const newUser = {
        full_name,
        email,
        password: hashedPassword,
        department,
        year_of_study,
        study_style,
        availability,
        profile_picture
      };

      db.query('INSERT INTO users SET ?', newUser, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Registration failed' });
        }
        return res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const user = results[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    // Generate token
    const token = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    // Remove password from response
    delete user.password;

    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  });
};
