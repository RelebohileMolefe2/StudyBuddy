const Course = require('../models/courseModel');

// GET /api/courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.getAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', error: err });
  }
};

// GET /api/courses/:id
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch course', error: err });
  }
};

// POST /api/courses
exports.createCourse = async (req, res) => {
  try {
    const newCourse = await Course.createCourse(req.body);
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create course', error: err });
  }
};

// PUT /api/courses/:id
exports.updateCourse = async (req, res) => {
  try {
    const updated = await Course.updateCourse(req.params.id, req.body);
    if (updated.affectedRows === 0) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update course', error: err });
  }
};

// DELETE /api/courses/:id
exports.deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.deleteCourse(req.params.id);
    if (deleted.affectedRows === 0) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete course', error: err });
  }
};
