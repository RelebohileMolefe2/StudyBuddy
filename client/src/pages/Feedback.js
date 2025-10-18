import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ correct
 // ⚠️ Make sure to `npm install jwt-decode`

function Feedback({ userId: propUserId = null, token: propToken = null }) {
  const [feedbackText, setFeedbackText] = useState('');
  const [status, setStatus] = useState('');
  const [myFeedback, setMyFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(propUserId);
  const [token, setToken] = useState(propToken);

  // 🔍 Load token and decode userId from localStorage if not passed in
  useEffect(() => {
    const savedToken = propToken || localStorage.getItem('token');
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        setToken(savedToken);
        setUserId(decoded.user_id || decoded.id); // Use the correct key depending on your token
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, [propToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setStatus('You must be logged in to submit feedback.');
      return;
    }

    if (!feedbackText.trim()) {
      setStatus('Feedback cannot be empty.');
      return;
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: 'General',
          message: feedbackText
        })
      });

      if (!res.ok) throw new Error('Error submitting feedback');

      setStatus('✅ Thank you for your feedback!');
      setFeedbackText('');
      fetchMyFeedback(); // Refresh after submission
    } catch (err) {
      console.error('Feedback submission error:', err);
      setStatus('❌ Something went wrong while submitting feedback.');
    }
  };

  const fetchMyFeedback = async () => {
    if (!userId || !token) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/feedback/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Could not load your feedback');

      const data = await res.json();
      setMyFeedback(data);
    } catch (err) {
      console.error('Fetch feedback error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchMyFeedback();
    }
  }, [userId, token]);

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">Submit Feedback</h2>

      <form onSubmit={handleSubmit} className="feedback-form">
        <textarea
          className="feedback-input"
          placeholder="Tell us what you think, report bugs, or suggest improvements..."
          rows="5"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        />

        <button type="submit" className="feedback-submit">
          Submit
        </button>

        {status && <p className="feedback-status">{status}</p>}
      </form>

      <hr className="divider" />

      <h3 className="feedback-subtitle">Your Past Feedback</h3>

      {loading ? (
        <p>Loading your feedback...</p>
      ) : myFeedback.length === 0 ? (
        <p className="no-feedback">You haven’t submitted any feedback yet.</p>
      ) : (
        <ul className="feedback-list">
          {myFeedback.map((item) => (
            <li key={item.feedback_id} className="feedback-item">
              <p>{item.message}</p>
              <span className="feedback-date">
                {new Date(item.submitted_at || item.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Feedback;
