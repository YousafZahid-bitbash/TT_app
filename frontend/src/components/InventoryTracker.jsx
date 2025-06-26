import React, { useState, useEffect, useCallback } from 'react';
import './InventoryTracker.css';

const InventoryTracker = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('database');

  const API_BASE = 'api';

  // Fetch brands on component mount
  

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_BASE}/inventory/brands`);
      const data = await response.json();
      if (data.status === 'success') {
        setBrands(data.brands);
        if (data.brands.length > 0) {
          setSelectedBrand(data.brands[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };


  const fetchSkus = useCallback(async (brandId) => {
    setLoading(true);
    try {
      let url;
      if (source === 'tiktok') {
        // Fetch from TikTok API
        url = `${API_BASE}/inventory/check-stock?brand_id=${brandId}&send_alerts=false&source=tiktok`;
      } else {
        // Fetch from database
        url = `${API_BASE}/inventory/skus?brand_id=${brandId}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'success') {
        if (source === 'tiktok') {
          // Transform TikTok data to match expected format
          const transformedSkus = data.low_stock_items.map(item => ({
            id: item.sku_id,
            name: item.sku_name,
            stock_count: item.current_stock,
            low_stock_threshold: item.threshold,
            brand_id: item.brand_id
          }));
          setSkus(transformedSkus);
        } else {
          setSkus(data.skus);
        }
      }
    } catch (error) {
      console.error('Error fetching SKUs:', error);
    } finally {
      setLoading(false);
    }
  }, [source]);

  // Fetch brands on component mount
  
  useEffect(() => {
    fetchBrands();
  }, []);

  // Fetch SKUs when brand changes or source changes
  useEffect(() => {
    if (selectedBrand) {
      fetchSkus(selectedBrand);
    }
  }, [selectedBrand, source, fetchSkus]);


  const updateStock = async (skuId, newStock) => {
    try {
      const response = await fetch(
        `${API_BASE}/inventory/update-stock?sku_id=${skuId}&stock_count=${newStock}`,
        { method: 'POST' }
      );
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchSkus(selectedBrand); // Refresh SKUs
        alert('Stock updated successfully!');
      } else {
        alert('Failed to update stock: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock');
    }
  };

  const updateThreshold = async (skuId, newThreshold) => {
    try {
      const response = await fetch(
        `${API_BASE}/inventory/update-threshold?sku_id=${skuId}&threshold=${newThreshold}`,
        { method: 'POST' }
      );
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchSkus(selectedBrand); // Refresh SKUs
        alert('Threshold updated successfully!');
      } else {
        alert('Failed to update threshold: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating threshold:', error);
      alert('Error updating threshold');
    }
  };

  const getStockStatus = (stock, threshold) => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= threshold) return 'low-stock';
    return 'in-stock';
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'out-of-stock': return '#dc3545';
      case 'low-stock': return '#ffc107';
      case 'in-stock': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStockStatusText = (status) => {
    switch (status) {
      case 'out-of-stock': return '🚨 Out of Stock';
      case 'low-stock': return '⚠️ Low Stock';
      case 'in-stock': return '✅ In Stock';
      default: return '❓ Unknown';
    }
  };

  return (
    <div className="inventory-tracker-simple">
      {/* Header */}
      <div className="inventory-header">
        <div className="header-left">
          <h1>📦 Inventory Tracker</h1>
          <p className="subtitle">Monitor and manage your inventory levels</p>
        </div>
        
        <div className="header-controls">
          <div className="control-group">
            <label>Brand:</label>
            <select 
              value={selectedBrand} 
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="brand-selector"
            >
              <option value="">Select Brand</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="control-group">
            <label>Data Source:</label>
            <select 
              value={source} 
              onChange={(e) => setSource(e.target.value)}
              className="source-selector"
            >
              <option value="database">📊 Database</option>
              <option value="tiktok">🛍️ TikTok API</option>
            </select>
          </div>
          
          <button 
            onClick={() => fetchSkus(selectedBrand)} 
            className="btn btn-refresh"
            disabled={loading || !selectedBrand}
          >
            {loading ? '🔄 Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Data Source Info */}
      <div className="data-source-info">
        <div className={`source-indicator ${source}`}>
          <span className="source-icon">
            {source === 'tiktok' ? '🛍️' : '📊'}
          </span>
          <span className="source-text">
            {source === 'tiktok' 
              ? 'Live data from TikTok Shop API' 
              : 'Data from local database'}
          </span>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading inventory data...</p>
          </div>
        ) : skus.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No inventory data found</h3>
            <p>
              {!selectedBrand 
                ? 'Please select a brand to view inventory.'
                : 'No SKUs found for the selected brand.'}
            </p>
          </div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>SKU Name</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skus.map(sku => {
                const status = getStockStatus(sku.stock_count, sku.low_stock_threshold);
                
                return (
                  <tr key={sku.id} className={`sku-row ${status}`}>
                    <td className="sku-name">
                      <div className="sku-info">
                        <strong>{sku.name}</strong>
                        <small>ID: {sku.id}</small>
                      </div>
                    </td>
                    
                    <td className="stock-count">
                      <input
                        type="number"
                        value={sku.stock_count}
                        onChange={(e) => {
                          const newStock = parseInt(e.target.value) || 0;
                          updateStock(sku.id, newStock);
                        }}
                        className="stock-input"
                        min="0"
                        disabled={source === 'tiktok'} // Can't edit TikTok data
                      />
                    </td>
                    
                    <td className="threshold">
                      <input
                        type="number"
                        value={sku.low_stock_threshold}
                        onChange={(e) => {
                          const newThreshold = parseInt(e.target.value) || 0;
                          updateThreshold(sku.id, newThreshold);
                        }}
                        className="threshold-input"
                        min="0"
                        disabled={source === 'tiktok'} // Can't edit TikTok data
                      />
                    </td>
                    
                    <td className="status">
                      <span 
                        className="status-indicator"
                        style={{ backgroundColor: getStockStatusColor(status) }}
                      >
                        {getStockStatusText(status)}
                      </span>
                    </td>
                    
                    <td className="actions">
                      <div className="action-buttons">
                        <button
                          onClick={() => {
                            const newStock = prompt('Enter new stock count:', sku.stock_count);
                            if (newStock !== null && newStock !== '') {
                              updateStock(sku.id, parseInt(newStock) || 0);
                            }
                          }}
                          className="btn btn-sm btn-edit"
                          disabled={source === 'tiktok'}
                          title={source === 'tiktok' ? 'Cannot edit TikTok data' : 'Edit stock count'}
                        >
                          📝 Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary Stats */}
      {skus.length > 0 && (
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total SKUs:</span>
            <span className="stat-value">{skus.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Low Stock:</span>
            <span className="stat-value warning">
              {skus.filter(sku => getStockStatus(sku.stock_count, sku.low_stock_threshold) === 'low-stock').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Out of Stock:</span>
            <span className="stat-value danger">
              {skus.filter(sku => sku.stock_count === 0).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTracker;