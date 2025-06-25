// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import "./Dashboard.css";
// import DatePickerCard from './Datepicker';

// const Dashboard = () => {
//   const [yesterdayData, setYesterdayData] = useState({});
//   const [currentWeekData, setCurrentWeekData] = useState({});
//   const [monthToDateData, setMonthToDateData] = useState({});
//   const [dates, setDates] = useState({ startDate: '', endDate: '' });
//   const [data, setData] = useState(null);

//   const fetchPerformance = async () => {
//     try {
//       const response = await axios.get('http://127.0.0.1:8000/shop/performance', {
//         params: {
//           start_time: dates.startDate, // use selected start date
//           end_time: dates.endDate,     // use selected end date
//           page_size: 10,
//           page_no: 1,
//         },
//       });
//       setData(response.data);
//     } catch (error) {
//       console.error('API call error:', error);
//     }
//   };

//   // Helper function to format dates as 'YYYY-MM-DD'
//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   // Helper function to get the start of the current week (Monday)
//   const getStartOfWeek = (date) => {
//     const startOfWeek = new Date(date);
//     const day = startOfWeek.getDay();
//     const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust if it's Sunday
//     startOfWeek.setDate(diff);
//     return formatDate(startOfWeek);
//   };

//   // Helper function to get the start of the current month
//   const getStartOfMonth = (date) => {
//     const startOfMonth = new Date(date);
//     startOfMonth.setDate(1); // Set the date to the 1st of the month
//     return formatDate(startOfMonth);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const currentDate = new Date();

//         // Get yesterday's date
//         const yesterday = new Date(currentDate);
//         yesterday.setDate(currentDate.getDate() - 1);
//         const formattedYesterday = formatDate(yesterday);

//         // Get start and end of current week
//         const startOfWeek = getStartOfWeek(currentDate);
//         const formattedEndOfWeek = formatDate(new Date(currentDate)); // current day is the end of the week

//         // Get start of the current month
//         const startOfMonth = getStartOfMonth(currentDate);
//         const formattedEndOfMonth = formatDate(currentDate); // current day is the end of the month

//         // Fetch performance data (GMV, flash sales, etc.) for yesterday
//         const yesterdayPerformanceResponse = await axios.get('http://127.0.0.1:8000/shop/performance', {
//           params: {
//             start_time: formattedYesterday,
//             end_time: formattedYesterday,
//             page_size: 10,
//             page_no: 1
//           }
//         });

//         // Fetch performance data (GMV, flash sales, etc.) for the current week
//         const currentWeekPerformanceResponse = await axios.get('http://127.0.0.1:8000/shop/performance', {
//           params: {
//             start_time: startOfWeek,
//             end_time: formattedEndOfWeek,
//             page_size: 10,
//             page_no: 1
//           }
//         });

//         // Fetch performance data (GMV, flash sales, etc.) for the current month
//         const monthToDatePerformanceResponse = await axios.get('http://127.0.0.1:8000/shop/performance', {
//           params: {
//             start_time: startOfMonth,
//             end_time: formattedEndOfMonth,
//             page_size: 10,
//             page_no: 1
//           }
//         });
        
//         //fetch flash sales performance 
//         const yesterdayflashsales = await axios.get('http://127.0.0.1:8000/flash_sales_performance', {
//           params: {
//             start_time: formattedYesterday,
//             end_time: formattedYesterday,
//             page_size: 10,
//             page_no: 1
//           }
//         });

//         //fetch flash sales performance 
//         const currentWeekflashsales = await axios.get('http://127.0.0.1:8000/flash_sales_performance', {
//           params: {
//             start_time: startOfWeek,
//             end_time: formattedEndOfWeek,
//             page_size: 10,
//             page_no: 1
//           }
//         });

//         //fetch flash sales performance 
//         const monthToDateflashsales = await axios.get('http://127.0.0.1:8000/flash_sales_performance', {
//           params: {
//             start_time: startOfMonth,
//             end_time: formattedEndOfMonth,
//             page_size: 10,
//             page_no: 1
//           }
//         });

//         const compain = await axios.get('http://127.0.0.1:8000/shop/performance', {
//           params: {
//             start_time: dates.startDate,
//             end_time: dates.endDate,
//             page_size: 10,
//             page_no: 1
//           }
//         });


