import React, { useState, useEffect, useRef } from 'react';
import '../assets/styles/Chat.css';

function Chat() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const currentUserId = user?.user_id;

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch user's groups
  useEffect(() => {
    fetch('/api/study-groups', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch groups');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setGroups(data);
        } else {
          console.error('Invalid group data:', data);
          setGroups([]);
        }
      })
      .catch(err => {
        console.error(err);
        setGroups([]);
      });
  }, [token]);

  // Fetch messages for selected group
  useEffect(() => {
    if (!selectedGroup) return;

    setLoadingMessages(true);
    setError('');

    fetch(`/api/messages/${selectedGroup.group_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setMessages(data || []);
        setLoadingMessages(false);
        scrollToBottom();
      })
      .catch(() => {
        setError('Failed to load messages');
        setLoadingMessages(false);
      });
  }, [selectedGroup, token]);

  // Send message handler
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    setError('');

    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        group_id: selectedGroup.group_id,
        message_text: newMessage.trim(),
      }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to send message');
        }
        return res.json();
      })
      .then(sent => {
        setMessages(prev => [...prev, {
          ...sent,
          sender_id: currentUserId,
          sender_name: 'You',
        }]);
        setNewMessage('');
        scrollToBottom();
      })
      .catch(() => setError('Failed to send message'));
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
  <div className="chat-app">
    {/* Sidebar: Your Groups */}
    <aside className="chat-sidebar">
      <h3>Your Groups</h3>
      {groups.length === 0 && <p>No groups found.</p>}
      <ul className="group-list">
        {groups.map(group => (
          <li
            key={group.group_id}
            className={selectedGroup?.group_id === group.group_id ? 'active' : ''}
            onClick={() => setSelectedGroup(group)}
          >
            <strong>{group.group_name}</strong>
            <p>{group.description}</p>
          </li>
        ))}
      </ul>
    </aside>

    {/* Chat Panel */}
    <div className="chat-container">
      {selectedGroup ? (
        <>
          <h2 className="chat-title">{selectedGroup.group_name} Chat</h2>

          {loadingMessages ? (
            <p>Loading messages...</p>
          ) : (
            <>
              <div className="messages-container">
                {messages.length === 0 && (
                  <p className="no-messages">No messages yet.</p>
                )}
                {messages.map(msg => (
                  <div
                    key={msg.message_id}
                    className={`message ${msg.sender_id === currentUserId ? 'you' : ''}`}
                  >
                    <span className="sender">
                      {msg.sender_id === currentUserId ? 'You' : msg.sender_name || 'Unknown'}:
                    </span>
                    <span>{msg.message}</span>
                    <div className="timestamp">
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Invalid Time'}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="input-container">
                <textarea
                  rows={2}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="textarea"
                />
                <button onClick={handleSendMessage} className="send-button">
                  Send
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <p className="select-group-msg">Select a group to start chatting.</p>
      )}
    </div>
  </div>
);
}

export default Chat;
