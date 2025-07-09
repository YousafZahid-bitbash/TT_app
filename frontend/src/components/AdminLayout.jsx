// src/components/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSideBar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktop = windowWidth > 1024;
  const isMobile = windowWidth < 600;

  // Close sidebar when clicking outside on mobile/tablet
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isDesktop && sidebarOpen && !event.target.closest('.admin-sidebar-container') && !event.target.closest('[aria-label="Open sidebar"]')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, windowWidth, isDesktop]);

  return (
    <div className="admin-layout" data-screen={isMobile ? 'mobile' : windowWidth <= 1024 ? 'tablet' : 'desktop'}>
      {/* Sidebar - show on desktop always, or when open on mobile/tablet */}
      {isDesktop ? (
        <div className="admin-sidebar-container">
          <AdminSidebar
            sidebarOpen={true}
            setSidebarOpen={setSidebarOpen}
            isDesktop={isDesktop}
          />
        </div>
      ) : (
        sidebarOpen && (
          <>
            {/* Overlay for mobile/tablet */}
            <div 
              className="admin-sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar */}
            <div className="admin-sidebar-container mobile-tablet">
              <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isDesktop={isDesktop}
              />
            </div>
          </>
        )
      )}
  
      <div className="admin-content-container">
        {/* Hamburger button for mobile/tablet */}
        {!isDesktop && (
          <button
            className="admin-hamburger-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            style={{
              display: sidebarOpen ? 'none' : 'flex'
            }}
          >
            <div className="admin-hamburger-line"></div>
            <div className="admin-hamburger-line"></div>
            <div className="admin-hamburger-line"></div>
          </button>
        )}
        
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;