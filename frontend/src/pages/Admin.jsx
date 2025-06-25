import React from 'react';
import AdminLayout from '../components/AdminLayout'; // default import
import AdminSidebar from '../components/AdminSideBar'; // Make sure the filename and casing match
import AdminDashboard from '../components/AdminDashboard';

const Admin = () => {
  return (
    <AdminLayout>
      <AdminDashboard/>
    </AdminLayout>
  );
};

export default Admin;