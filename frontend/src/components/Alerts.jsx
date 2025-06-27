import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Bell, 
  AlertTriangle, 
  Package, 
  Clock, 
  Filter,
  RefreshCw,
  Calendar,
  MessageSquare
} from 'lucide-react';
import './Alerts.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, inventory, samples
  const [days, setDays] = useState(7);
  const [limit, setLimit] = useState(50);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let allAlerts = [];
      
      // Fetch inventory alerts
      if (filter === 'all' || filter === 'inventory') {
        const inventoryResponse = await axios.get('/api/inventory/alerts/history', {
          params: { limit, days }
        });
        if (inventoryResponse.data.status === 'success') {
          allAlerts.push(...inventoryResponse.data.alerts.map(alert => ({
            ...alert,
            source: 'inventory'
          })));
        }
      }
      
      // Fetch sample alerts
      if (filter === 'all' || filter === 'samples') {
        const sampleResponse = await axios.get('/api/samples/alerts/history', {
          params: { limit, days }
        });
        if (sampleResponse.data.status === 'success') {
          allAlerts.push(...sampleResponse.data.alerts.map(alert => ({
            ...alert,
            source: 'samples'
          })));
        }
      }
      
      // Sort by sent_at (newest first)
      allAlerts.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
      
      setAlerts(allAlerts);
    } catch (err) {
      setError(`Failed to fetch alerts: ${err.message}`);
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, days, limit]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case 'low_inventory':
        return <Package className="alert-icon inventory" />;
      case 'new_sample_request':
        return <MessageSquare className="alert-icon sample" />;
      case 'stable_unapproved_sample':
        return <Clock className="alert-icon pending" />;
      default:
        return <AlertTriangle className="alert-icon default" />;
    }
  };

  const getAlertTypeLabel = (alertType) => {
    switch (alertType) {
      case 'low_inventory':
        return 'Low Inventory';
      case 'new_sample_request':
        return 'New Sample Request';
      case 'stable_unapproved_sample':
        return 'Pending Sample';
      default:
        return alertType;
    }
  };

  const getAlertPriority = (alert) => {
    if (alert.alert_type === 'low_inventory') {
      return alert.current_stock <= 5 ? 'high' : 'medium';
    }
    if (alert.alert_type === 'stable_unapproved_sample') {
      return alert.days_pending >= 7 ? 'high' : 'medium';
    }
    return 'medium';
  };

  const getAlertColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getAlertSummary = (alert) => {
    switch (alert.alert_type) {
      case 'low_inventory':
        return `${alert.sku_name} - Stock: ${alert.current_stock}/${alert.threshold}`;
      case 'new_sample_request':
        return `${alert.creator_name} requested ${alert.sample_quantity} samples`;
      case 'stable_unapproved_sample':
        return `${alert.creator_name} - Pending for ${alert.days_pending} days`;
      default:
        return alert.message || 'Alert notification';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'inventory') return alert.source === 'inventory';
    if (filter === 'samples') return alert.source === 'samples';
    return true;
  });

  const stats = {
    total: alerts.length,
    inventory: alerts.filter(a => a.source === 'inventory').length,
    samples: alerts.filter(a => a.source === 'samples').length,
    highPriority: alerts.filter(a => getAlertPriority(a) === 'high').length
  };

  return (
    <div className="alerts-container">
      {/* Header */}
      <div className="alerts-header">
        <div className="header-left">
          <h1 className="alerts-title">
            <Bell className="title-icon" />
            Alerts & Notifications
          </h1>
          <p className="alerts-subtitle">
            Monitor inventory alerts and sample request notifications
          </p>
        </div>
        <div className="header-actions">
          <button 
            onClick={fetchAlerts} 
            disabled={loading}
            className="refresh-button"
          >
            <RefreshCw className={`refresh-icon ${loading ? 'spinning' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <Bell />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.total}</h3>
            <p className="stat-label">Total Alerts</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon inventory">
            <Package />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.inventory}</h3>
            <p className="stat-label">Inventory Alerts</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon samples">
            <MessageSquare />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.samples}</h3>
            <p className="stat-label">Sample Alerts</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon high-priority">
            <AlertTriangle />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.highPriority}</h3>
            <p className="stat-label">High Priority</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-left">
          <div className="filter-group">
            <label className="filter-label">
              <Filter className="filter-icon" />
              Alert Type:
            </label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Alerts</option>
              <option value="inventory">Inventory Only</option>
              <option value="samples">Samples Only</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <Calendar className="filter-icon" />
              Time Range:
            </label>
            <select 
              value={days} 
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="filter-select"
            >
              <option value={1}>Last 24 hours</option>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Limit:</label>
            <select 
              value={limit} 
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="filter-select"
            >
              <option value={25}>25 alerts</option>
              <option value={50}>50 alerts</option>
              <option value={100}>100 alerts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <AlertTriangle className="error-icon" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <RefreshCw className="loading-spinner spinning" />
          <p>Loading alerts...</p>
        </div>
      )}

      {/* Alerts List */}
      {!loading && !error && (
        <div className="alerts-list">
          {filteredAlerts.length === 0 ? (
            <div className="empty-state">
              <Bell className="empty-icon" />
              <h3>No alerts found</h3>
              <p>No alerts match your current filters. Try adjusting the time range or alert type.</p>
            </div>
          ) : (
            filteredAlerts.map((alert, index) => {
              const priority = getAlertPriority(alert);
              const priorityColor = getAlertColor(priority);
              
              return (
                <div 
                  key={`${alert.id || index}-${alert.sent_at}`} 
                  className="alert-card"
                  style={{ borderLeftColor: priorityColor }}
                >
                  <div className="alert-header">
                    <div className="alert-type">
                      {getAlertIcon(alert.alert_type)}
                      <span className="alert-type-label">
                        {getAlertTypeLabel(alert.alert_type)}
                      </span>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: priorityColor }}
                      >
                        {priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="alert-meta">
                      <span className="alert-time">
                        {formatDate(alert.sent_at)}
                      </span>
                      <span className="alert-source">
                        {alert.source === 'inventory' ? 'Inventory' : 'Samples'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="alert-content">
                    <p className="alert-message">{alert.message}</p>
                    <div className="alert-summary">
                      {getAlertSummary(alert)}
                    </div>
                  </div>
                  
                  {alert.brand_id && (
                    <div className="alert-footer">
                      <span className="brand-info">
                        Brand ID: {alert.brand_id}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Alerts;
