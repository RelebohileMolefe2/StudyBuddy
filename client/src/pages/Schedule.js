import React, { useState, useEffect } from 'react';
import '../assets/styles/Schedule.css';

function Schedule({ userId, token }) {
  const [sessions, setSessions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [topic, setTopic] = useState('');
  const [sessionDate, setSessionDate] = useState(''); // ISO datetime string
  const [selectedGroup, setSelectedGroup] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Fetch upcoming sessions for user
  useEffect(() => {
    if (!userId || !token) return;

    setLoadingSessions(true);
    setError('');

    fetch(`/api/study-sessions/upcoming/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load study sessions');
        return res.json();
      })
      .then(data => {
        setSessions(data || []);
        setLoadingSessions(false);
      })
      .catch(err => {
        setError(err.message);
        setLoadingSessions(false);
      });
  }, [userId, token]);

  // Fetch groups for dropdown
  // Fetch only the groups the user is a member of
useEffect(() => {
  if (!token) return;

  setLoadingGroups(true);

  fetch('/api/study-groups/my-groups', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to load user groups');
      return res.json();
    })
    .then(data => {
      setGroups(data || []);
      setLoadingGroups(false);
    })
    .catch(() => {
      setGroups([]);
      setLoadingGroups(false);
    });
}, [token]);

  // Handle form submit to create new session
  const handleCreateSession = (e) => {
    e.preventDefault();
    setFormError('');

    if (!topic.trim() || !sessionDate || !selectedGroup) {
      setFormError('Please fill in all fields.');
      return;
    }

    setFormLoading(true);

    fetch('/api/study-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topic: topic.trim(),
        session_date: sessionDate,
        group_id: selectedGroup,
        created_by: userId,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create session');
        return res.json();
      })
      .then(newSession => {
        setSessions(prev => [...prev, newSession]);
        setTopic('');
        setSessionDate('');
        setSelectedGroup('');
        setFormLoading(false);
      })
      .catch(err => {
        setFormError(err.message);
        setFormLoading(false);
      });
  };

  return (
    <div className="schedule-container" style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>Upcoming Study Sessions</h2>

      {loadingSessions ? (
        <p>Loading sessions...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : sessions.length === 0 ? (
        <p>No upcoming sessions found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {sessions.map(session => (
            <li key={session.session_id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10, borderRadius: 4 }}>
              <strong>Topic:</strong> {session.topic}<br />
              <strong>Date:</strong> {new Date(session.session_date).toLocaleString()}<br />
              <strong>Group:</strong> {session.group_name || session.group_id}<br />
              <strong>Created by:</strong> {session.created_by_name || 'Unknown'}
            </li>
          ))}
        </ul>
      )}

      {!loadingGroups && groups.length > 0 ? (
  <>
    <hr style={{ margin: '30px 0' }} />
    <h3>Create New Study Session</h3>
    <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label>
        Topic:<br />
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          disabled={formLoading}
          required
          style={{ width: '100%', padding: 8, fontSize: 16 }}
        />
      </label>

      <label>
        Date & Time:<br />
        <input
          type="datetime-local"
          value={sessionDate}
          onChange={e => setSessionDate(e.target.value)}
          disabled={formLoading}
          required
          style={{ width: '100%', padding: 8, fontSize: 16 }}
        />
      </label>

      <label>
        Group:<br />
        <select
          value={selectedGroup}
          onChange={e => setSelectedGroup(e.target.value)}
          disabled={formLoading}
          required
          style={{ width: '100%', padding: 8, fontSize: 16 }}
        >
          <option value="">-- Select Group --</option>
          {groups.map(g => (
            <option key={g.group_id} value={g.group_id}>
              {g.group_name}
            </option>
          ))}
        </select>
      </label>

      {formError && <p style={{ color: 'red' }}>{formError}</p>}

      <button
        type="submit"
        disabled={
          formLoading ||
          loadingGroups ||
          groups.length === 0 ||
          !selectedGroup
        }
        style={{ padding: 10, fontSize: 16 }}
      >
        {formLoading ? 'Creating...' : 'Create Session'}
      </button>
    </form>
  </>
) : (
  !loadingGroups && (
    <p style={{ color: '#666', marginTop: 40 }}>
      You are not part of any study groups. Join or create a group to schedule a session.
    </p>
  )
)}

    </div>
  );
}

export default Schedule;
