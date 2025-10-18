const db = require('./db'); // adjust if needed

const Notification = {
  // Get all notifications for a user
  getAllByUser: (userId, callback) => {
    db.query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
      [userId],
      callback
    );
  },

  // Create a new notification
  create: ({ user_id, title, message, type }, callback) => {
    db.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
      [user_id, title, message, type],
      callback
    );
  },

  // Mark as read
  markAsRead: (notificationId, callback) => {
    db.query(
      `UPDATE notifications SET is_read = TRUE WHERE notification_id = ?`,
      [notificationId],
      callback
    );
  },

  // Delete a notification
  delete: (notificationId, callback) => {
    db.query(
      `DELETE FROM notifications WHERE notification_id = ?`,
      [notificationId],
      callback
    );
  }
};

module.exports = Notification;
