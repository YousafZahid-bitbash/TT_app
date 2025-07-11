import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Zap,
  FolderOpen,
  LogOut,
  Package2,
} from 'lucide-react';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen, isDesktop }) => {
  const [userRole, setUserRole] = useState('Brand Admin');
  const location = useLocation();

  // Handle navigation click - close sidebar on mobile/tablet
  const handleNavClick = () => {
    if (!isDesktop && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const styles = {
    sidebar: {
      width: '100%',
      maxWidth: '256px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      zIndex: 1000,
      overflowY: 'auto'
    },
    logoSection: {
      padding: '24px',
      borderBottom: '1px solid #e5e7eb'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      backgroundColor: '#fb923c',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    accountSection: {
      padding: '16px 24px',
      borderBottom: '1px solid #e5e7eb'
    },
    accountTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: '8px'
    },
    roleContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    roleText: {
      fontSize: '12px',
      color: '#6b7280'
    },
    switchButton: {
      fontSize: '12px',
      color: '#ea580c',
      textDecoration: 'underline',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    },
    nav: {
      flex: 1,
      padding: '8px 16px',
      overflowY: 'auto'
    },
    navSection: {
      marginBottom: '24px'
    },
    sectionTitle: {
      padding: '0 12px',
      marginBottom: '8px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    navList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      fontSize: '14px',
      fontWeight: '500',
      borderRadius: '8px',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    },
    navItemActive: {
      color: 'rgba(67, 66, 66, 0.73)',
      backgroundColor: '#FFFFFF'
    },
    navItemInactive: {
      color: '#6b7280',
      backgroundColor: 'transparent'
    },
    navItemHover: {
      color: 'rgb(234, 88, 12)',
      backgroundColor: 'rgb(253, 246, 235)'
    },
    navIcon: {
      width: '16px',
      height: '16px',
      marginRight: '12px'
    },
    badge: {
      marginLeft: 'auto',
      fontSize: '10px',
      backgroundColor: '#fff7ed',
      color: '#ea58c',
      padding: '2px 4px',
      borderRadius: '4px'
    },
    progressSection: {
      marginBottom: '24px',
      padding: '0 12px'
    },
    progressTitle: {
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#fb923c',
      width: '65%',
      borderRadius: '4px'
    },
    progressText: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px'
    },
    alertSection: {
      marginBottom: '16px',
      padding: '0 12px'
    },
    alertBox: {
      backgroundColor: '#fefce8',
      border: '1px solid #fde047',
      borderRadius: '8px',
      padding: '12px'
    },
    alertTitle: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '12px',
      color: '#92400e',
      marginBottom: '4px',
      gap: '4px'
    },
    alertContent: {
      fontSize: '12px',
      color: '#a16207'
    },
    bottomSection: {
      padding: '16px',
      borderTop: '1px solid #e5e7eb'
    }
  };

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      active: true,
      module: 'Dashboard Overview',
      description: 'View metrics by brand or global'
    },
    
  ];

  const settingsItems = [
    {
      id: 'resources',
      name: 'Resources',
      href: '/resources',
      icon: FolderOpen
    },
    {
      id: 'account-settings',
      name: 'Account Settings',
      href: '/account-settings',
      icon: Settings
    },
    {
      id: 'setup-wizard',
      name: 'Set-Up Wizard',
      href: '/setup-wizard',
      icon: Zap
    }
  ];

  const bottomItems = [
    {
      id: 'affiliate-program',
      name: 'Affiliate Program',
      href: '/affiliate-program',
      icon: Users
    },
    {
      id: 'logout',
      name: 'Logout',
      href: '/logout',
      icon: LogOut
    },
    {
      id: 'inverted',
      name: 'inverted',
      href: '/inverted',
      icon: Package2
    }
  ];

  const filteredNavItems = navigationItems.filter(item => 
    !item.superAdminOnly || userRole === 'Super Admin'
  );

  const handleNavItemHover = (e) => {
    if (!e.target.closest('[data-active="true"]')) {
      Object.assign(e.target.style, styles.navItemHover);
    }
  };

  const handleNavItemLeave = (e) => {
    if (!e.target.closest('[data-active="true"]')) {
      Object.assign(e.target.style, styles.navItemInactive);
    }
  };

  return (
    <div style={styles.sidebar}>
      {/* Close button for mobile/tablet sidebar */}
      {!isDesktop && sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            zIndex: 2002,
            background: 'white',
            border: '1.5px solid #e5e7eb',
            borderRadius: 8,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          aria-label="Close sidebar"
          tabIndex={0}
        >
          ×
        </button>
      )}
      
      {/* Logo Section */}
      <div style={styles.logoSection}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '14px' }}>#</span>
          </div>
          <span style={styles.logoText}>TT_Dashboard</span>
        </div>
      </div>

      {/* Account Section */}
      <div style={styles.accountSection}>
        <h3 style={styles.accountTitle}>My Account</h3>
        <div style={styles.roleContainer}>
          <span style={styles.roleText}>Role: {userRole}</span>
          <button
            style={styles.switchButton}
            onClick={() => setUserRole(userRole === 'Super Admin' ? 'Brand Admin' : 'Super Admin')}
            onMouseOver={(e) => e.target.style.color = '#c2410c'}
            onMouseOut={(e) => e.target.style.color = '#ea580c'}
          >
            Switch
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={styles.nav}>
        {/* Main Navigation */}
        <div style={styles.navSection}>
          <h4 style={styles.sectionTitle}>Main Navigation</h4>
          <ul style={styles.navList}>
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const itemStyle = {
                ...styles.navItem,
                ...(location.pathname === item.href ? styles.navItemActive : styles.navItemInactive)
              };
              
              return (
                <li key={item.id}>
                  <Link 
                    to={item.href}
                    style={itemStyle}
                    title={item.description}
                    data-active={location.pathname === item.href}
                    onMouseEnter={handleNavItemHover}
                    onMouseLeave={handleNavItemLeave}
                    onClick={handleNavClick}
                  >
                    <Icon style={styles.navIcon} />
                    {item.name}
                    {item.superAdminOnly && (
                      <span style={styles.badge}>SA</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Settings Section */}
        <div style={styles.navSection}>
          <h4 style={styles.sectionTitle}>Settings</h4>
          <ul style={styles.navList}>
            {settingsItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Link 
                    to={item.href}
                    style={{
                      ...styles.navItem, 
                      ...(location.pathname === item.href ? styles.navItemActive : styles.navItemInactive)
                    }}
                    onMouseEnter={handleNavItemHover}
                    onMouseLeave={handleNavItemLeave}
                    onClick={handleNavClick}
                  >
                    <Icon style={styles.navIcon} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Bottom Section */}
      <div style={styles.bottomSection}>
        <ul style={styles.navList}>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Link 
                  to={item.href}
                  style={{
                    ...styles.navItem, 
                    ...(location.pathname === item.href ? styles.navItemActive : styles.navItemInactive)
                  }}
                  onMouseEnter={handleNavItemHover}
                  onMouseLeave={handleNavItemLeave}
                  onClick={handleNavClick}
                >
                  <Icon style={styles.navIcon} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;