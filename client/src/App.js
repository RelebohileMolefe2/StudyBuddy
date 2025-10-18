import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Core pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Feature pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Schedule from './pages/Schedule';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';
import Groups from './pages/Groups'; // ✅ ADD THIS LINE

// Layout
import AppLayout from './components/AppLayout';

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes - no layout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected/Feature Routes - with AppLayout */}
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
        <Route path="/chat" element={<AppLayout><Chat /></AppLayout>} />
        <Route path="/schedule" element={<AppLayout><Schedule /></AppLayout>} />
        <Route path="/notifications" element={<AppLayout><Notifications /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
        <Route path="/feedback" element={<AppLayout><Feedback /></AppLayout>} />

        {/* ✅ New route for study groups */}
        <Route path="/groups" element={<AppLayout><Groups /></AppLayout>} />

      </Routes>
    </Router>
  );
}

export default App;
