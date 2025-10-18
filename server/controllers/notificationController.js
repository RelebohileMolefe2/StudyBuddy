const Notification = require('../models/notificationModel');

// GET /notifications/:userId
exports.getNotifications = (req, res) => {
  const { userId } = req.params;

  Notification.getAllByUser(userId, (err, results) => {
    if (err) {
      console.error('Error getting notifications:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(results);
  });
};

// POST /notifications
exports.createNotification = (req, res) => {
  const { user_id, title, message, type } = req.body;

  if (!user_id || !title || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  Notification.create({ user_id, title, message, type }, (err, result) => {
    if (err) {
      console.error('Error creating notification:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json({ message: 'Notification created', id: result.insertId });
  });
};

// PUT /notifications/:id/read
exports.markAsRead = (req, res) => {
  const { id } = req.params;

  Notification.markAsRead(id, (err, result) => {
    if (err) {
      console.error('Error marking as read:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json({ message: 'Notification marked as read' });
  });
};

// DELETE /notifications/:id
exports.deleteNotification = (req, res) => {
  const { id } = req.params;

  Notification.delete(id, (err, result) => {
    if (err) {
      console.error('Error deleting notification:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json({ message: 'Notification deleted' });
  });
};
exports.createNotification = (user_id, title, message, type = 'system') => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, ?, ?, ?)
    `;
    db.query(query, [user_id, title, message, type], (err, results) => {
      if (err) {
        console.error('Error creating notification:', err);
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
};
