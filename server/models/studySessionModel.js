const db = require('./db');

const StudySession = {
  getAll: (callback) => {
    db.query('SELECT * FROM study_sessions', callback);
  },

  getByGroupId: (groupId, callback) => {
    db.query('SELECT * FROM study_sessions WHERE group_id = ?', [groupId], callback);
  },

  getUpcomingByUserId: (userId, callback) => {
    const query = `
      SELECT ss.* FROM study_sessions ss
      JOIN group_members gm ON ss.group_id = gm.group_id
      WHERE gm.user_id = ? AND ss.session_date > NOW()
      ORDER BY ss.session_date ASC
    `;
    db.query(query, [userId], callback);
  },

  create: (data, callback) => {
    const { group_id, topic, session_date, location, created_by } = data;
    db.query(
      'INSERT INTO study_sessions (group_id, topic, session_date, location, created_by) VALUES (?, ?, ?, ?, ?)',
      [group_id, topic, session_date, location, created_by],
      callback
    );
  },

  update: (sessionId, data, callback) => {
    const { topic, session_date, location } = data;
    db.query(
      'UPDATE study_sessions SET topic = ?, session_date = ?, location = ? WHERE session_id = ?',
      [topic, session_date, location, sessionId],
      callback
    );
  },

  delete: (sessionId, callback) => {
    db.query('DELETE FROM study_sessions WHERE session_id = ?', [sessionId], callback);
  }
};

module.exports = StudySession;
