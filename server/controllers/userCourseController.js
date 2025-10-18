const db = require('../models/db');

// Get all user-course links (admin view)
exports.getAllUserCourses = (req, res) => {
  db.query('SELECT * FROM user_courses', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
};

// Get all courses for a single user
exports.getCoursesByUserId = (req, res) => {
  const userId = req.params.userId;

  db.query(
    `SELECT c.* FROM courses c 
     JOIN user_courses uc ON c.course_id = uc.course_id 
     WHERE uc.user_id = ?`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(results);
    }
  );
};

// Enroll user in a course
exports.enrollCourse = (req, res) => {
  const userId = req.user.user_id; // From token
  const { course_id } = req.body;

  if (!course_id) {
    return res.status(400).json({ message: 'course_id is required' });
  }

  db.query(
    'INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)',
    [userId, course_id],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'User already enrolled in this course' });
        }
        return res.status(500).json({ message: 'Database error' });
      }

      res.status(201).json({ message: 'Course enrolled successfully' });
    }
  );
};

// Unenroll user from a course
exports.unenrollCourse = (req, res) => {
  const userId = req.user.user_id;
  const courseId = req.params.courseId;

  db.query(
    'DELETE FROM user_courses WHERE user_id = ? AND course_id = ?',
    [userId, courseId],
    (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'Course unenrolled successfully' });
    }
  );
};
