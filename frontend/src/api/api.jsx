// src/api/api.jsx
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Environment-aware API URL configuration
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tiktok-backend-crd5l.ondigitalocean.app'  // ✅ Remove trailing slash
  : 'http://127.0.0.1:8000';  // Local development

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Rest of your code stays exactly the same...
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