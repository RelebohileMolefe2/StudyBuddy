import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    password: '',
    department: '',
    year_of_study: '',
    study_style: '',
    availability: ''
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    // Fetch user profile
    fetch('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setForm({
          full_name: data.full_name || '',
          password: '',
          department: data.department || '',
          year_of_study: data.year_of_study || '',
          study_style: data.study_style || '',
          availability: data.availability || ''
        });

        // Fetch user courses
        return fetch(`/api/user-courses/${data.user_id}`);
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch courses');
        return res.json();
      })
      .then(coursesData => {
        setCourses(coursesData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Update profile info
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to update profile');

      // Upload picture if selected
      if (profilePicFile) {
        const formData = new FormData();
        formData.append('profile_picture', profilePicFile);

        const uploadRes = await fetch('/api/user/upload-profile-picture', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
            // NOTE: Do NOT set Content-Type for FormData, browser sets it automatically
          },
          body: formData
        });

        if (!uploadRes.ok) throw new Error('Failed to upload profile picture');

        const uploadData = await uploadRes.json();
        setUser(prev => ({ ...prev, profile_picture: uploadData.url }));
      }

      setMessage('Profile updated successfully');
      setForm(prev => ({ ...prev, password: '' }));
      setProfilePicFile(null);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      const res = await fetch(`/api/user-courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to unenroll from course');

      setCourses(prev => prev.filter(c => c.course_id !== courseId));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to unenroll from course');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete account');

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete account');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="message-error">{error}</p>;

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      {user?.profile_picture && (
        <div className="profile-header">
          <img
            src={user.profile_picture}
            alt="Profile"
          />
        </div>
      )}

      <form onSubmit={handleUpdateProfile}>
        <label>
          Full Name:
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password: (leave blank to keep unchanged)
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        <label>
          Department:
          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
          />
        </label>

        <label>
          Year of Study:
          <input
            type="number"
            name="year_of_study"
            value={form.year_of_study}
            onChange={handleChange}
            min={1}
          />
        </label>

        <label>
          Study Style:
          <input
            type="text"
            name="study_style"
            value={form.study_style}
            onChange={handleChange}
          />
        </label>

        <label>
          Availability:
          <input
            type="text"
            name="availability"
            value={form.availability}
            onChange={handleChange}
          />
        </label>

        <label>
          Profile Picture:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <button type="submit">Update Profile</button>
      </form>

      {message && <p className="message-success">{message}</p>}

      <hr />

      <h2>Your Enrolled Courses</h2>
      {courses.length === 0 ? (
        <p>You have no enrolled courses.</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course.course_id}>
              {course.course_name || course.course_title || 'Course'}
              <button onClick={() => handleUnenroll(course.course_id)}>Unenroll</button>
            </li>
          ))}
        </ul>
      )}

      <hr />

      <button onClick={handleDeleteAccount} style={{ color: 'red' }}>
        Delete Account
      </button>

      <button onClick={handleLogout} style={{ marginLeft: 10 }}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