//         // Fetch top-performing creators for each period (Yesterday, Current Week, and Month to Date)
//         const dailycreatorsResponse = await axios.get('http://127.0.0.1:8000/top_performing_creators', {
//           params: {
//             start_time: formattedYesterday,
//             end_time: formattedYesterday,
//             page_size: 10,
//             page_no: 1
//           }
//         });
//         const weaklycreatorsResponse = await axios.get('http://127.0.0.1:8000/top_performing_creators', {
//           params: {
//             start_time: startOfWeek,
//             end_time: formattedEndOfWeek,
//             page_size: 10,
//             page_no: 1
//           }
//         });
//         const monthlycreatorsResponse = await axios.get('http://127.0.0.1:8000/top_performing_creators', {
//           params: {
//             start_date: startOfMonth, // Start of current month
//             end_date: formattedEndOfMonth, // End of current month (today)
//             page_size: 10,
//             page_no: 1
//           }
//         });

//         const dailygmvPervideo = await axios.get('http://127.0.0.1:8000//Gmv_per_video', {
//           params: {
//             start_time: formattedYesterday,
//             end_time: formattedYesterday,
//             page_size: 10,
//             page_no: 1
//           }
//         });
//         const weeklygmvPervideo = await axios.get('http://127.0.0.1:8000//Gmv_per_video', {
//           params: {
//             start_time: formattedYesterday,
//             end_time: formattedYesterday,
//             page_size: 10,
//             page_no: 1
//           }
//         });
//         const monthlygmvPervideo = await axios.get('http://127.0.0.1:8000//Gmv_per_video', {
//           params: {
//             start_date: startOfMonth, // Start of current month
//             end_date: formattedEndOfMonth, // End of current month (today)
//             page_size: 10,
//             page_no: 1
//           }
//         });
//         const dailyRefundrate = await axios.get('http://127.0.0.1:8000//calculate_refund_rate', {
//           params: {
//             start_time: formattedYesterday,
//             end_time: formattedYesterday,
//             page_size: 10,
//             page_no: 1
//           }
//         });
//         const weeklyRefundrate = await axios.get('http://127.0.0.1:8000//calculate_refund_rate', {
//           params: {
//             start_time: startOfWeek,
//             end_time: formattedEndOfWeek,
//             page_size: 10,
//             page_no: 1
//           }
//         });
//         const monthlyRefundrate = await axios.get('http://127.0.0.1:8000//calculate_refund_rate', {
//           params: {
//             start_date: startOfMonth, // Start of current month
//             end_date: formattedEndOfMonth, // End of current month (today)
//             page_size: 10,
//             page_no: 1
//           }
//         });

//         // Update the dashboard state with the fetched data
//         setYesterdayData({
//           totalGmv: yesterdayPerformanceResponse.data.gmv,
//           flashSalesPerformance: yesterdayflashsales.data.total_sales,// Example value for flash sales
//           topPerformingCreators: dailycreatorsResponse.data.top_creators.length,
//           gmvpervideo: dailygmvPervideo.data.gmv,
//           refundrate: dailyRefundrate.data.refund_rate,
//           Tiktokcompaign: compain.data.gmv
//         });

//         setCurrentWeekData({
//           totalGmv: currentWeekPerformanceResponse.data.gmv,
//           flashSalesPerformance: currentWeekflashsales.data.total_sales,// Example value for flash sales
//           topPerformingCreators: weaklycreatorsResponse.data.top_creators.length,
//           gmvpervideo: weeklygmvPervideo.data.gmv,
//           refundrate: weeklyRefundrate.data.refund_rate,
//           Tiktokcompaign: compain.data.gmv
//         });

//         setMonthToDateData({
//           totalGmv: monthToDatePerformanceResponse.data.gmv,
//           flashSalesPerformance: monthToDateflashsales.data.total_sales,// Example value for flash sales
//           topPerformingCreators: monthlycreatorsResponse.data.top_creators.length,
//           gmvpervideo: monthlygmvPervideo.data.gmv,
//           refundrate: monthlyRefundrate.data.refund_rate,
//           Tiktokcompaign: compain.data.gmv
//         });

//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };

//   const calculatePercentage = (value, total) => {
//     if (total === 0) return '0.0%';
//     return ((value / total) * 100).toFixed(1) + '%';
//   };

