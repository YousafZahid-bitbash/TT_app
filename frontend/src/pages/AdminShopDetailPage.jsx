import React from 'react';
import AdminLayout from '../components/AdminLayout'; // default import
import ShopDetailPage from '../components/ShopDetailPage';
import AdminShopPerformance from '../components/AdminShopPerformance';
import AdminCreatorPerformance from '../components/AdminCreatorPerformance';
const Admin = () => {
  return (
    <AdminLayout>
      <ShopDetailPage/>
      <AdminShopPerformance/>
      <AdminCreatorPerformance/>
    </AdminLayout>
  );
};

export default Admin;