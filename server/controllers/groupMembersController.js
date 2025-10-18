const db = require('../models/db');

// GET all group memberships (admin)
exports.getAllGroupMembers = (req, res) => {
  db.query('SELECT * FROM group_members', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

// GET all members of a specific group
exports.getGroupMembers = (req, res) => {
  const { group_id } = req.params;
  db.query(
    'SELECT gm.*, u.full_name, u.email FROM group_members gm JOIN users u ON gm.user_id = u.user_id WHERE group_id = ?',
    [group_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    }
  );
};
// POST: Add user to group (Join group)
exports.joinGroup = (req, res) => {
  const { group_id, role } = req.body;
  const user_id = req.user.user_id;

  // First, get group_name for notification message
  db.query('SELECT group_name FROM study_groups WHERE group_id = ?', [group_id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: 'Group not found' });
    }

    const group_name = results[0].group_name;

    // Insert user into group_members
    db.query(
      'INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)',
      [group_id, user_id, role || 'member'],
      async (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Already in group' });
          }
          return res.status(500).json({ error: 'Database error' });
        }

        // Create notification after successful join
        try {
          await createNotification(
            user_id,
            'Joined a Study Group',
            `You have joined the group "${group_name}"`,
            'group'
          );
          res.status(201).json({ message: 'Joined group successfully' });
        } catch (notifErr) {
          console.error('Notification error:', notifErr);
          // Still send success response, notification failure is not critical here
          res.status(201).json({ message: 'Joined group successfully, but notification failed' });
        }
      }
    );
  });
};

// PUT: Update member’s role
exports.updateRole = (req, res) => {
  const { group_id, user_id } = req.params;
  const { role } = req.body;

  db.query(
    'UPDATE group_members SET role = ? WHERE group_id = ? AND user_id = ?',
    [role, group_id, user_id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Role updated successfully' });
    }
  );
};

// DELETE: Remove user from group
exports.leaveGroup = (req, res) => {
  const { group_id, user_id } = req.params;

  db.query(
    'DELETE FROM group_members WHERE group_id = ? AND user_id = ?',
    [group_id, user_id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'User removed from group' });
    }
  );
};
