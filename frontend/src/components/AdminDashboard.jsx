import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(''); // State to hold the search query

  useEffect(() => {
    // Fetch users and their brands from the API
    axios.get('/api/admin/users')  // Adjust URL if deployed differently
      .then(response => {
        setUsers(response.data);  // Store the data in the state
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Filtering function to search by username or brand_name
  const filteredUsers = users.filter((user) => {
    const searchLower = search.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) || 
      user.brand_name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="admin-dashboard">
      <h1>ALL SHOPS</h1>

      {/* Search bar */}
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search by username or brand name..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="search-bar"
        />
      </div>

      {/* Table to display users and brands */}
      <table className="admin-dashboard-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Brand Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>  {/* Displaying username */}
              <td>{user.brand_name}</td>  {/* Displaying brand name */}
              <td><Link to={`/admin/shop/${user.brand_id}`}>View Shop</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;