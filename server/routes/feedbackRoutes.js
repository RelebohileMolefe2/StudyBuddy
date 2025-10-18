const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authenticate = require('../middleware/authMiddleware');
 // middleware for auth (assumed)

// POST /feedback - add new feedback (user must be logged in)
router.post('/', authenticate, feedbackController.addFeedback);

// GET /feedback - get all feedback (admin only)
router.get('/', authenticate, /* middleware to check admin */ feedbackController.getAllFeedback);

// GET /feedback/:userId - get feedback by user
router.get('/:userId', authenticate, feedbackController.getFeedbackByUser);

// DELETE /feedback/:id - delete feedback (admin only)
router.delete('/:id', authenticate, /* middleware to check admin */ feedbackController.deleteFeedback);

module.exports = router;
