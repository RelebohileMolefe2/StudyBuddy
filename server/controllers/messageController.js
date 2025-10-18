const Message = require('../models/messageModel');

exports.getMessagesByGroup = (req, res) => {
  const { groupId } = req.params;

  Message.getByGroupId(groupId, (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(results);
  });
};

exports.sendMessage = (req, res) => {
  const senderId = req.user.user_id;
  const { group_id, message_text } = req.body;

  if (!group_id || !message_text) {
    return res.status(400).json({ message: 'Group ID and message text are required' });
  }

  Message.create(group_id, senderId, message_text, (err, result) => {
    if (err) {
      console.error('Error sending message:', err);
      return res.status(500).json({ message: 'Could not send message' });
    }

    res.status(201).json(result); // Full message returned from model
  });
};

exports.deleteMessage = (req, res) => {
  const senderId = req.user.user_id;
  const { messageId } = req.params;

  Message.delete(messageId, senderId, (err, result) => {
    if (err) {
      console.error('Error deleting message:', err);
      return res.status(500).json({ message: 'Could not delete message' });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: 'Not allowed to delete this message' });
    }

    res.json({ message: 'Message deleted' });
  });
};
