// src/api/Api.jsx
import axios from 'axios';


// Environment-aware API URL configuration
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tt-app-backend.vercel.app'  // Your backend Vercel URL
  : 'http://127.0.0.1:8000';  // Local development

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});


// A function to fetch dashboard data
fetchDashboardData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Return the data from the API
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error; // Throw the error for further handling
  }
};
 export default fetchDashboardData;