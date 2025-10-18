import React, { useState, useEffect } from 'react';
import '../assets/styles/Groups.css';

const Groups = () => {
  const token = localStorage.getItem('token');

  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [expandedGroupId, setExpandedGroupId] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [newGroup, setNewGroup] = useState({
    group_name: '',
    description: '',
    course_id: '',
    preferred_style: '',
    max_members: '',
    meeting_location: '',
    meeting_time: ''
  });

  const userId = token ? JSON.parse(atob(token.split('.')[1])).user_id : null;

  useEffect(() => {
    if (!token || !userId) {
      setError('You must be logged in to view this page.');
      setLoading(false);
      return;
    }

    Promise.all([
      fetch('/api/study-groups', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/courses'),
      fetch(`/api/user-courses/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(async ([groupsRes, coursesRes, userCoursesRes]) => {
        const groupsData = await groupsRes.json();
        const coursesData = await coursesRes.json();
        const userCoursesData = await userCoursesRes.json();

        const userGroupList = groupsData.filter(group =>
          group.members.includes(userId)
        );
        const otherGroupList = groupsData.filter(group =>
          !group.members.includes(userId)
        );

        setGroups(groupsData);
        setUserGroups(userGroupList);
        setOtherGroups(otherGroupList);
        setCourses(coursesData);
        setUserCourses(userCoursesData);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load data.');
        setLoading(false);
      });
  }, [token]);

  const handleExpandGroup = (groupId) => {
    setExpandedGroupId(prev => (prev === groupId ? null : groupId));
  };

  const handleJoinGroup = async (groupId) => {
    setMessage('');
    setError('');
    try {
      const res = await fetch(`/api/study-groups/${groupId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to join group');

      // Refresh group data
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    setMessage('');
    setError('');
    try {
      const res = await fetch(`/api/group-members/${groupId}/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to leave group');

      // Refresh group data
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewGroupChange = (e) => {
    const { name, value } = e.target;
    setNewGroup(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/study-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newGroup)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create group');

      setMessage('Group created successfully!');
      setNewGroup({
        group_name: '',
        description: '',
        course_id: '',
        preferred_style: '',
        max_members: '',
        meeting_location: '',
        meeting_time: ''
      });

      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="message-error">{error}</p>;

  return (
    <div className="study-groups-container">
      <h1>Study Groups</h1>

      {/* === USER'S GROUPS === */}
      {userGroups.length > 0 && (
        <section className="user-groups">
          <h2>Your Groups</h2>
          <ul>
            {userGroups.map(group => (
              <li key={group.group_id}>
                <h3>{group.group_name}</h3>
                <p>{group.description}</p>
                <button onClick={() => handleLeaveGroup(group.group_id)}>Leave Group</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* === OTHER GROUPS === */}
      <section className="other-groups">
        <h2>Available Groups</h2>
        {otherGroups.length === 0 ? (
          <p>No other groups available.</p>
        ) : (
          <ul>
            {otherGroups.map(group => (
              <li key={group.group_id}>
                <h3>{group.group_name}</h3>
                <p>{group.description}</p>
                <button onClick={() => handleExpandGroup(group.group_id)}>
                  {expandedGroupId === group.group_id ? 'Hide Details' : 'View Details'}
                </button>
                {expandedGroupId === group.group_id && (
                  <div className="group-details">
                    <p><strong>Preferred Style:</strong> {group.preferred_style}</p>
                    <p><strong>Max Members:</strong> {group.max_members}</p>
                    <p><strong>Meeting Time:</strong> {group.meeting_time}</p>
                    <p><strong>Location:</strong> {group.meeting_location}</p>
                    <button onClick={() => handleJoinGroup(group.group_id)}>Join Group</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* === CREATE GROUP === */}
      <section className="create-group">
        <h2>Create New Group</h2>
        <form onSubmit={handleCreateGroup}>
          <label>
            Group Name:
            <input
              type="text"
              name="group_name"
              value={newGroup.group_name}
              onChange={handleNewGroupChange}
              required
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={newGroup.description}
              onChange={handleNewGroupChange}
              required
            />
          </label>

          <label>
            Course:
            <select
              name="course_id"
              value={newGroup.course_id}
              onChange={handleNewGroupChange}
              required
            >
              <option value="">-- Select Course --</option>
              {courses.map(course => (
  <option key={course.course_id} value={course.course_id}>
    {course.course_code} - {course.course_name}
  </option>
))}
            </select>
          </label>

          <label>
  Preferred Study Style:
  <select
    name="preferred_style"
    value={newGroup.preferred_style}
    onChange={handleNewGroupChange}
    required
  >
    <option value="">-- Select Style --</option>
    <option value="individual">Individual</option>
    <option value="group">Group</option>
    <option value="visual">Visual</option>
    <option value="auditory">Auditory</option>
    <option value="reading/writing">Reading/Writing</option>
  </select>
</label>
          <label>
            Max Members:
            <input
              type="number"
              name="max_members"
              value={newGroup.max_members}
              onChange={handleNewGroupChange}
              required
            />
          </label>

          <label>
            Meeting Location:
            <input
              type="text"
              name="meeting_location"
              value={newGroup.meeting_location}
              onChange={handleNewGroupChange}
              required
            />
          </label>

          <label>
  Meeting Time:
  <input
    type="datetime-local"
    name="meeting_time"
    value={newGroup.meeting_time}
    onChange={handleNewGroupChange}
    required
  />
</label>
          <button type="submit">Create Group</button>
        </form>
      </section>

      {message && <p className="message-success">{message}</p>}
    </div>
  );
};

export default Groups;
