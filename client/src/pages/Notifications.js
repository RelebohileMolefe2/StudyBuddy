import React, { useEffect, useState } from 'react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get token and user from localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); // should contain user_id

  useEffect(() => {
    if (!user || !token) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications/${user.user_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, token]);

  if (loading) return <p>Loading notifications...</p>;
  if (!notifications.length) return <p>No notifications yet.</p>;

  return (
    <div className="notifications-page">
      <h2>Your Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.notification_id} style={{ marginBottom: '10px' }}>
            <strong>{notification.title}</strong>: {notification.message}
            <br />
            <small>{new Date(notification.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
