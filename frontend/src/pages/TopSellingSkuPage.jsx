// src/pages/InventoryTrackerPage.jsx
import React from 'react';
import UserLayout from '../components/UserLayout';
import TopSellingSku from '../components/TopSellingSKU';

const TopSellingSkuPage = () => {
  return (
    <UserLayout>
      <TopSellingSku />
    </UserLayout>
  );
};

export default TopSellingSkuPage;