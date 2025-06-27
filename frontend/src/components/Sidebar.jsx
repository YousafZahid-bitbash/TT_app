import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  ShoppingCart, 
  Video, 
  Database, 
  Bell, 
  Settings, 
  Users, 
  LogOut,
  AlertTriangle,
  Package,
  Package2,
  Zap,
  ChevronDown,
  ChevronRight,
  Warehouse,
  TrendingUp,
  ClipboardList,
  MessageSquare,
  Target
} from 'lucide-react';

const Sidebar = () => {
  const [userRole, setUserRole] = useState('Brand Admin');
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const styles = {
    sidebar: {
      width: '256px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000
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
      width: '130px',
      height: '130px',
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
    navItemWithDropdown: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      fontSize: '14px',
      fontWeight: '500',
      borderRadius: '8px',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      width: '100%',
      color: 'inherit'
    },
    navItemContent: {
      display: 'flex',
      alignItems: 'center'
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
    chevronIcon: {
      width: '16px',
      height: '16px',
      transition: 'transform 0.2s ease'
    },
    dropdownContent: {
      marginLeft: '28px',
      marginTop: '4px',
      borderLeft: '2px solid #f3f4f6',
      paddingLeft: '12px'
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '6px 8px',
      fontSize: '13px',
      fontWeight: '400',
      borderRadius: '6px',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      color: '#6b7280',
      marginBottom: '2px'
    },
    dropdownItemHover: {
      color: 'rgb(234, 88, 12)',
      backgroundColor: 'rgb(253, 246, 235)'
    },
    dropdownIcon: {
      width: '14px',
      height: '14px',
      marginRight: '8px'
    },
    badge: {
      marginLeft: 'auto',
      fontSize: '10px',
      backgroundColor: '#fff7ed',
      color: '#ea580c',
      padding: '2px 6px',
      borderRadius: '12px',
      fontWeight: '600'
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

  // Backend Metrics dropdown items
  const backendMetricsItems = [
    {
      id: 'inventory-tracker',
      name: 'Inventory Tracker',
      href: '/backend-metrics/inventory',
      icon: Warehouse,
      description: 'Low stock alerts and inventory management'
    },
    {
      id: 'top-selling-skus',
      name: 'Top-selling SKUs',
      href: '/backend-metrics/top-skus',
      icon: TrendingUp,
      description: 'Best performing product SKUs'
    },
    {
      id: 'sample-distribution',
      name: 'Sample Distribution Log',
      href: '/backend-metrics/samples',
      icon: ClipboardList,
      description: 'Track accepted/pending sample requests'
    },
    {
      id: 'affiliate-communication',
      name: 'Affiliate Communication',
      href: '/backend-metrics/communication',
      icon: MessageSquare,
      description: 'Communication tracker with affiliates'
    },
    {
      id: 'promotion-status',
      name: 'Promotion Implementation',
      href: '/backend-metrics/promotions',
      icon: Target,
      description: 'Track promotion implementation status'
    }
  ];

  // Core navigation items based on MVP Flow document
  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      description: 'KPIs: GMV, Refund %, Top SKUs, Top Creators, Campaign ROI'
    },
    {
      id: 'shop-performance',
      name: 'Shop Performance',
      href: '/shop-performance',
      icon: ShoppingCart,
      description: 'Total GMV, TikTok Shop Campaigns, Refund rates, Flash Sales'
    },
    {
      id: 'creator-performance',
      name: 'Creator Performance',
      href: '/creator-performance',
      icon: Video,
      description: 'GMV per video, Top creators, Affiliate conversion'
    },
    {
      id: 'backend-metrics',
      name: 'Backend Metrics',
      href: '/backend-metrics',
      icon: Database,
      description: 'Inventory tracker, Sample distribution, Communication logs',
      hasDropdown: true,
      dropdownItems: backendMetricsItems
    },
    {
      id: 'alerts',
      name: 'Alerts & Notifications',
      href: '/alerts',
      icon: Bell,
      description: 'Slack + Email alerts, Low inventory, Sample requests'
    }
  ];

  // Settings section based on MVP requirements
  const settingsItems = [
    {
      id: 'api-connections',
      name: 'API Connections',
      href: '/settings/api',
      icon: Zap,
      description: 'TikTok Shop API, Brand linking, Webhook settings'
    },
    {
      id: 'brand-settings',
      name: 'Brand Settings',
      href: '/settings/brands',
      icon: Package,
      description: 'Brand management and configuration',
      superAdminOnly: true
    },
    {
      id: 'user-management',
      name: 'User Management',
      href: '/settings/users',
      icon: Users,
      description: 'Manage brand admins and access',
      superAdminOnly: true
    },
    {
      id: 'general-settings',
      name: 'General Settings',
      href: '/settings/general',
      icon: Settings,
      description: 'General application settings'
    }
  ];

  const bottomItems = [
    {
      id: 'logout',
      name: 'Logout',
      href: '/logout',
      icon: LogOut
    },
    {
      id: 'affiliate-program',
      name: 'Affiliate Program',
      href: '/affiliate-program',
      icon: Users
    },
    {
      id: 'inverted',
      name: 'inverted',
      href: '/inverted',
      icon: Package2
    }
  ];

  const filteredNavItems = navigationItems;
  const filteredSettingsItems = settingsItems.filter(item => 
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

  const handleDropdownItemHover = (e) => {
    Object.assign(e.target.style, styles.dropdownItemHover);
  };

  const handleDropdownItemLeave = (e) => {
    Object.assign(e.target.style, { ...styles.dropdownItem, backgroundColor: 'transparent' });
  };

  return (
    <div style={styles.sidebar}>
      {/* Logo Section */}
      <div style={styles.logoSection}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <img 
              src="/logo.png"
              alt="TikTok Dashboard Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '0px'
              }}
            />
          </div>
          <span style={styles.logoText}>TikTok Dashboard</span>
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
        {/* Main Navigation - Core MVP Modules */}
        <div style={styles.navSection}>
          <h4 style={styles.sectionTitle}>Core Modules</h4>
          <ul style={styles.navList}>
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedMenus[item.id];
              
              return (
                <li key={item.id}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        style={{
                          ...styles.navItemWithDropdown,
                          ...(location.pathname.startsWith(item.href) ? styles.navItemActive : styles.navItemInactive)
                        }}
                        onClick={() => toggleMenu(item.id)}
                        title={item.description}
                        data-active={location.pathname.startsWith(item.href)}
                        onMouseEnter={handleNavItemHover}
                        onMouseLeave={handleNavItemLeave}
                      >
                        <div style={styles.navItemContent}>
                          <Icon style={styles.navIcon} />
                          {item.name}
                        </div>
                        {isExpanded ? 
                          <ChevronDown style={styles.chevronIcon} /> : 
                          <ChevronRight style={styles.chevronIcon} />
                        }
                      </button>
                      
                      {isExpanded && (
                        <div style={styles.dropdownContent}>
                          {item.dropdownItems.map((dropdownItem) => {
                            const DropdownIcon = dropdownItem.icon;
                            return (
                              <Link
                                key={dropdownItem.id}
                                to={dropdownItem.href}
                                style={{
                                  ...styles.dropdownItem,
                                  ...(location.pathname === dropdownItem.href ? styles.dropdownItemHover : {})
                                }}
                                title={dropdownItem.description}
                                onMouseEnter={handleDropdownItemHover}
                                onMouseLeave={handleDropdownItemLeave}
                              >
                                <DropdownIcon style={styles.dropdownIcon} />
                                {dropdownItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link 
                      to={item.href}
                      style={{
                        ...styles.navItem,
                        ...(location.pathname === item.href ? styles.navItemActive : styles.navItemInactive)
                      }}
                      title={item.description}
                      data-active={location.pathname === item.href}
                      onMouseEnter={handleNavItemHover}
                      onMouseLeave={handleNavItemLeave}
                    >
                      <Icon style={styles.navIcon} />
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Settings Section */}
        <div style={styles.navSection}>
          <h4 style={styles.sectionTitle}>Settings & Configuration</h4>
          <ul style={styles.navList}>
            {filteredSettingsItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Link 
                    to={item.href}
                    style={{
                      ...styles.navItem,
                      ...(location.pathname === item.href ? styles.navItemActive : styles.navItemInactive)
                    }}
                    title={item.description}
                    onMouseEnter={handleNavItemHover}
                    onMouseLeave={handleNavItemLeave}
                  >
                    <Icon style={styles.navIcon} />
                    {item.name}
                    {item.superAdminOnly && (
                      <span style={styles.badge}>Admin</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* System Alerts - Real-time Status */}
        <div style={styles.alertSection}>
          <div style={styles.alertBox}>
            <div style={styles.alertTitle}>
              <AlertTriangle style={{ width: '12px', height: '12px' }} />
              Real-time Alerts
            </div>
            <div style={styles.alertContent}>
              • 3 low inventory items<br />
              • 2 pending sample requests<br />
              • 1 stale sample approval
            </div>
          </div>
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

export default Sidebar;