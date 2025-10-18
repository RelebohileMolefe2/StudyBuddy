// src/components/Header.js
import React from "react";
import "../assets/styles/Header.css";
import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h2>📚 StudyBuddy</h2>
      </div>

      <div className="header-icons">
        <FaBell className="icon" title="Notifications" />
        <div className="profile-menu">
          <FaUserCircle className="icon profile" title="Profile" />
        </div>
      </div>
    </header>
  );
}

export default Header;
