// src/components/UserLayout.jsx
import React from 'react';
import Sidebar from './Sidebar'; // Import Sidebar
import './UserLayout.css'; // This is optional if you already have the necessary styles

const UserLayout = ({ children }) => {
  return (
    <div className="user-layout">
      <Sidebar /> {/* Sidebar component for user pages */}
      <div className="content">
        {children} {/* Render the page content here */}
      </div>
    </div>
  );
};

export default UserLayout;