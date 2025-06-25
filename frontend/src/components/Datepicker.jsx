import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


// Reusable DatePickerCard component
const DatePickerCard = ({ onDatesChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Helper function to format dates as 'YYYY-MM-DD'
  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null); // Reset end date if it's earlier than the start date
    }
    onDatesChange({ startDate: formatDate(date), endDate: formatDate(endDate) });
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDatesChange({ startDate: formatDate(startDate), endDate: formatDate(date) });
  };

  return (
    <div className="date-picker-card">
      <h2>Select Start and End Dates</h2>
      
      <div className="date-picker">
        <label>Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select start date"
        />
      </div>

      <div className="date-picker">
        <label>End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}  // Disable dates before start date
          dateFormat="yyyy-MM-dd"
          placeholderText="Select end date"
        />
      </div>
    </div>
  );
};

export default DatePickerCard;
