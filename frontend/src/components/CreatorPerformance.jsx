import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Video, UserPlus, AlertCircle } from 'lucide-react';
import axios from 'axios';

const CreatorPerformance = () => {
  const [yesterdayData, setYesterdayData] = useState({});
  const [currentWeekData, setCurrentWeekData] = useState({});
  const [monthToDateData, setMonthToDateData] = useState({});
  const [dates, setDates] = useState({ startDate: '', endDate: '' });
  const [data, setData] = useState(null);

 
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
        const formattedEndOfMonth = formatDate(currentDate); // current day is the end of the month

        // Fetch performance data (GMV, flash sales, etc.) for yesterday
        const yesterdayPerformanceResponse = await axios.get('http://127.0.0.1:8000/shop/performance', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            page_size: 10,
            page_no: 1
          }
        });

        // Fetch performance data (GMV, flash sales, etc.) for the current week
        const currentWeekPerformanceResponse = await axios.get('http://127.0.0.1:8000/shop/performance', {
          params: {
            start_time: startOfWeek,
            end_time: formattedEndOfWeek,
            page_size: 10,
            page_no: 1
          }
        });

        // Fetch performance data (GMV, flash sales, etc.) for the current month
        const monthToDatePerformanceResponse = await axios.get('http://127.0.0.1:8000/shop/performance', {
          params: {
            start_time: startOfMonth,
            end_time: formattedEndOfMonth,
            page_size: 10,
            page_no: 1
          }
        });
        
        //fetch flash sales performance 
        const yesterdayflashsales = await axios.get('http://127.0.0.1:8000/flash_sales_performance', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            page_size: 10,
            page_no: 1
          }
        });

        //fetch flash sales performance 
        const currentWeekflashsales = await axios.get('http://127.0.0.1:8000/flash_sales_performance', {
          params: {
            start_time: startOfWeek,
            end_time: formattedEndOfWeek,
            page_size: 10,
            page_no: 1
          }
        });

        //fetch flash sales performance 
        const monthToDateflashsales = await axios.get('http://127.0.0.1:8000/flash_sales_performance', {
          params: {
            start_time: startOfMonth,
            end_time: formattedEndOfMonth,
            page_size: 10,
            page_no: 1
          }
        });

        const compain = await axios.get('http://127.0.0.1:8000/shop/performance', {
          params: {
            start_time: dates.startDate,
            end_time: dates.endDate,
            page_size: 10,
            page_no: 1
          }
        });


        // Fetch top-performing creators for each period (Yesterday, Current Week, and Month to Date)
        const dailycreatorsResponse = await axios.get('http://127.0.0.1:8000/top_performing_creators', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            page_size: 10,
            page_no: 1
          }
        });
        const weaklycreatorsResponse = await axios.get('http://127.0.0.1:8000/top_performing_creators', {
          params: {
            start_time: startOfWeek,
            end_time: formattedEndOfWeek,
            page_size: 10,
            page_no: 1
          }
        });
        const monthlycreatorsResponse = await axios.get('http://127.0.0.1:8000/top_performing_creators', {
          params: {
            start_date: startOfMonth, // Start of current month
            end_date: formattedEndOfMonth, // End of current month (today)
            page_size: 10,
            page_no: 1
          }
        });

        const dailygmvPervideo = await axios.get('http://127.0.0.1:8000//Gmv_per_video', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            page_size: 10,
            page_no: 1
          }
        });
        const weeklygmvPervideo = await axios.get('http://127.0.0.1:8000//Gmv_per_video', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            page_size: 10,
            page_no: 1
          }
        });
        const monthlygmvPervideo = await axios.get('http://127.0.0.1:8000//Gmv_per_video', {
          params: {
            start_date: startOfMonth, // Start of current month
            end_date: formattedEndOfMonth, // End of current month (today)
            page_size: 10,
            page_no: 1
          }
        });
        const dailyRefundrate = await axios.get('http://127.0.0.1:8000//calculate_refund_rate', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            page_size: 10,
            page_no: 1
          }
        });
        const weeklyRefundrate = await axios.get('http://127.0.0.1:8000//calculate_refund_rate', {
          params: {
            start_time: startOfWeek,
            end_time: formattedEndOfWeek,
            page_size: 10,
            page_no: 1
          }
        });
        const monthlyRefundrate = await axios.get('http://127.0.0.1:8000//calculate_refund_rate', {
          params: {
            start_date: startOfMonth, // Start of current month
            end_date: formattedEndOfMonth, // End of current month (today)
            page_size: 10,
            page_no: 1
          }
        });

        // Update the dashboard state with the fetched data
        setYesterdayData({
          topPerformingCreators: dailycreatorsResponse.data.top_creators.length,
          gmvpervideo: dailygmvPervideo.data.gmv,
        });

        setCurrentWeekData({
          topPerformingCreators: weaklycreatorsResponse.data.top_creators.length,
          gmvpervideo: weeklygmvPervideo.data.gmv,
        });

        setMonthToDateData({
          topPerformingCreators: monthlycreatorsResponse.data.top_creators.length,
          gmvpervideo: monthlygmvPervideo.data.gmv,
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculatePercentage = (value, total) => {
    if (total === 0) return '0.0%';
    return ((value / total) * 100).toFixed(1) + '%';
  };

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
        <div className="metric-row">
          <span className="metric-label">GMV PER VIDEO</span>
          <span className="metric-value">{data.gmvpervideo}</span>
        </div>
      </div>
    </div>


  );

  return (
    <div className="dashboard-container">
      

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

export default CreatorPerformance;