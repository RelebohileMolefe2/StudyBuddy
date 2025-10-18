const db = require('../models/db');
 // your database connection module

// POST: Add new feedback
exports.addFeedback = (req, res) => {
  const { subject, message } = req.body;
  const user_id = req.user.user_id; // assuming user is authenticated and user_id is on req.user

  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required' });
  }

  const query = 'INSERT INTO feedback (user_id, subject, message) VALUES (?, ?, ?)';

  db.query(query, [user_id, subject, message], (err, result) => {
    if (err) {
      console.error('Error inserting feedback:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Feedback submitted successfully', feedbackId: result.insertId });
  });
};

// GET: Get all feedback (admin view)
exports.getAllFeedback = (req, res) => {
  const query = `
    SELECT f.feedback_id, f.subject, f.message, f.submitted_at, u.user_id, u.username 
    FROM feedback f 
    JOIN users u ON f.user_id = u.user_id
    ORDER BY f.submitted_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching feedback:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};

// GET: Get feedback by userId
exports.getFeedbackByUser = (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT feedback_id, subject, message, submitted_at 
    FROM feedback 
    WHERE user_id = ? 
    ORDER BY submitted_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user feedback:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};

// DELETE: Delete feedback by id (admin only)
exports.deleteFeedback = (req, res) => {
  const feedbackId = req.params.id;

  const query = 'DELETE FROM feedback WHERE feedback_id = ?';

  db.query(query, [feedbackId], (err, result) => {
    if (err) {
      console.error('Error deleting feedback:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted successfully' });
  });
};
