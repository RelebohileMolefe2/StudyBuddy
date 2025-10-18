const db = require('../models/db');
 // your database connection

// GET: Get settings for the logged-in user
exports.getSettings = (req, res) => {
  const userId = req.user.user_id;

  const query = 'SELECT * FROM settings WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching settings:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Settings not found for this user' });
    }
    res.json(results[0]);
  });
};

// POST: Create settings for the logged-in user
exports.createSettings = (req, res) => {
  const userId = req.user.user_id;
  const {
    email_notifications = true,
    push_notifications = true,
    dark_mode = false,
  } = req.body;

  const query = `
    INSERT INTO settings (user_id, email_notifications, push_notifications, dark_mode)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [userId, email_notifications, push_notifications, dark_mode],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Settings already exist for this user' });
        }
        console.error('Error creating settings:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      res.status(201).json({
        message: 'Settings created successfully',
        settingId: result.insertId,
      });
    }
  );
};

// PUT: Update settings for the logged-in user
exports.updateSettings = (req, res) => {
  const userId = req.user.user_id;
  const { email_notifications, push_notifications, dark_mode } = req.body;

  // Dynamically build fields to update
  const fields = [];
  const values = [];

  if (email_notifications !== undefined) {
    fields.push('email_notifications = ?');
    values.push(email_notifications);
  }
  if (push_notifications !== undefined) {
    fields.push('push_notifications = ?');
    values.push(push_notifications);
  }
  if (dark_mode !== undefined) {
    fields.push('dark_mode = ?');
    values.push(dark_mode);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  values.push(userId); // for WHERE clause

  const query = `UPDATE settings SET ${fields.join(', ')} WHERE user_id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating settings:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Settings not found for this user' });
    }
    res.json({ message: 'Settings updated successfully' });
  });
};
