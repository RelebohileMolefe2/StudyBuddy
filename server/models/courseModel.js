const db = require('./db');

// Get all courses
exports.getAllCourses = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM courses', (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Get one course
exports.getCourseById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM courses WHERE course_id = ?', [id], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};

// Create new course
exports.createCourse = (course) => {
  const { course_code, course_name, department, year_level } = course;
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO courses (course_code, course_name, department, year_level) VALUES (?, ?, ?, ?)',
      [course_code, course_name, department, year_level],
      (err, results) => {
        if (err) reject(err);
        else resolve({ course_id: results.insertId, ...course });
      }
    );
  });
};

// Update a course
exports.updateCourse = (id, course) => {
  const { course_code, course_name, department, year_level } = course;
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE courses SET course_code = ?, course_name = ?, department = ?, year_level = ? WHERE course_id = ?`,
      [course_code, course_name, department, year_level, id],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
};

// Delete a course
exports.deleteCourse = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM courses WHERE course_id = ?', [id], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};
