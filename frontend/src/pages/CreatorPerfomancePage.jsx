// src/pages/CreatorPerformancePage.jsx
import React from 'react';
import UserLayout from '../components/UserLayout'; // Import the UserLayout component
import CreatorPerformance from '../components/CreatorPerformance'; // Import the CreatorPerformance component

const CreatorPerformancePage = () => {
  return (
    <UserLayout>
      <CreatorPerformance />
    </UserLayout>
  );
};

export default CreatorPerformancePage;