//   const renderTable = (data, title, period, bgColor) => (
//     <div className="analytics-table">
//       <div className={`table-header ${bgColor}`}>
//         <h3>{title}</h3>
//         <span className="period">{period}</span>
//       </div>
//       <div className="table-content">
//         <div className="metric-row">
//           <span className="metric-label">TOTAL GMV</span>
//           <span className="metric-value">{formatCurrency(data.totalGmv)}</span>
//         </div>
//         <div className="metric-row">
//           <span className="metric-label">FLASH SALES PERFORMANCE</span>
//           <span className="metric-value">{formatCurrency(data.flashSalesPerformance)}</span>
//         </div>
//         <div className="metric-row">
//           <span className="metric-label">TOP-PERFORMING CREATORS</span>
//           <span className="metric-value">{data.topPerformingCreators}</span>
//         </div>
//         <div className="metric-row">
//           <span className="metric-label">GMV PER VIDEO</span>
//           <span className="metric-value">{data.gmvpervideo}</span>
//         </div>
//         <div className="metric-row">
//           <span className="metric-label">Refund Rate </span>
//           <span className="metric-value">{data.refundrate}</span>
//         </div>
//         <div className="metric-row">
//           <span className="metric-label">Tiktok Compaign outcome </span>
//           <span className="metric-value">{data.Tiktokcompaign}</span>
//           {/* <DatePickerCard onDatesChange={setDates} />
//           <button
//             className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2"
//             onClick={fetchPerformance}
//             disabled={!dates.startDate || !dates.endDate}
//           >
//             Get Performance
//           </button> */}
//         </div>
//       </div>
//     </div>


//   );

//   return (
//     <div className="dashboard-container">   
//       <div className="tables-container">
//         {renderTable(
//           yesterdayData,
//           'Yesterday',
//           `Yesterday (${formatDate(new Date())})`,
//           'header-blue'
//         )}
//         {renderTable(
//           currentWeekData,
//           'Current Week',
//           `Week (${getStartOfWeek(new Date())} - ${formatDate(new Date())})`,
//           'header-green'
//         )}
//         {renderTable(
//           monthToDateData,
//           'Month to date',
//           `Month (${getStartOfMonth(new Date())} - ${formatDate(new Date())})`,
//           'header-red'
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Dashboard.css";
import DatePickerCard from './Datepicker';

