import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, TrendingUp, Package, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import "./AdminShopPerformance.css";  // Assuming custom styles for the Admin Shop Performance

const AdminShopPerformance = () => {
  const { brandId } = useParams();  // Get brandId from URL params
  const [yesterdayData, setYesterdayData] = useState({});
  const [currentWeekData, setCurrentWeekData] = useState({});
  const [monthToDateData, setMonthToDateData] = useState({});
  const [dates, setDates] = useState({ startDate: '', endDate: '' });

  // Helper function to format dates as 'YYYY-MM-DD'
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
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

        // Fetch performance data (GMV, flash sales, etc.) for yesterday
        const yesterdayPerformanceResponse = await axios.get('/api/shop/performance', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            brand_id: brandId,  // Use the brandId for filtering
            page_size: 10,
            page_no: 1
          }
        });

        // Fetch performance data (GMV, flash sales, etc.) for the current week
        const currentWeekPerformanceResponse = await axios.get('/api/shop/performance', {
          params: {
            start_time: startOfWeek,
            end_time: formattedEndOfWeek,
            brand_id: brandId, // Use the brandId for filtering
            page_size: 10,
            page_no: 1
          }
        });

        // Fetch performance data (GMV, flash sales, etc.) for the current month
        const monthToDatePerformanceResponse = await axios.get('/api/shop/performance', {
          params: {
            start_time: startOfMonth,
            end_time: formattedEndOfMonth,
            brand_id: brandId,  // Use the brandId for filtering
            page_size: 10,
            page_no: 1
          }
        });

        // Fetch flash sales performance data for the periods
        const yesterdayflashsales = await axios.get('/api/flash_sales_performance', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            brand_id: brandId, // Use brandId here too
            page_size: 10,
            page_no: 1
          }
        });

        const currentWeekflashsales = await axios.get('/api/flash_sales_performance', {
          params: {
            start_time: startOfWeek,
            end_time: formattedEndOfWeek,
            brand_id: brandId, // Use brandId here too
            page_size: 10,
            page_no: 1
          }
        });

        const monthToDateflashsales = await axios.get('/api/flash_sales_performance', {
          params: {
            start_time: startOfMonth,
            end_time: formattedEndOfMonth,
            brand_id: brandId, // Use brandId here too
            page_size: 10,
            page_no: 1
          }
        });

        // Update state with fetched data
        setYesterdayData({
          totalGmv: yesterdayPerformanceResponse.data.gmv,
          flashSalesPerformance: yesterdayflashsales.data.total_sales,
        });

        setCurrentWeekData({
          totalGmv: currentWeekPerformanceResponse.data.gmv,
          flashSalesPerformance: currentWeekflashsales.data.total_sales,
        });

        setMonthToDateData({
          totalGmv: monthToDatePerformanceResponse.data.gmv,
          flashSalesPerformance: monthToDateflashsales.data.total_sales,
        });

      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };

    fetchData();
  }, [brandId, dates]);

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

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
      </div>
    </div>
  );

  return (
    <div className="shop-performance-container">
      <h1>Shop Performance</h1>
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

export default AdminShopPerformance;