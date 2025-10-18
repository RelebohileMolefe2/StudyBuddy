const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// RESTful endpoints
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);
router.post('/', courseController.createCourse); // Optionally protect this for admin only
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
