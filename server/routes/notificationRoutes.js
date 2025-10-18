const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const verifyToken = require('../middleware/authMiddleware');
const db = require('../models/db'); // adjust path if needed

// Get all notifications for a user
router.get('/:userId', verifyToken, (req, res) => {
  const userId = req.params.userId;

  const sql = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('DB error in notifications:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Create a notification
router.post('/', verifyToken, notificationController.createNotification);

// Mark as read
router.put('/:id/read', verifyToken, (req, res) => {
  const notificationId = req.params.id;

  db.query(
    'UPDATE notifications SET is_read = TRUE WHERE notification_id = ?',
    [notificationId],
    (err) => {
      if (err) return res.status(500).json({ message: 'Update error' });
      res.json({ message: 'Marked as read' });
    }
  );
});
// Delete a notification
router.delete('/:id', verifyToken, notificationController.deleteNotification);

module.exports = router;
