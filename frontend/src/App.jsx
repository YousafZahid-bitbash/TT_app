// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import AlertsPage from './pages/AlertsPage'; // Import AlertsPage
import Login from './components/Login';
import Signup from './components/Signup';

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

const AppRoutes = () => {
  // const { isAuthenticated } = useAuth();
  return (
    <div className="app-container">
      <Routes>
        {/* Default route: show Login page */}
        <Route path="/" element={<Login />} />
        {/* Signup page route */}
        <Route path="/signup" element={<Signup />} />
        {/* TikTokLogin page route */}
        <Route path="/tiktoklogin" element={<TikTokLogin />} />
        {/* Unprotected Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/shop-performance" element={<ShopPerformancePage />} />
        <Route path="/creator-performance" element={<CreatorPerformancePage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/backend-metrics" element={<BackendMetrices />} />
        <Route path="/backend-metrics/inventory" element={<InventoryTrackerPage />} />
        <Route path="/backend-metrics/top-skus" element={<TopSellingSkuPage />} />
        <Route path="/backend-metrics/samples" element={<SampleDistributionLogPage />} />
        <Route path="/backend-metrics/communication" element={<BackendMetrices />} />
        <Route path="/backend-metrics/promotions" element={<BackendMetrices />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/shop/:brandId" element={<AdminShopDetailPage />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
