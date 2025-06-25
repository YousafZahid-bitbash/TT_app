// // // src/components/Sidebar.jsx
// // import React from 'react';
// // import { Link } from 'react-router-dom'; // For navigation

// // const Sidebar = () => {
// //   return (
// //     <div className="sidebar">
// //       <h2 className="sidebar-title">Dashboard</h2>
// //       <ul className="sidebar-links">
// //         <li>
// //           <Link to="/" className="sidebar-link">
// //             Dashboard Overview
// //           </Link>
// //         </li>
// //         <li>
// //           <Link to="/shop-performance" className="sidebar-link">
// //             Shop Performance
// //           </Link>
// //         </li>
// //         <li>
// //           <Link to="/creator-performance" className="sidebar-link">
// //             Creator Performance
// //           </Link>
// //         </li>
// //         {/* Add more links as needed */}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default Sidebar;

// import React, { useState } from 'react';
// import { 
//   BarChart3, 
//   Package, 
//   PieChart, 
//   Users, 
//   TrendingUp, 
//   Settings, 
//   Zap,
//   FolderOpen,
//   LogOut,
//   Package2,
//   ShoppingCart,
//   Video,
//   Database,
//   AlertTriangle,
//   TrendingDown
// } from 'lucide-react';

// const Sidebar = () => {
//   const [userRole, setUserRole] = useState('Brand Admin');

//   const styles = {
//     sidebar: {
//       width: '256px',
//       backgroundColor: '#ffffff',
//       borderRight: '1px solid #e5e7eb',
//       height: '100vh',
//       display: 'flex',
//       flexDirection: 'column',
//       fontFamily: 'system-ui, -apple-system, sans-serif',
//       position: 'fixed',
//       left: 0,
//       top: 0,
//       zIndex: 1000
//     },
//     logoSection: {
//       padding: '24px',
//       borderBottom: '1px solid #e5e7eb'
//     },
//     logoContainer: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '8px'
//     },
//     logoIcon: {
//       width: '32px',
//       height: '32px',
//       backgroundColor: '#fb923c',
//       borderRadius: '8px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center'
//     },
//     logoText: {
//       fontSize: '20px',
//       fontWeight: 'bold',
//       color: '#1f2937'
//     },
//     accountSection: {
//       padding: '16px 24px',
//       borderBottom: '1px solid #e5e7eb'
//     },
//     accountTitle: {
//       fontSize: '14px',
//       fontWeight: '500',
//       color: '#6b7280',
//       marginBottom: '8px'
//     },
//     roleContainer: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between'
//     },
//     roleText: {
//       fontSize: '12px',
//       color: '#6b7280'
//     },
//     switchButton: {
//       fontSize: '12px',
//       color: '#ea580c',
//       textDecoration: 'underline',
//       background: 'none',
//       border: 'none',
//       cursor: 'pointer'
//     },
//     nav: {
//       flex: 1,
//       padding: '8px 16px',
//       overflowY: 'auto'
//     },
//     navSection: {
//       marginBottom: '24px'
//     },
//     sectionTitle: {
//       padding: '0 12px',
//       marginBottom: '8px',
//       fontSize: '12px',
//       fontWeight: '600',
//       color: '#6b7280',
//       textTransform: 'uppercase',
//       letterSpacing: '0.05em'
//     },
//     navList: {
//       listStyle: 'none',
//       padding: 0,
//       margin: 0,
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '4px'
//     },
//     navItem: {
//       display: 'flex',
//       alignItems: 'center',
//       padding: '8px 12px',
//       fontSize: '14px',
//       fontWeight: '500',
//       borderRadius: '8px',
//       textDecoration: 'none',
//       transition: 'all 0.2s ease',
//       cursor: 'pointer'
//     },
//     navItemActive: {
//       color: 'rgba(67, 66, 66, 0.73)',
//       backgroundColor: '#FFFFFF'
//     },
//     navItemInactive: {
//       color: '#6b7280',
//       backgroundColor: 'transparent'
//     },
//     navItemHover: {
//       color: 'rgb(234, 88, 12)',
//       backgroundColor: 'rgb(253, 246, 235)'
//     },
//     navIcon: {
//       width: '16px',
//       height: '16px',
//       marginRight: '12px'
//     },
//     badge: {
//       marginLeft: 'auto',
//       fontSize: '10px',
//       backgroundColor: '#fff7ed',
//       color: '#ea58c',
//       padding: '2px 4px',
//       borderRadius: '4px'
//     },
//     progressSection: {
//       marginBottom: '24px',
//       padding: '0 12px'
//     },
//     progressTitle: {
//       fontSize: '12px',
//       color: '#6b7280',
//       marginBottom: '8px',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '4px'
//     },
//     progressBar: {
//       width: '100%',
//       height: '8px',
//       backgroundColor: '#e5e7eb',
//       borderRadius: '4px',
//       overflow: 'hidden'
//     },
//     progressFill: {
//       height: '100%',
//       backgroundColor: '#fb923c',
//       width: '65%',
//       borderRadius: '4px'
//     },
//     progressText: {
//       fontSize: '12px',
//       color: '#6b7280',
//       marginTop: '4px'
//     },
//     alertSection: {
//       marginBottom: '16px',
//       padding: '0 12px'
//     },
//     alertBox: {
//       backgroundColor: '#fefce8',
//       border: '1px solid #fde047',
//       borderRadius: '8px',
//       padding: '12px'
//     },
//     alertTitle: {
//       display: 'flex',
//       alignItems: 'center',
//       fontSize: '12px',
//       color: '#92400e',
//       marginBottom: '4px',
//       gap: '4px'
//     },
//     alertContent: {
//       fontSize: '12px',
//       color: '#a16207'
//     },
//     bottomSection: {
//       padding: '16px',
//       borderTop: '1px solid #e5e7eb'
//     }
//   };

