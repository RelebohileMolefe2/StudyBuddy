const db = require('./db');

const Message = {
  getByGroupId: (groupId, callback) => {
  const sql = `
    SELECT 
      m.message_id,
      m.sender_id,
      u.full_name AS sender_name,
      m.message_text AS message,
      m.sent_at AS created_at
    FROM messages m
    JOIN users u ON m.sender_id = u.user_id
    WHERE m.group_id = ?
    ORDER BY m.sent_at ASC
  `;

  db.query(sql, [groupId], callback);
},
create: (groupId, senderId, messageText, callback) => {
  const insertSql = `
    INSERT INTO messages (group_id, sender_id, message_text)
    VALUES (?, ?, ?)
  `;

  db.query(insertSql, [groupId, senderId, messageText], (err, result) => {
    if (err) return callback(err);

    const messageId = result.insertId;

    const fetchSql = `
      SELECT 
        m.message_id,
        m.sender_id,
        u.full_name AS sender_name,
        m.message_text AS message,
        m.sent_at AS created_at
      FROM messages m
      JOIN users u ON m.sender_id = u.user_id
      WHERE m.message_id = ?
    `;

    db.query(fetchSql, [messageId], (fetchErr, fetchResults) => {
      if (fetchErr) return callback(fetchErr);

      // Return the newly inserted message
      callback(null, fetchResults[0]);
    });
  });
},

  delete: (messageId, senderId, callback) => {
    // Optional: Only delete if user is the sender
    db.query(
      'DELETE FROM messages WHERE message_id = ? AND sender_id = ?',
      [messageId, senderId],
      callback
    );
  }
};

module.exports = Message;
