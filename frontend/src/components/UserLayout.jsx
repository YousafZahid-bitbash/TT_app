// src/components/UserLayout.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './UserLayout.css';

const UserLayout = ({ children }) => {
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
      if (!isDesktop && sidebarOpen && !event.target.closest('.sidebar-container') && !event.target.closest('[aria-label="Open sidebar"]')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, windowWidth, isDesktop]);

  return (
    <div className="user-layout" data-screen={isMobile ? 'mobile' : windowWidth <= 1024 ? 'tablet' : 'desktop'}>
      {/* Sidebar - show on desktop always, or when open on mobile/tablet */}
      {isDesktop ? (
        <div className="sidebar-container">
          <Sidebar
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
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar */}
            <div className="sidebar-container mobile-tablet">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isDesktop={isDesktop}
              />
            </div>
          </>
        )
      )}
  
      <div className="content-container">
        {/* Hamburger button for mobile/tablet */}
        {!isDesktop && (
          <button
            className="hamburger-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            style={{
              display: sidebarOpen ? 'none' : 'flex'
            }}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
        )}
        
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserLayout;