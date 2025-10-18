const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const controller = require('../controllers/studySessionController');

router.get('/study-sessions', verifyToken, controller.getAllSessions);
router.get('/study-sessions/:group_id', verifyToken, controller.getByGroupId);
router.get('/study-sessions/upcoming/:user_id', verifyToken, controller.getUpcomingByUser);
router.post('/study-sessions', verifyToken, controller.createSession);
router.put('/study-sessions/:session_id', verifyToken, controller.updateSession);
router.delete('/study-sessions/:session_id', verifyToken, controller.deleteSession);

module.exports = router;
