const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const controller = require('../controllers/userCourseController');

const router = express.Router();

// Public (admin/dev use)
router.get('/', controller.getAllUserCourses);

// Public (view user's courses)
router.get('/:userId', controller.getCoursesByUserId);

// Private (logged-in user adds a course)
router.post('/', verifyToken, controller.enrollCourse);

// Private (logged-in user removes a course)
router.delete('/:courseId', verifyToken, controller.unenrollCourse);

module.exports = router;
