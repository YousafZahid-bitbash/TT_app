import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Get the brandId from the URL
import axios from 'axios';

const AdminCreatorPerformance = () => {
  const { brandId } = useParams();  // Get the brandId from URL params
  const [yesterdayData, setYesterdayData] = useState({});
  const [currentWeekData, setCurrentWeekData] = useState({});
  const [monthToDateData, setMonthToDateData] = useState({});
  // const [dates, setDates] = useState({ startDate: '', endDate: '' });

  // Helper function to format dates as 'YYYY-MM-DD'
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get the start of the current week (Monday)
  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust if it's Sunday
    startOfWeek.setDate(diff);
    return formatDate(startOfWeek);
  };

  // Helper function to get the start of the current month
  const getStartOfMonth = (date) => {
    const startOfMonth = new Date(date);
    startOfMonth.setDate(1); // Set the date to the 1st of the month
    return formatDate(startOfMonth);
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
        const formattedEndOfMonth = formatDate(currentDate);
  
        // Fetch creator performance data for yesterday
        const yesterdayPerformanceResponse = await axios.get('/api/top_performing_creators', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            brand_id: brandId,  // Use brandId for filtering
            page_size: 10,
            page_no: 1
          }
        });
  
        // Fetch creator performance data for the current week
        const currentWeekPerformanceResponse = await axios.get('/api/top_performing_creators', {
          params: {
            start_time: startOfWeek,
            end_time: formattedEndOfWeek,
            brand_id: brandId,  // Use brandId for filtering
            page_size: 10,
            page_no: 1
          }
        });
  
        // Fetch creator performance data for the current month
        const monthToDatePerformanceResponse = await axios.get('/api/top_performing_creators', {
          params: {
            start_time: startOfMonth,
            end_time: formattedEndOfMonth,
            brand_id: brandId,  // Use brandId for filtering
            page_size: 10,
            page_no: 1
          }
        });
  
        // Update the performance state with the fetched data
        setYesterdayData({
          topPerformingCreators: yesterdayPerformanceResponse.data.top_creators.length,
        });
  
        setCurrentWeekData({
          topPerformingCreators: currentWeekPerformanceResponse.data.top_creators.length,
        });
  
        setMonthToDateData({
          topPerformingCreators: monthToDatePerformanceResponse.data.top_creators.length,
        });
  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [brandId]); 
  
  // Only re-run effect when brandId changes
  // Helper function to format currency
  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //     minimumFractionDigits: 2
  //   }).format(amount);
  // };

  const renderTable = (data, title, period, bgColor) => (
    <div className="analytics-table">
      <div className={`table-header ${bgColor}`}>
        <h3>{title}</h3>
        <span className="period">{period}</span>
      </div>
      <div className="table-content">
        <div className="metric-row">
          <span className="metric-label">TOP-PERFORMING CREATORS</span>
          <span className="metric-value">{data.topPerformingCreators}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Creator Performance</h1>
      </div>

      <div className="tables-container">
        {renderTable(
          yesterdayData,
          'Yesterday',
          `Yesterday (${formatDate(new Date())})`,
          'header-blue'
        )}
        {renderTable(
          currentWeekData,
          'Current Week',
          `Week (${getStartOfWeek(new Date())} - ${formatDate(new Date())})`,
          'header-green'
        )}
        {renderTable(
          monthToDateData,
          'Month to date',
          `Month (${getStartOfMonth(new Date())} - ${formatDate(new Date())})`,
          'header-red'
        )}
      </div>
    </div>
  );
};

export default AdminCreatorPerformance;