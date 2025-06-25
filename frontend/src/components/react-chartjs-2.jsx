import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';  // Importing the Line chart component from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components from Chart.js
ChartJS.register(
  CategoryScale,  // For x-axis scaling
  LinearScale,    // For y-axis scaling
  PointElement,   // For individual points on the chart
  LineElement,    // For line charts
  Title,          // For chart title
  Tooltip,        // For chart tooltips
  Legend          // For chart legend
);

const ChartComponent = () => {
  const chartRef = useRef(null);  // Ref to access the chart DOM element directly

  // Sample data for the chart
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',  // Line color
        tension: 0.1,  // For smoothness of the line
      },
    ],
  };

  // Chart options for configuration (e.g., title, responsiveness)
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Sales Overview',  // Chart title
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Sales: $${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  // You can use the chartRef to access and manipulate the chart if needed (e.g., for custom behavior)
  useEffect(() => {
    if (chartRef.current) {
      // You can manually access the chart instance using chartRef
      console.log(chartRef.current);  // Just an example of accessing the chart instance
    }
  }, []);

  return (
    <div>
      <h2>Sales Overview</h2>
      <Line ref={chartRef} data={data} options={options} />  {/* Render Line Chart */}
    </div>
  );
};

export default ChartComponent;
