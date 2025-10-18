const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

// Get all messages in a group
router.get('/:groupId', verifyToken, messageController.getMessagesByGroup);

// Send a new message
router.post('/', verifyToken, messageController.sendMessage);

// Delete a message (optional)
router.delete('/:messageId', verifyToken, messageController.deleteMessage);

module.exports = router;
