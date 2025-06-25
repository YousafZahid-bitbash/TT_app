import React, { useState, useEffect } from 'react';
import './SampleDistributionLog.css';

const SampleDistributionLog = () => {
  const [applications, setApplications] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState({});

  // Set default dates (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  const fetchApplications = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        status: statusFilter,
        page_size: pageSize.toString(),
        page_no: currentPage.toString()
      });

      const response = await fetch(`http://localhost:8000/sample_applications?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setApplications(data.data.applications || []);
    } catch (err) {
      setError(`Failed to fetch applications: ${err.message}`);
      console.error('Error fetching sample applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    if (!startDate || !endDate) return;

    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate
      });

      const response = await fetch(`http://localhost:8000/sample_applications/statistics?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatistics(data.data || {});
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const updateApplicationStatus = async (applicationId, productId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [applicationId]: true }));

    try {
      const params = new URLSearchParams({
        status: newStatus,
        product_id: productId
      });

      const response = await fetch(
        `http://localhost:8000/sample_applications/${applicationId}/update_status?${params}`,
        { method: 'POST' }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh the applications list
      await fetchApplications();
      await fetchStatistics();
      
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleFetchData = () => {
    fetchApplications();
    fetchStatistics();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACCEPTED':
        return 'status-accepted';
      case 'PENDING':
        return 'status-pending';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return 'status-unknown';
    }
  };

  return (
    <div className="sample-distribution-container">
      <div className="header-section">
        <h1 className="page-title">Sample Distribution Log</h1>
        <p className="page-subtitle">Manage creator sample applications and track distribution</p>
      </div>

      <div className="controls-section">
        <div className="control-group">
          <label htmlFor="start-date">Start Date:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="control-group">
          <label htmlFor="end-date">End Date:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="control-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-input"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="page-size">Per Page:</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
            className="select-input"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <button 
          onClick={handleFetchData} 
          disabled={loading || !startDate || !endDate}
          className="fetch-button"
        >
          {loading ? 'Loading...' : 'Get Applications'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {Object.keys(statistics).length > 0 && (
        <div className="statistics-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Applications</h3>
              <p className="stat-number">{formatNumber(statistics.total_applications)}</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p className="stat-number pending">{formatNumber(statistics.pending_applications)}</p>
            </div>
            <div className="stat-card">
              <h3>Accepted</h3>
              <p className="stat-number accepted">{formatNumber(statistics.accepted_applications)}</p>
            </div>
            <div className="stat-card">
              <h3>Rejected</h3>
              <p className="stat-number rejected">{formatNumber(statistics.rejected_applications)}</p>
            </div>
            <div className="stat-card">
              <h3>Acceptance Rate</h3>
              <p className="stat-number">{statistics.acceptance_rate?.toFixed(1) || 0}%</p>
            </div>
            <div className="stat-card">
              <h3>Total Samples</h3>
              <p className="stat-number">{formatNumber(statistics.total_samples_requested)}</p>
            </div>
            <div className="stat-card">
              <h3>Unique Creators</h3>
              <p className="stat-number">{formatNumber(statistics.unique_creators)}</p>
            </div>
            <div className="stat-card">
              <h3>Unique Products</h3>
              <p className="stat-number">{formatNumber(statistics.unique_products)}</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Fetching sample applications...</p>
        </div>
      )}

      {!loading && applications.length > 0 && (
        <div className="applications-section">
          <div className="table-container">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Creator</th>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Quantity</th>
                  <th>Followers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.sample_application_id} className="application-row">
                    <td className="id-cell">
                      <span className="application-id">{app.sample_application_id}</span>
                    </td>
                    <td className="creator-cell">
                      <div className="creator-info">
                        <h4 className="creator-name">{app.creator_name || 'N/A'}</h4>
                        <p className="creator-username">@{app.creator_username || 'N/A'}</p>
                        <span className="creator-id">ID: {app.creator_id}</span>
                      </div>
                    </td>
                    <td className="product-cell">
                      <div className="product-info">
                        <h4 className="product-name">{app.product_name}</h4>
                        <span className="product-id">ID: {app.product_id}</span>
                      </div>
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                        {app.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="date-cell">
                      {formatDate(app.create_time)}
                    </td>
                    <td className="quantity-cell">
                      {app.sample_quantity || 1}
                    </td>
                    <td className="followers-cell">
                      {formatNumber(app.creator_follower_count)}
                    </td>
                    <td className="actions-cell">
                      {app.status === 'PENDING' && (
                        <div className="action-buttons">
                          <button
                            onClick={() => updateApplicationStatus(app.sample_application_id, app.product_id, 'ACCEPTED')}
                            disabled={updatingStatus[app.sample_application_id]}
                            className="action-button accept-button"
                          >
                            {updatingStatus[app.sample_application_id] ? '...' : 'Accept'}
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app.sample_application_id, app.product_id, 'REJECTED')}
                            disabled={updatingStatus[app.sample_application_id]}
                            className="action-button reject-button"
                          >
                            {updatingStatus[app.sample_application_id] ? '...' : 'Reject'}
                          </button>
                        </div>
                      )}
                      {app.status !== 'PENDING' && (
                        <span className="no-actions">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && applications.length === 0 && !error && startDate && endDate && (
        <div className="no-data-message">
          <span className="no-data-icon">📦</span>
          <h3>No Applications Found</h3>
          <p>No sample applications found for the selected criteria.</p>
        </div>
      )}
    </div>
  );
};

export default SampleDistributionLog;