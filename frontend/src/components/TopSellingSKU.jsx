//TopSellingSku.jsx
import React, { useState, useEffect } from 'react';
import './TopSellingSku.css';

const TopSellingSku = () => {
  const [skuData, setSkuData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [topN, setTopN] = useState(10);

  // Set default dates (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  const fetchTopSkus = async () => {
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
        top_n: topN.toString(),
        page_size: '100',
        page_no: '1'
      });

      const response = await fetch(`http://localhost:8000/top_selling_skus?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSkuData(data.top_selling_skus || []);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
      console.error('Error fetching top selling SKUs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="top-selling-sku-container">
      <div className="header-section">
        <h1 className="page-title">Top Selling SKUs</h1>
        <p className="page-subtitle">Analyze your best performing products</p>
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
          <label htmlFor="top-n">Top N SKUs:</label>
          <select
            id="top-n"
            value={topN}
            onChange={(e) => setTopN(parseInt(e.target.value))}
            className="select-input"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
          </select>
        </div>

        <button 
          onClick={fetchTopSkus} 
          disabled={loading || !startDate || !endDate}
          className="fetch-button"
        >
          {loading ? 'Loading...' : 'Get Top SKUs'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Fetching top selling SKUs...</p>
        </div>
      )}

      {!loading && skuData.length > 0 && (
        <div className="results-section">
          <div className="stats-overview">
            <div className="stat-card">
              <h3>Total SKUs</h3>
              <p className="stat-number">{skuData.length}</p>
            </div>
            <div className="stat-card">
              <h3>Total Units Sold</h3>
              <p className="stat-number">
                {formatNumber(skuData.reduce((sum, sku) => sum + sku.units_sold, 0))}
              </p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-number">
                {formatCurrency(skuData.reduce((sum, sku) => sum + sku.total_sales, 0))}
              </p>
            </div>
          </div>

          <div className="table-container">
            <table className="sku-table">
              <thead>
                <tr>
                  <th className="rank-column">Rank</th>
                  <th className="product-column">Product Details</th>
                  <th className="units-column">Units Sold</th>
                  <th className="revenue-column">Total Sales</th>
                  <th className="price-column">Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {skuData.map((sku, index) => (
                  <tr key={sku.sku_id} className="sku-row">
                    <td className="rank-cell">
                      <span className={`rank-badge rank-${Math.min(index + 1, 3)}`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="product-cell">
                      <div className="product-info">
                        <h4 className="product-name">{sku.product_name || 'N/A'}</h4>
                        <p className="sku-name">{sku.sku_name || 'N/A'}</p>
                        <div className="ids">
                          <span className="product-id">Product ID: {sku.product_id}</span>
                          <span className="sku-id">SKU ID: {sku.sku_id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="units-cell">
                      <span className="units-number">{formatNumber(sku.units_sold)}</span>
                    </td>
                    <td className="revenue-cell">
                      <span className="revenue-number">{formatCurrency(sku.total_sales)}</span>
                    </td>
                    <td className="price-cell">
                      <span className="price-number">
                        {formatCurrency(sku.total_sales / sku.units_sold)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && skuData.length === 0 && !error && startDate && endDate && (
        <div className="no-data-message">
          <span className="no-data-icon">📊</span>
          <h3>No Data Found</h3>
          <p>No top selling SKUs found for the selected date range.</p>
        </div>
      )}
    </div>
  );
};

export default TopSellingSku;