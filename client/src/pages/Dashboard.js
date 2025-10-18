import React, { useEffect, useState } from 'react';
import '../assets/styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [groups, setGroups] = useState([]); // user's groups
  const [allGroups, setAllGroups] = useState([]); // all available groups
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [joiningGroupId, setJoiningGroupId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user info from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      setError('User not logged in');
      setLoading(false);
    }
  }, []);

  // Fetch dashboard data after user is loaded
  useEffect(() => {
    if (!user?.user_id) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch Notifications
        try {
          const notifRes = await fetch(`/api/notifications/${user.user_id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const notifData = notifRes.ok ? await notifRes.json() : [];
          setNotifications(notifData);
        } catch {
          setNotifications([]);
        }

        // Fetch Groups
        try {
          const groupsRes = await fetch('/api/study-groups', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const groupsData = groupsRes.ok ? await groupsRes.json() : [];

          setAllGroups(groupsData);

          // Filter current user's groups
          const userGroups = groupsData.filter(group =>
  group.members.includes(user.user_id)
);

          setGroups(userGroups);
        } catch {
          setGroups([]);
        }

        // Fetch Sessions
        try {
          const sessionsRes = await fetch(`/api/study-sessions/upcoming/${user.user_id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const sessionsData = sessionsRes.ok ? await sessionsRes.json() : [];
          setSessions(sessionsData);
        } catch {
          setSessions([]);
        }

      } catch (err) {
        setError('Something went wrong loading your dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle join group
  const handleJoinGroup = async (groupId) => {
    if (!user?.user_id) return;
    setJoiningGroupId(groupId);

    try {
      const res = await fetch('/api/group-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ group_id: groupId }), // backend uses token to get user
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        const joinedGroup = allGroups.find(g => g.group_id === groupId);
        setGroups(prev => [...prev, joinedGroup]);
      } else {
        alert(data.message || 'Could not join group.');
      }
    } catch (err) {
      console.error(err);
      alert('Error joining group.');
    } finally {
      setJoiningGroupId(null);
    }
  };

  // Filter groups the user is NOT in
  const filteredAvailableGroups = allGroups.filter(group =>
    !groups.some(g => g.group_id === group.group_id) &&
    (
      group.group_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.study_style?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="dashboard-container">
      <h1>Welcome back, {user?.full_name || 'Student'}!</h1>

      {/* Notifications */}
      <section className="dashboard-section notifications">
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p>No notifications at this time.</p>
        ) : (
          <ul>
            {notifications.map((notif) => (
              <li key={notif.notification_id} className={notif.is_read ? '' : 'unread'}>
                <strong>{notif.title}</strong>
                <p>{notif.message}</p>
                <small>{new Date(notif.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* User's Groups */}
      <section className="dashboard-section groups">
        <h2>Your Study Groups</h2>
        {groups.length === 0 ? (
          <p>You are not part of any study groups yet.</p>
        ) : (
          <ul>
            {groups.map((group) => (
              <li key={group.group_id}>
                <strong>{group.group_name}</strong> - {group.description}
                <br />
                <small>
                  Meeting at {group.meeting_location} on {new Date(group.meeting_time).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Upcoming Sessions */}
      <section className="dashboard-section sessions">
        <h2>Upcoming Study Sessions</h2>
        {sessions.length === 0 ? (
          <p>No upcoming sessions scheduled.</p>
        ) : (
          <ul>
            {sessions.map((session) => (
              <li key={session.session_id}>
                <strong>{session.topic}</strong> for group #{session.group_id}
                <br />
                <small>
                  On {new Date(session.session_date).toLocaleString()} at {session.location}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Discover & Join Groups */}
      <section className="dashboard-section join-groups">
        <h2>Discover & Join Study Groups</h2>
        <input
          type="text"
          placeholder="Search by course, study style, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', marginBottom: '1em', width: '100%' }}
        />
        {filteredAvailableGroups.length === 0 ? (
          <p>No groups found matching your search.</p>
        ) : (
          <ul>
            {filteredAvailableGroups.map((group) => (
              <li key={group.group_id}>
                <strong>{group.group_name}</strong> - {group.description}
                <br />
                <small>
                  Study Style: {group.study_style || 'N/A'} <br />
                  Meeting at {group.meeting_location} on {new Date(group.meeting_time).toLocaleString()}
                </small>
                <br />
                <button
                  onClick={() => handleJoinGroup(group.group_id)}
                  disabled={joiningGroupId === group.group_id}
                >
                  {joiningGroupId === group.group_id ? 'Joining...' : 'Join Group'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
