import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./ShopDetailPage.css";

const ShopDetailPage = () => {
  const { brandId } = useParams();  // Get brandId from URL params
  const [shopData, setShopData] = useState({
    yesterdayData: {},
    currentWeekData: {},
    monthToDateData: {}
  });
  // const [performanceData, setPerformanceData] = useState({
  //   yesterdayData: {},
  //   currentWeekData: {},
  //   monthToDateData: {}
  // });
  // const [dates, setDates] = useState({ startDate: '', endDate: '' });

  // const fetchShopPerformance = async () => {
  //   try {
  //     const response = await axios.get('/api/shop/performance', {
  //       params: {
  //         start_time: dates.startDate,
  //         end_time: dates.endDate,
  //         brand_id: brandId, // Pass the brandId for filtering shop performance
  //         page_size: 10,
  //         page_no: 1,
  //       },
  //     });
  //     setShopData((prevData) => ({
  //       ...prevData,
  //       shopPerformance: response.data,
  //     }));
  //   } catch (error) {
  //     console.error('Error fetching shop performance:', error);
  //   }
  // };


  // Helper functions to format dates
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getStartOfWeek = useCallback((date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust if it's Sunday
    startOfWeek.setDate(diff);
    return formatDate(startOfWeek);
  }, []);
  
  const getStartOfMonth = useCallback((date) => {
    const startOfMonth = new Date(date);
    startOfMonth.setDate(1); // Set the date to the 1st of the month
    return formatDate(startOfMonth);
  }, []);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();

        // Get yesterday's date
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);
        const formattedYesterday = formatDate(yesterday);

        // Get start and end of current week
        const startOfWeek = getStartOfWeek(currentDate);
        const formattedEndOfWeek = formatDate(new Date(currentDate)); // current day is the end of the week

        // Get start of the current month
        const startOfMonth = getStartOfMonth(currentDate);
        const formattedEndOfMonth = formatDate(currentDate); // current day is the end of the month

        // Fetch performance data (GMV, flash sales, etc.) for yesterday
        const yesterdayPerformanceResponse = await axios.get('/api/shop/performance', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            brand_id: brandId,  // Pass brandId here
            page_size: 10,
            page_no: 1
          }
        });

        // Fetch performance data for the current week
        const currentWeekPerformanceResponse = await axios.get('/api/shop/performance', {
          params: {
            start_time: startOfWeek,
            end_time: formattedEndOfWeek,
            brand_id: brandId, // Pass brandId here
            page_size: 10,
            page_no: 1
          }
        });

        // Fetch performance data for the current month
        const monthToDatePerformanceResponse = await axios.get('/api/shop/performance', {
          params: {
            start_time: startOfMonth,
            end_time: formattedEndOfMonth,
            brand_id: brandId,  // Pass brandId here
            page_size: 10,
            page_no: 1
          }
        });

        // Update the shop data state
        setShopData({
          yesterdayData: yesterdayPerformanceResponse.data,
          currentWeekData: currentWeekPerformanceResponse.data,
          monthToDateData: monthToDatePerformanceResponse.data
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [brandId, getStartOfMonth, getStartOfWeek]);

  const renderTable = (data, title, period, bgColor) => (
    <div className="analytics-table">
      <div className={`table-header ${bgColor}`}>
        <h3>{title}</h3>
        <span className="period">{period}</span>
      </div>
      <div className="table-content">
        <div className="metric-row">
          <span className="metric-label">TOTAL GMV</span>
          <span className="metric-value">{formatCurrency(data.totalGmv)}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">FLASH SALES PERFORMANCE</span>
          <span className="metric-value">{formatCurrency(data.flashSalesPerformance)}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">TOP-PERFORMING CREATORS</span>
          <span className="metric-value">{data.topPerformingCreators}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">GMV PER VIDEO</span>
          <span className="metric-value">{data.gmvpervideo}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Refund Rate</span>
          <span className="metric-value">{data.refundrate}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="shop-detail-container">
      <h1>Shop Details</h1>
      <div className="tables-container">
        {renderTable(
          shopData.yesterdayData,
          'Yesterday',
          `Yesterday (${formatDate(new Date())})`,
          'header-blue'
        )}
        {renderTable(
          shopData.currentWeekData,
          'Current Week',
          `Week (${getStartOfWeek(new Date())} - ${formatDate(new Date())})`,
          'header-green'
        )}
        {renderTable(
          shopData.monthToDateData,
          'Month to date',
          `Month (${getStartOfMonth(new Date())} - ${formatDate(new Date())})`,
          'header-red'
        )}
      </div>
    </div>
    
  );
};

export default ShopDetailPage;