//   const navigationItems = [
//     {
//       id: 'dashboard',
//       name: 'Dashboard',
//       href: '/dashboard',
//       icon: BarChart3,
//       active: true,
//       module: 'Dashboard Overview',
//       description: 'View metrics by brand or global'
//     },
//     {
//       id: 'shop-performance',
//       name: 'Shop Performance',
//       href: '/shop-performance',
//       icon: ShoppingCart,
//       module: 'Shop Performance Module',
//       description: 'GMV, TikTok campaigns, refund rates'
//     },
//     {
//       id: 'creator-performance',
//       name: 'Creator Performance',
//       href: '/creator-performance',
//       icon: Video,
//       module: 'Creator Performance Module',
//       description: 'Creator metrics and content performance'
//     },
//     // {
//     //   id: 'products',
//     //   name: 'Products',
//     //   href: '/products',
//     //   icon: Package,
//     //   module: 'Backend Metrics Module',
//     //   description: 'Inventory and top SKUs'
//     // },
//     // {
//     //   id: 'ceo-dashboard',
//     //   name: 'CEO Dashboard',
//     //   href: '/ceo-dashboard',
//     //   icon: PieChart,
//     //   module: 'Dashboard Overview',
//     //   description: 'Executive level metrics',
//     //   superAdminOnly: true
//     // },
//     // {
//     //   id: 'customer-insight',
//     //   name: 'Customer Insight',
//     //   href: '/customer-insight',
//     //   icon: Users,
//     //   module: 'Creator Performance Module',
//     //   description: 'Customer and affiliate insights'
//     // },
//     {
//       id: 'backend-metrics',
//       name: 'Backend Metrics',
//       href: '/backend-metrics',
//       icon: Database,
//       module: 'Backend Metrics Module',
//       description: 'Inventory alerts and sample distribution'
//     },
//     // {
//     //   id: 'cogs-fbs-values',
//     //   name: 'COGS and FBS Values',
//     //   href: '/cogs-fbs-values',
//     //   icon: TrendingUp,
//     //   module: 'Shop Performance Module',
//     //   description: 'Cost analysis and FBS tracking'
//     // }
//   ];

//   const settingsItems = [
//     {
//       id: 'resources',
//       name: 'Resources',
//       href: '/resources',
//       icon: FolderOpen
//     },
//     {
//       id: 'account-settings',
//       name: 'Account Settings',
//       href: '/account-settings',
//       icon: Settings
//     },
//     {
//       id: 'setup-wizard',
//       name: 'Set-Up Wizard',
//       href: '/setup-wizard',
//       icon: Zap
//     }
//   ];

//   const bottomItems = [
//     {
//       id: 'affiliate-program',
//       name: 'Affiliate Program',
//       href: '/affiliate-program',
//       icon: Users
//     },
//     {
//       id: 'logout',
//       name: 'Logout',
//       href: '/logout',
//       icon: LogOut
//     },
//     {
//       id: 'inverted',
//       name: 'inverted',
//       href: '/inverted',
//       icon: Package2
//     }
//   ];

//   const filteredNavItems = navigationItems.filter(item => 
//     !item.superAdminOnly || userRole === 'Super Admin'
//   );

//   const handleNavItemHover = (e) => {
//     if (!e.target.closest('[data-active="true"]')) {
//       Object.assign(e.target.style, styles.navItemHover);
//     }
//   };

//   const handleNavItemLeave = (e) => {
//     if (!e.target.closest('[data-active="true"]')) {
//       Object.assign(e.target.style, styles.navItemInactive);
//     }
//   };

//   return (
//     <div style={styles.sidebar}>
//       {/* Logo Section */}
//       <div style={styles.logoSection}>
//         <div style={styles.logoContainer}>
//           <div style={styles.logoIcon}>
//             <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '14px' }}>#</span>
//           </div>
//           <span style={styles.logoText}>TT_Dashboard</span>
//         </div>
//       </div>

