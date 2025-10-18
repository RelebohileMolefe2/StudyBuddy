// src/components/AppLayout.js
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import '../assets/styles/Layout.css';

const AppLayout = ({ children }) => {
  return (
    <div className="layout-root">
      <Header />
      <div className="layout-container">
        <Sidebar />
        <main className="layout-content">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
