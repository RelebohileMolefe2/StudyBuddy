const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const studyGroupsController = require('../controllers/studyGroupsController');

// Public: View all or one group
router.get('/study-groups', verifyToken, studyGroupsController.getAllGroups);
router.get('/study-groups/:id', verifyToken, studyGroupsController.getGroupById);

// Private: Create, update, delete
router.post('/study-groups', verifyToken, studyGroupsController.createGroup);
router.put('/study-groups/:id', verifyToken, studyGroupsController.updateGroup);
router.delete('/study-groups/:id', verifyToken, studyGroupsController.deleteGroup);
// routes/studyGroups.js
router.post('/study-groups/:id/join', verifyToken, studyGroupsController.joinGroup);
// ✅ Get all groups the user is a member of
router.get('/my-groups', verifyToken, studyGroupsController.getGroupsByUser);

module.exports = router;