//       {/* Account Section */}
//       <div style={styles.accountSection}>
//         <h3 style={styles.accountTitle}>My Account</h3>
//         <div style={styles.roleContainer}>
//           <span style={styles.roleText}>Role: {userRole}</span>
//           <button
//             style={styles.switchButton}
//             onClick={() => setUserRole(userRole === 'Super Admin' ? 'Brand Admin' : 'Super Admin')}
//             onMouseOver={(e) => e.target.style.color = '#c2410c'}
//             onMouseOut={(e) => e.target.style.color = '#ea580c'}
//           >
//             Switch
//           </button>
//         </div>
//       </div>

//       {/* Navigation Links */}
//       <nav style={styles.nav}>
//         {/* Main Navigation */}
//         <div style={styles.navSection}>
//           <h4 style={styles.sectionTitle}>Main Navigation</h4>
//           <ul style={styles.navList}>
//             {filteredNavItems.map((item) => {
//               const Icon = item.icon;
//               const itemStyle = {
//                 ...styles.navItem,
//                 ...(item.active ? styles.navItemActive : styles.navItemInactive)
//               };
              
//               return (
//                 <li key={item.id}>
//                   <a 
//                     href={item.href}
//                     style={itemStyle}
//                     title={item.description}
//                     data-active={item.active}
//                     onMouseEnter={handleNavItemHover}
//                     onMouseLeave={handleNavItemLeave}
//                   >
//                     <Icon style={styles.navIcon} />
//                     {item.name}
//                     {item.superAdminOnly && (
//                       <span style={styles.badge}>SA</span>
//                     )}
//                   </a>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>

//         {/* Settings Section */}
//         <div style={styles.navSection}>
//           <h4 style={styles.sectionTitle}>Settings</h4>
//           <ul style={styles.navList}>
//             {settingsItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <li key={item.id}>
//                   <a 
//                     href={item.href}
//                     style={{...styles.navItem, ...styles.navItemInactive}}
//                     onMouseEnter={handleNavItemHover}
//                     onMouseLeave={handleNavItemLeave}
//                   >
//                     <Icon style={styles.navIcon} />
//                     {item.name}
//                   </a>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>

//         {/* Shop Data Sync Progress */}
//         {/* <div style={styles.progressSection}>
//           <div style={styles.progressTitle}>
//             <Database style={{ width: '12px', height: '12px' }} />
//             Shop Data Sync
//           </div>
//           <div style={styles.progressBar}>
//             <div style={styles.progressFill}></div>
//           </div>
//           <div style={styles.progressText}>65% Complete</div>
//         </div> */}

//         {/* System Alerts */}
//         <div style={styles.alertSection}>
//           <div style={styles.alertBox}>
//             <div style={styles.alertTitle}>
//               <AlertTriangle style={{ width: '12px', height: '12px' }} />
//               System Alerts
//             </div>
//             <div style={styles.alertContent}>
//               • 5 low stock items<br />
//               • 2 pending samples
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Bottom Section */}
//       <div style={styles.bottomSection}>
//         <ul style={styles.navList}>
//           {bottomItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <li key={item.id}>
//                 <a 
//                   href={item.href}
//                   style={{...styles.navItem, ...styles.navItemInactive}}
//                   onMouseEnter={handleNavItemHover}
//                   onMouseLeave={handleNavItemLeave}
//                 >
//                   <Icon style={styles.navIcon} />
//                   {item.name}
//                 </a>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState } from 'react';
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
      active: true,
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
                          ...(item.active ? styles.navItemActive : styles.navItemInactive)
                        }}
                        onClick={() => toggleMenu(item.id)}
                        title={item.description}
                        data-active={item.active}
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
                              <a
                                key={dropdownItem.id}
                                href={dropdownItem.href}
                                style={styles.dropdownItem}
                                title={dropdownItem.description}
                                onMouseEnter={handleDropdownItemHover}
                                onMouseLeave={handleDropdownItemLeave}
                              >
                                <DropdownIcon style={styles.dropdownIcon} />
                                {dropdownItem.name}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <a 
                      href={item.href}
                      style={{
                        ...styles.navItem,
                        ...(item.active ? styles.navItemActive : styles.navItemInactive)
                      }}
                      title={item.description}
                      data-active={item.active}
                      onMouseEnter={handleNavItemHover}
                      onMouseLeave={handleNavItemLeave}
                    >
                      <Icon style={styles.navIcon} />
                      {item.name}
                    </a>
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
                  <a 
                    href={item.href}
                    style={{...styles.navItem, ...styles.navItemInactive}}
                    title={item.description}
                    onMouseEnter={handleNavItemHover}
                    onMouseLeave={handleNavItemLeave}
                  >
                    <Icon style={styles.navIcon} />
                    {item.name}
                    {item.superAdminOnly && (
                      <span style={styles.badge}>Admin</span>
                    )}
                  </a>
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
                <a 
                  href={item.href}
                  style={{...styles.navItem, ...styles.navItemInactive}}
                  onMouseEnter={handleNavItemHover}
                  onMouseLeave={handleNavItemLeave}
                >
                  <Icon style={styles.navIcon} />
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;