const Dashboard = () => {
  const [yesterdayData, setYesterdayData] = useState({});
  const [currentWeekData, setCurrentWeekData] = useState({});
  const [monthToDateData, setMonthToDateData] = useState({});
  const [dates, setDates] = useState({ startDate: '', endDate: '' });
  const [data, setData] = useState(null);
  const [customRangeData, setCustomRangeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriods, setSelectedPeriods] = useState([]);

  // Function to generate month periods between start and end date
  const generateMonthPeriods = (startDate, endDate) => {
    const periods = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    
    while (current <= end) {
      const monthStart = new Date(current);
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
      
      // Adjust for the actual range
      const periodStart = monthStart < start ? start : monthStart;
      const periodEnd = monthEnd > end ? end : monthEnd;
      
      periods.push({
        label: current.toLocaleString('default', { month: 'short', year: 'numeric' }),
        startDate: formatDate(periodStart),
        endDate: formatDate(periodEnd),
        fullMonth: monthStart >= start && monthEnd <= end
      });
      
      current.setMonth(current.getMonth() + 1);
    }
    
    return periods;
  };

  const fetchCustomRangeData = async () => {
    if (!dates.startDate || !dates.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);
    try {
      const periods = generateMonthPeriods(dates.startDate, dates.endDate);
      setSelectedPeriods(periods);
      
      const periodData = await Promise.all(
        periods.map(async (period) => {
          try {
            // Fetch all required data for this period
            const [
              performanceResponse,
              flashSalesResponse,
              creatorsResponse,
              gmvPerVideoResponse,
              refundRateResponse
            ] = await Promise.all([
              axios.get('http://127.0.0.1:8000/shop/performance', {
                params: {
                  start_time: period.startDate,
                  end_time: period.endDate,
                  page_size: 10,
                  page_no: 1
                }
              }),
              axios.get('http://127.0.0.1:8000/flash_sales_performance', {
                params: {
                  start_time: period.startDate,
                  end_time: period.endDate,
                  page_size: 10,
                  page_no: 1
                }
              }),
              axios.get('http://127.0.0.1:8000/top_performing_creators', {
                params: {
                  start_time: period.startDate,
                  end_time: period.endDate,
                  page_size: 10,
                  page_no: 1
                }
              }),
              axios.get('http://127.0.0.1:8000/Gmv_per_video', {
                params: {
                  start_time: period.startDate,
                  end_time: period.endDate,
                  page_size: 10,
                  page_no: 1
                }
              }),
              axios.get('http://127.0.0.1:8000/calculate_refund_rate', {
                params: {
                  start_time: period.startDate,
                  end_time: period.endDate,
                  page_size: 10,
                  page_no: 1
                }
              })
            ]);

            return {
              period: period.label,
              startDate: period.startDate,
              endDate: period.endDate,
              totalGmv: performanceResponse.data.gmv || 0,
              flashSalesPerformance: flashSalesResponse.data.total_sales || 0,
              topPerformingCreators: creatorsResponse.data.top_creators?.length || 0,
              gmvPerVideo: gmvPerVideoResponse.data.gmv || 0,
              refundRate: refundRateResponse.data.refund_rate || 0,
              tiktokCampaign: performanceResponse.data.gmv || 0 // Using GMV as campaign outcome
            };
          } catch (error) {
            console.error(`Error fetching data for period ${period.label}:`, error);
            return {
              period: period.label,
              startDate: period.startDate,
              endDate: period.endDate,
              totalGmv: 0,
              flashSalesPerformance: 0,
              topPerformingCreators: 0,
              gmvPerVideo: 0,
              refundRate: 0,
              tiktokCampaign: 0,
              error: true
            };
          }
        })
      );

      setCustomRangeData(periodData);
    } catch (error) {
      console.error('Error fetching custom range data:', error);
      alert('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformance = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/shop/performance', {
        params: {
          start_time: dates.startDate,
          end_time: dates.endDate,
          page_size: 10,
          page_no: 1,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('API call error:', error);
    }
  };

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
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    return formatDate(startOfWeek);
  };

  // Helper function to get the start of the current month
  const getStartOfMonth = (date) => {
    const startOfMonth = new Date(date);
    startOfMonth.setDate(1);
    return formatDate(startOfMonth);
  };

  // Calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? '+100.0%' : '0.0%';
    }
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  // Calculate totals for the custom range table
  const calculateTotals = () => {
    if (customRangeData.length === 0) return {};
    
    return {
      totalGmv: customRangeData.reduce((sum, period) => sum + period.totalGmv, 0),
      flashSalesPerformance: customRangeData.reduce((sum, period) => sum + period.flashSalesPerformance, 0),
      topPerformingCreators: Math.max(...customRangeData.map(period => period.topPerformingCreators), 0),
      gmvPerVideo: customRangeData.reduce((sum, period) => sum + period.gmvPerVideo, 0) / customRangeData.length,
      refundRate: customRangeData.reduce((sum, period) => sum + period.refundRate, 0) / customRangeData.length,
      tiktokCampaign: customRangeData.reduce((sum, period) => sum + period.tiktokCampaign, 0)
    };
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
        const formattedEndOfWeek = formatDate(new Date(currentDate));

        // Get start of the current month
        const startOfMonth = getStartOfMonth(currentDate);
        const formattedEndOfMonth = formatDate(currentDate);

        // Fetch performance data for yesterday
        const yesterdayPerformanceResponse = await axios.get('http://127.0.0.1:8000/shop/performance', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            page_size: 10,
            page_no: 1
          }
        });

        // Fetch performance data for the current week
        const currentWeekPerformanceResponse = await axios.get('http://127.0.0.1:8000/shop/performance', {
          params: {
            start_time: startOfWeek,
            end_time: formattedEndOfWeek,
            page_size: 10,
            page_no: 1
          }
        });

        // Fetch performance data for the current month
        const monthToDatePerformanceResponse = await axios.get('http://127.0.0.1:8000/shop/performance', {
          params: {
            start_time: startOfMonth,
            end_time: formattedEndOfMonth,
            page_size: 10,
            page_no: 1
          }
        });
        
        // Fetch flash sales performance 
        const yesterdayflashsales = await axios.get('http://127.0.0.1:8000/flash_sales_performance', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            page_size: 10,
            page_no: 1
          }
        });

        const currentWeekflashsales = await axios.get('http://127.0.0.1:8000/flash_sales_performance', {
          params: {
            start_time: startOfWeek,
            end_time: formattedEndOfWeek,
            page_size: 10,
            page_no: 1
          }
        });

        const monthToDateflashsales = await axios.get('http://127.0.0.1:8000/flash_sales_performance', {
          params: {
            start_time: startOfMonth,
            end_time: formattedEndOfMonth,
            page_size: 10,
            page_no: 1
          }
        });

        // Fetch top-performing creators for each period
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
            start_date: startOfMonth,
            end_date: formattedEndOfMonth,
            page_size: 10,
            page_no: 1
          }
        });

        const dailygmvPervideo = await axios.get('http://127.0.0.1:8000/Gmv_per_video', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            page_size: 10,
            page_no: 1
          }
        });
        const weeklygmvPervideo = await axios.get('http://127.0.0.1:8000/Gmv_per_video', {
          params: {
            start_time: startOfWeek,
            end_time: formattedEndOfWeek,
            page_size: 10,
            page_no: 1
          }
        });
        const monthlygmvPervideo = await axios.get('http://127.0.0.1:8000/Gmv_per_video', {
          params: {
            start_date: startOfMonth,
            end_date: formattedEndOfMonth,
            page_size: 10,
            page_no: 1
          }
        });
        const dailyRefundrate = await axios.get('http://127.0.0.1:8000/calculate_refund_rate', {
          params: {
            start_time: formattedYesterday,
            end_time: formattedYesterday,
            page_size: 10,
            page_no: 1
          }
        });
        const weeklyRefundrate = await axios.get('http://127.0.0.1:8000/calculate_refund_rate', {
          params: {
            start_time: startOfWeek,
            end_time: formattedEndOfWeek,
            page_size: 10,
            page_no: 1
          }
        });
        const monthlyRefundrate = await axios.get('http://127.0.0.1:8000/calculate_refund_rate', {
          params: {
            start_date: startOfMonth,
            end_date: formattedEndOfMonth,
            page_size: 10,
            page_no: 1
          }
        });

        // Update the dashboard state with the fetched data
        setYesterdayData({
          totalGmv: yesterdayPerformanceResponse.data.gmv,
          flashSalesPerformance: yesterdayflashsales.data.total_sales,
          topPerformingCreators: dailycreatorsResponse.data.top_creators.length,
          gmvpervideo: dailygmvPervideo.data.gmv,
          refundrate: dailyRefundrate.data.refund_rate,
          Tiktokcompaign: yesterdayPerformanceResponse.data.gmv
        });

        setCurrentWeekData({
          totalGmv: currentWeekPerformanceResponse.data.gmv,
          flashSalesPerformance: currentWeekflashsales.data.total_sales,
          topPerformingCreators: weaklycreatorsResponse.data.top_creators.length,
          gmvpervideo: weeklygmvPervideo.data.gmv,
          refundrate: weeklyRefundrate.data.refund_rate,
          Tiktokcompaign: currentWeekPerformanceResponse.data.gmv
        });

        setMonthToDateData({
          totalGmv: monthToDatePerformanceResponse.data.gmv,
          flashSalesPerformance: monthToDateflashsales.data.total_sales,
          topPerformingCreators: monthlycreatorsResponse.data.top_creators.length,
          gmvpervideo: monthlygmvPervideo.data.gmv,
          refundrate: monthlyRefundrate.data.refund_rate,
          Tiktokcompaign: monthToDatePerformanceResponse.data.gmv
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

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
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
        <div className="metric-row">
          <span className="metric-label">Tiktok Campaign outcome</span>
          <span className="metric-value">{data.Tiktokcompaign}</span>
        </div>
      </div>
    </div>
  );

  // New custom range table component
  const renderCustomRangeTable = () => {
    if (customRangeData.length === 0) return null;

    const totals = calculateTotals();

    return (
      <div className="custom-range-table-container">
        <div className="custom-range-header">
          <h2>Performance Analysis</h2>
          <p className="date-range-info">
            From {dates.startDate} to {dates.endDate}
          </p>
        </div>
        
        <div className="performance-table">
          <table className="data-table">
            <thead>
              <tr>
                <th className="parameter-column">Parameter/Date</th>
                {customRangeData.map((period, index) => (
                  <th key={index} className="period-column">
                    {period.period}
                  </th>
                ))}
                <th className="total-column">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="section-header">
                <td colSpan={customRangeData.length + 2}>Sales Performance</td>
              </tr>
              
              <tr>
                <td className="metric-label">GMV (raw)</td>
                {customRangeData.map((period, index) => (
                  <td key={index} className="metric-cell">
                    <div className="metric-value">{formatCurrency(period.totalGmv)}</div>
                    <div className={`metric-change ${period.totalGmv > 0 ? 'positive' : 'neutral'}`}>
                      {period.totalGmv > 0 ? '+' : ''}{((period.totalGmv / (totals.totalGmv || 1)) * 100).toFixed(1)}%
                    </div>
                  </td>
                ))}
                <td className="total-cell">{formatCurrency(totals.totalGmv)}</td>
              </tr>

              <tr>
                <td className="metric-label">Flash Sales Performance</td>
                {customRangeData.map((period, index) => (
                  <td key={index} className="metric-cell">
                    <div className="metric-value">{formatCurrency(period.flashSalesPerformance)}</div>
                    <div className={`metric-change ${period.flashSalesPerformance > 0 ? 'positive' : 'neutral'}`}>
                      {period.flashSalesPerformance > 0 ? '+' : ''}{((period.flashSalesPerformance / (totals.flashSalesPerformance || 1)) * 100).toFixed(1)}%
                    </div>
                  </td>
                ))}
                <td className="total-cell">{formatCurrency(totals.flashSalesPerformance)}</td>
              </tr>

              <tr>
                <td className="metric-label">Top Performing Creators</td>
                {customRangeData.map((period, index) => (
                  <td key={index} className="metric-cell">
                    <div className="metric-value">{period.topPerformingCreators}</div>
                    <div className="metric-change neutral">
                      {period.topPerformingCreators > 0 ? '+' : ''}{period.topPerformingCreators}
                    </div>
                  </td>
                ))}
                <td className="total-cell">{totals.topPerformingCreators}</td>
              </tr>

              <tr>
                <td className="metric-label">GMV Per Video</td>
                {customRangeData.map((period, index) => (
                  <td key={index} className="metric-cell">
                    <div className="metric-value">{formatCurrency(period.gmvPerVideo)}</div>
                    <div className={`metric-change ${period.gmvPerVideo > 0 ? 'positive' : 'neutral'}`}>
                      {period.gmvPerVideo > 0 ? '+' : ''}{formatPercentage((period.gmvPerVideo / (totals.gmvPerVideo || 1)) * 100)}
                    </div>
                  </td>
                ))}
                <td className="total-cell">{formatCurrency(totals.gmvPerVideo)}</td>
              </tr>

              <tr>
                <td className="metric-label">Refund Rate</td>
                {customRangeData.map((period, index) => (
                  <td key={index} className="metric-cell">
                    <div className="metric-value">{formatPercentage(period.refundRate)}</div>
                    <div className={`metric-change ${period.refundRate < totals.refundRate ? 'positive' : 'negative'}`}>
                      {period.refundRate < totals.refundRate ? '↓' : '↑'}{Math.abs(period.refundRate - totals.refundRate).toFixed(1)}%
                    </div>
                  </td>
                ))}
                <td className="total-cell">{formatPercentage(totals.refundRate)}</td>
              </tr>

              <tr>
                <td className="metric-label">TikTok Campaign Outcome</td>
                {customRangeData.map((period, index) => (
                  <td key={index} className="metric-cell">
                    <div className="metric-value">{formatCurrency(period.tiktokCampaign)}</div>
                    <div className={`metric-change ${period.tiktokCampaign > 0 ? 'positive' : 'neutral'}`}>
                      {period.tiktokCampaign > 0 ? '+' : ''}{((period.tiktokCampaign / (totals.tiktokCampaign || 1)) * 100).toFixed(1)}%
                    </div>
                  </td>
                ))}
                <td className="total-cell">{formatCurrency(totals.tiktokCampaign)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Original Dashboard Tables */}
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

      {/* Date Range Selection Section */}
      <div className="date-range-section">
        <div className="date-range-card">
          <div className="card-header">
            <div className="header-content">
              <h2 className="card-title">📊 Performance Analysis</h2>
              <p className="card-subtitle">Select a date range to analyze your business metrics</p>
            </div>
          </div>
          
          <div className="card-body">
            <DatePickerCard onDatesChange={setDates} />
            
            <div className="action-section">
              <button
                className={`analyze-button ${(!dates.startDate || !dates.endDate || loading) ? 'disabled' : ''}`}
                onClick={fetchCustomRangeData}
                disabled={!dates.startDate || !dates.endDate || loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span className="button-icon">🔍</span>
                    Analyze Performance
                  </>
                )}
              </button>
              
              {dates.startDate && dates.endDate && (
                <div className="selected-range-display">
                  <span className="range-label">Selected Range:</span>
                  <span className="range-text">
                    {new Date(dates.startDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })} - {new Date(dates.endDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="range-duration">
                    ({Math.ceil((new Date(dates.endDate) - new Date(dates.startDate)) / (1000 * 60 * 60 * 24)) + 1} days)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Range Table */}
      {renderCustomRangeTable()}
    </div>
  );
};

export default Dashboard;