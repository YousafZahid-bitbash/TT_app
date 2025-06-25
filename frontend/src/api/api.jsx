// src/api/Api.jsx
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard'; // Adjust the URL as needed

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