// src/components/Sidebar.js
import React from "react";
import "../assets/styles/Sidebar.css";
import {
  FaHome,
  FaUsers,
  FaComments,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaCommentDots,
  FaSignOutAlt,
  FaUser
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/dashboard" className="nav-item"><FaHome /> Dashboard</NavLink>
        <NavLink to="/profile" className="nav-item"><FaUser /> Profile</NavLink> {/* ✅ Added Profile */}
        <NavLink to="/groups" className="nav-item"><FaUsers /> Study Groups</NavLink>
        <NavLink to="/chat" className="nav-item"><FaComments /> Chat</NavLink>
        <NavLink to="/schedule" className="nav-item"><FaCalendarAlt /> Sessions</NavLink>
        <NavLink to="/notifications" className="nav-item"><FaBell /> Notifications</NavLink>
        <NavLink to="/settings" className="nav-item"><FaCog /> Settings</NavLink>
        <NavLink to="/feedback" className="nav-item"><FaCommentDots /> Feedback</NavLink>
      </nav>

      <div className="logout-section">
        <button className="logout-btn"><FaSignOutAlt /> Logout</button>
      </div>
    </aside>
  );
}

export default Sidebar;
