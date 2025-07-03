// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <TikTokLogin />
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/shop-performance" element={
          <ProtectedRoute>
            <ShopPerformancePage />
          </ProtectedRoute>
        } />
        
        <Route path="/creator-performance" element={
          <ProtectedRoute>
            <CreatorPerformancePage />
          </ProtectedRoute>
        } />
        
        <Route path="/alerts" element={
          <ProtectedRoute>
            <AlertsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/backend-metrics" element={
          <ProtectedRoute>
            <BackendMetrices />
          </ProtectedRoute>
        } />
        
        <Route path="/backend-metrics/inventory" element={
          <ProtectedRoute>
            <InventoryTrackerPage />
          </ProtectedRoute>
        } />
        
        <Route path="/backend-metrics/top-skus" element={
          <ProtectedRoute>
            <TopSellingSkuPage />
          </ProtectedRoute>
        } />
        
        <Route path="/backend-metrics/samples" element={
          <ProtectedRoute>
            <SampleDistributionLogPage />
          </ProtectedRoute>
        } />
        
        <Route path="/backend-metrics/communication" element={
          <ProtectedRoute>
            <BackendMetrices />
          </ProtectedRoute>
        } />
        
        <Route path="/backend-metrics/promotions" element={
          <ProtectedRoute>
            <BackendMetrices />
          </ProtectedRoute>
        } />
        
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
