// src/api/api.jsx
import axios from 'axios';

// Environment-aware API URL configuration
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tt-app-backend.vercel.app'  // Your backend Vercel URL
  : 'http://127.0.0.1:8000';  // Local development

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// A function to fetch dashboard data
// const fetchDashboardData = async () => {
//   try {
//     const response = await axios.get(API_URL);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching dashboard data:', error);
//     throw error;
//   }
// };