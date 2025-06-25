// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import Sidebar from './components/Sidebar'; // Sidebar component
// import Dashboard from './components/Dashboard'; // Dashboard component
// import ShopPerformance from './pages/ShopPerformance'; // ShopPerformance component (mock for now)
// import CreatorPerformance from './components/CreatorPerformance'; // CreatorPerformance component (mock for now)

import DashboardPage from './pages/DashboardPage'; // Dashboard component
import ShopPerformancePage from './pages/ShopPerfomancePage'; // ShopPerformance component (mock for now)
import CreatorPerformancePage from './pages/CreatorPerfomancePage'; // CreatorPerformance component (mock for now)
import Admin from './pages/Admin';
import './App.css'; // Import the new CSS file
import TikTokLogin from './components/TikTokLogin';
import AdminShopDetailPage from './pages/AdminShopDetailPage'
import BackendMetrices from './pages/BackendMetrices'; // Your existing BackendMetrices component
import InventoryTrackerPage from './pages/InventoryTrackerPage';
import TopSellingSkuPage from './pages/TopSellingSkuPage';
import SampleDistributionLogPage from './pages/SampleDistributionLogPage';
const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<TikTokLogin />} /> {/* Add route for LoginPage */}
          <Route path="/Dashboard" element={<DashboardPage />} />
          <Route path="/shop-performance" element={<ShopPerformancePage />} />
          <Route path="/creator-performance" element={<CreatorPerformancePage />} />
          <Route path="/admin" element={<Admin />} /> {/*Admin Page */}
          <Route path="/admin/shop/:brandId" element={<AdminShopDetailPage />} />

          <Route path="/backend-metrics" element={<BackendMetrices />} />
          <Route path="/backend-metrics/inventory" element={<InventoryTrackerPage />} />
          <Route path="/backend-metrics/top-skus" element={<TopSellingSkuPage />} />
          <Route path="/backend-metrics/samples" element={<SampleDistributionLogPage />} />
          <Route path="/backend-metrics/communication" element={<BackendMetrices />} />
          <Route path="/backend-metrics/promotions" element={<BackendMetrices />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
