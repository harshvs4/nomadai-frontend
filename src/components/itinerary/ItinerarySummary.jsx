import React, { useState, useEffect } from 'react';
import { formatDate, formatCurrency } from '../../utils/formatters';


const ItinerarySummary = ({
  destination,
  duration,
  startDate,
  endDate,
  budget,
  totalCost,
  summary
}) => {
  const [calculatedDuration, setCalculatedDuration] = useState(duration);

  // Calculate duration based on start and end dates
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both days
      setCalculatedDuration(durationDays);
    }
  }, [startDate, endDate]);

  // Calculate budget utilization percentage
  const budgetUtilization = Math.min(Math.round((totalCost / budget) * 100), 100);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
        <h1 className="text-white text-2xl font-bold">{calculatedDuration}-Day Trip to {destination}</h1>
        <p className="text-blue-100 mt-1">
          {formatDate(startDate)} - {formatDate(endDate)}
        </p>
      </div>

      
      <div className="p-6">
        {/* Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Trip Overview</h2>
          <p className="text-gray-600">{summary}</p>
        </div>
        
        {/* Budget Information */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Budget</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Budget:</span>
            <span className="font-semibold">{formatCurrency(budget)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Estimated Cost:</span>
            <span className="font-semibold">{formatCurrency(totalCost)}</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600">Budget Utilization:</span>
            <span className="font-semibold">{budgetUtilization}%</span>
          </div>
          
          {/* Budget Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className={`h-2.5 rounded-full ${
                budgetUtilization > 90 ? 'bg-red-500' : 
                budgetUtilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${budgetUtilization}%` }}
            ></div>
          </div>
          
          {/* Budget Status Message */}
          <p className={`text-sm mt-1 ${
            budgetUtilization > 90 ? 'text-red-600' : 
            budgetUtilization > 75 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {budgetUtilization > 90 
              ? 'Budget fully utilized.'
              : budgetUtilization > 75 
                ? 'Budget mostly utilized.'
                : 'Well within budget.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItinerarySummary;