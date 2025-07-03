import React, { useEffect, useState, useCallback } from 'react';
// import { ShoppingCart, TrendingUp, Package, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { apiClient } from '../api/api';
const ShopPerformance = () => {
  const [yesterdayData, setYesterdayData] = useState({});
  const [currentWeekData, setCurrentWeekData] = useState({});
  const [monthToDateData, setMonthToDateData] = useState({});
  //  const [data, setData] = useState(null);
 
  //  const fetchPerformance = async () => {
  //    try {
  //      const response = await axios.get('/api/shop/performance', {
  //        params: {
  //          start_time: dates.startDate, // use selected start date
  //          end_time: dates.endDate,     // use selected end date
  //          page_size: 10,
  //          page_no: 1,
  //        },
  //      });
  //      setData(response.data);
  //    } catch (error) {
  //      console.error('API call error:', error);
  //    }
  //  };
 
   // Helper function to format dates as 'YYYY-MM-DD'
   const formatDate = (date) => {
     const year = date.getFullYear();
     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
     const day = String(date.getDate()).padStart(2, '0');
     return `${year}-${month}-${day}`;
   };
 
   // Helper function to get the start of the current week (Monday)
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
  
   // Helper function to get the start of the current month
   
   

   
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
         const yesterdayPerformanceResponse = await apiClient.get('/shop/performance', {
           params: {
             start_time: formattedYesterday,
             end_time: formattedYesterday,
             page_size: 10,
             page_no: 1
           }
         });
 
         // Fetch performance data (GMV, flash sales, etc.) for the current week
         const currentWeekPerformanceResponse = await apiClient.get('/shop/performance', {
           params: {
             start_time: startOfWeek,
             end_time: formattedEndOfWeek,
             page_size: 10,
             page_no: 1
           }
         });
 
         // Fetch performance data (GMV, flash sales, etc.) for the current month
         const monthToDatePerformanceResponse = await apiClient.get('/shop/performance', {
           params: {
             start_time: startOfMonth,
             end_time: formattedEndOfMonth,
             page_size: 10,
             page_no: 1
           }
         });
         
         //fetch flash sales performance 
         const yesterdayflashsales = await apiClient.get('/flash_sales_performance', {
           params: {
             start_time: formattedYesterday,
             end_time: formattedYesterday,
             page_size: 10,
             page_no: 1
           }
         });
 
         //fetch flash sales performance 
         const currentWeekflashsales = await apiClient.get('/flash_sales_performance', {
           params: {
             start_time: startOfWeek,
             end_time: formattedEndOfWeek,
             page_size: 10,
             page_no: 1
           }
         });
 
         //fetch flash sales performance 
         const monthToDateflashsales = await apiClient.get('/flash_sales_performance', {
           params: {
             start_time: startOfMonth,
             end_time: formattedEndOfMonth,
             page_size: 10,
             page_no: 1
           }
         });
 
         const compain = await apiClient.get('/shop/performance', {
          params: {
            start_time: getStartOfMonth(new Date()),
            end_time: formattedEndOfMonth,
            page_size: 10,
            page_no: 1
          }
         });
         const dailyRefundrate = await apiClient.get('/calculate_refund_rate', {
           params: {
             start_time: formattedYesterday,
             end_time: formattedYesterday,
             page_size: 10,
             page_no: 1
           }
         });
         const weeklyRefundrate = await apiClient.get('/calculate_refund_rate', {
           params: {
             start_time: startOfWeek,
             end_time: formattedEndOfWeek,
             page_size: 10,
             page_no: 1
           }
         });
         const monthlyRefundrate = await apiClient.get('/calculate_refund_rate', {
           params: {
             start_date: startOfMonth, // Start of current month
             end_date: formattedEndOfMonth, // End of current month (today)
             page_size: 10,
             page_no: 1
           }
         });
 
         // Update the dashboard state with the fetched data
         setYesterdayData({
           totalGmv: yesterdayPerformanceResponse.data.gmv,
           flashSalesPerformance: yesterdayflashsales.data.total_sales,// Example value for flash sales
           refundrate: dailyRefundrate.data.refund_rate,
           Tiktokcompaign: compain.data.gmv
         });
 
         setCurrentWeekData({
           totalGmv: currentWeekPerformanceResponse.data.gmv,
           flashSalesPerformance: currentWeekflashsales.data.total_sales,// Example value for flash sales
           refundrate: weeklyRefundrate.data.refund_rate,
           Tiktokcompaign: compain.data.gmv
         });
 
         setMonthToDateData({
           totalGmv: monthToDatePerformanceResponse.data.gmv,
           flashSalesPerformance: monthToDateflashsales.data.total_sales,// Example value for flash sales
           refundrate: monthlyRefundrate.data.refund_rate,
           Tiktokcompaign: compain.data.gmv
         });
 
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };
 
    fetchData();
}, [getStartOfMonth, getStartOfWeek]);
 
   const formatCurrency = (amount) => {
     return new Intl.NumberFormat('en-US', {
       style: 'currency',
       currency: 'USD',
       minimumFractionDigits: 2
     }).format(amount);
   };
 
  //  const calculatePercentage = (value, total) => {
  //    if (total === 0) return '0.0%';
  //    return ((value / total) * 100).toFixed(1) + '%';
  //  };
 
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
           <span className="metric-label">Refund Rate </span>
           <span className="metric-value">{data.refundrate}</span>
         </div>
         <div className="metric-row">
           <span className="metric-label">Tiktok Compaign outcome </span>
           <span className="metric-value">{data.Tiktokcompaign}</span>
           {/* <DatePickerCard onDatesChange={setDates} />
           <button
             className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2"
             onClick={fetchPerformance}
             disabled={!dates.startDate || !dates.endDate}
           >
             Get Performance
           </button> */}
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

export default ShopPerformance;