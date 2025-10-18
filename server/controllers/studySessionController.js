const StudySession = require('../models/studySessionModel');
const db = require('../models/db'); // for manual queries
const Notification = require('../models/notificationModel');

exports.getAllSessions = (req, res) => {
  StudySession.getAll((err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

exports.getByGroupId = (req, res) => {
  StudySession.getByGroupId(req.params.group_id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

exports.getUpcomingByUser = (req, res) => {
  StudySession.getUpcomingByUserId(req.params.user_id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

exports.createSession = (req, res) => {
  const created_by = req.user.user_id; // from token
  const { group_id, topic, session_date, location } = req.body;

  // Step 1: Create the session
  StudySession.create({ group_id, topic, session_date, location, created_by }, (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to create session' });

    // Step 2: Get the group name
    db.query('SELECT group_name FROM study_groups WHERE group_id = ?', [group_id], (err, groupResults) => {
      const groupName = groupResults?.[0]?.group_name || 'a study group';

      // Step 3: Get all group members except creator
      const memberSql = 'SELECT user_id FROM group_members WHERE group_id = ? AND user_id != ?';
      db.query(memberSql, [group_id, created_by], async (err, memberResults) => {
        if (err) {
          console.error('Error fetching group members for notification:', err);
          return res.status(201).json({ message: 'Study session created, but notification failed' });
        }

        // Step 4: Send a notification to each user
        const notifyPromises = memberResults.map((row) =>
          Notification.create(
            row.user_id,
            'New Study Session Scheduled',
            `A new session for "${groupName}" has been scheduled on ${new Date(session_date).toLocaleString()}: ${topic}`,
            'session'
          )
        );

        try {
          await Promise.all(notifyPromises);
        } catch (err) {
          console.error('Error sending notifications:', err);
          // Don't fail the main request
        }

        res.status(201).json({ message: 'Study session created and users notified', sessionId: result.insertId });
      });
    });
  });
};

exports.updateSession = (req, res) => {
  const sessionId = req.params.session_id;
  const { topic, session_date, location } = req.body;

  StudySession.update(sessionId, { topic, session_date, location }, (err) => {
    if (err) return res.status(500).json({ message: 'Failed to update session' });
    res.json({ message: 'Study session updated successfully' });
  });
};

exports.deleteSession = (req, res) => {
  const sessionId = req.params.session_id;

  StudySession.delete(sessionId, (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete session' });
    res.json({ message: 'Study session deleted successfully' });
  });
};
