// src/pages/ShopPerformancePage.jsx
import React from 'react';
import UserLayout from '../components/UserLayout'; // Import the UserLayout component
import ShopPerformance from '../components/ShopPerformance'; // Import the ShopPerformance component

const ShopPerformancePage = () => {
  return (
    <UserLayout>
      <ShopPerformance />
    </UserLayout>
  );
};

export default ShopPerformancePage;