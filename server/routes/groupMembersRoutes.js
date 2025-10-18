const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const controller = require('../controllers/groupMembersController');

// Get all group memberships (admin)
router.get('/', verifyToken, controller.getAllGroupMembers);

// Get all members in a specific group
router.get('/:group_id', verifyToken, controller.getGroupMembers);

// Join a group
router.post('/', verifyToken, controller.joinGroup);

// Update a member’s role
router.put('/:group_id/:user_id', verifyToken, controller.updateRole);

// Remove user from group
router.delete('/:group_id/:user_id', verifyToken, controller.leaveGroup);

module.exports = router;
