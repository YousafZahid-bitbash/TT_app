// src/pages/InventoryTrackerPage.jsx
import React from 'react';
import UserLayout from '../components/UserLayout';
import InventoryTracker from '../components/InventoryTracker';

const InventoryTrackerPage = () => {
  return (
    <UserLayout>
      <InventoryTracker />
    </UserLayout>
  );
};

export default InventoryTrackerPage;