// src/components/AdminLayout.jsx
import React from 'react';
import AdminSidebar from './AdminSideBar'; // Import Admin Sidebar
import './AdminLayout.css'; // This is optional if you already have the necessary styles

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar /> {/* Sidebar component for user pages */}
      <div className="content">
        {children} {/* Render the page content here */}
      </div>
    </div>
  );
};

export default AdminLayout;