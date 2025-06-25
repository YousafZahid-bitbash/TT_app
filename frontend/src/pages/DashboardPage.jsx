// src/pages/DashboardPage.jsx
import React from 'react';
import UserLayout from '../components/UserLayout'; // Import the UserLayout component
import Dashboard from '../components/Dashboard'; // Import the Dashboard component

const DashboardPage = () => {
  return (
    <UserLayout>
      <Dashboard />
    </UserLayout>
  );
};

export default DashboardPage;