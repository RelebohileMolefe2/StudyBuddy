const db = require('../models/db');
const Notification = require('../models/notificationModel');

exports.getAllGroups = (req, res) => {
  const sql = `
    SELECT sg.*, GROUP_CONCAT(gm.user_id) AS members
    FROM study_groups sg
    LEFT JOIN group_members gm ON sg.group_id = gm.group_id
    GROUP BY sg.group_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching groups', error: err });
    }

    // Parse the members string into an array of numbers
    const parsedResults = results.map(group => ({
      ...group,
      members: group.members ? group.members.split(',').map(id => parseInt(id, 10)) : []
    }));

    res.json(parsedResults);
  });
};

exports.getGroupById = (req, res) => {
  const groupId = req.params.id;

  db.query('SELECT * FROM study_groups WHERE group_id = ?', [groupId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching group' });
    if (results.length === 0) return res.status(404).json({ message: 'Group not found' });
    res.json(results[0]);
  });
};

exports.createGroup = (req, res) => {
  const { course_id, group_name, description, max_members, preferred_style, meeting_location, meeting_time } = req.body;
  console.log('Request body:', req.body);
  const created_by = req.user.user_id;

  const sql = `
    INSERT INTO study_groups 
    (course_id, group_name, description, max_members, preferred_style, meeting_location, meeting_time, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [course_id, group_name, description, max_members, preferred_style, meeting_location, meeting_time, created_by], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating group', error: err });
    res.status(201).json({ message: 'Study group created successfully', group_id: result.insertId });
     submitted: req.body
  });
};

exports.updateGroup = (req, res) => {
  const groupId = req.params.id;
  const { group_name, description, meeting_time, meeting_location, max_members, preferred_style } = req.body;

  db.query(
    `UPDATE study_groups SET 
      group_name = ?, 
      description = ?, 
      meeting_time = ?, 
      meeting_location = ?, 
      max_members = ?, 
      preferred_style = ? 
    WHERE group_id = ?`,
    [group_name, description, meeting_time, meeting_location, max_members, preferred_style, groupId],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error updating group' });
      res.json({ message: 'Group updated successfully' });
    }
  );
};

exports.deleteGroup = (req, res) => {
  const groupId = req.params.id;
  const userId = req.user.user_id;

  // Only allow delete if the group was created by this user
  db.query('DELETE FROM study_groups WHERE group_id = ? AND created_by = ?', [groupId, userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting group' });

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: 'You are not authorized to delete this group' });
    }

    res.json({ message: 'Group deleted successfully' });
  });
  
};
// controllers/studyGroupsController.js
exports.joinGroup = (req, res) => {
  const groupId = req.params.id;
  const userId = req.user.user_id;

  const checkSql = 'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?';
  db.query(checkSql, [groupId, userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error checking membership' });

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already a member of this group' });
    }

    const insertSql = 'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)';
    db.query(insertSql, [groupId, userId], (err) => {
      if (err) return res.status(500).json({ message: 'Error joining group' });

      // ✅ Get group name for the notification message
      db.query('SELECT group_name FROM study_groups WHERE group_id = ?', [groupId], (err, groupResults) => {
        const groupName = groupResults?.[0]?.group_name || 'a study group';

        // ✅ Create notification
        Notification.create(
          userId,
          'Group Joined',
          `You have joined the study group "${groupName}".`,
          'group'
        ).then(() => {
          res.status(200).json({ message: 'Joined group successfully and notification sent' });
        }).catch((err) => {
          console.error('Notification error:', err);
          // Still succeed, even if notification fails
          res.status(200).json({ message: 'Joined group successfully ' });
        });
      });
    });
  });
};
// ✅ Get all groups the logged-in user is a member of
exports.getGroupsByUser = (req, res) => {
  const userId = req.user.user_id;

  const sql = `
    SELECT sg.group_id, sg.group_name, sg.description
    FROM study_groups sg
    INNER JOIN group_members gm ON sg.group_id = gm.group_id
    WHERE gm.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user groups' });
    res.json(results);
  });
};

