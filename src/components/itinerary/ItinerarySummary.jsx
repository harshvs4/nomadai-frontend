import React, { useState, useEffect } from 'react';
import { formatDate, formatCurrency } from '../../utils/formatters';


const ItinerarySummary = ({ itinerary }) => {
  const [calculatedDuration, setCalculatedDuration] = useState(itinerary?.duration || 0);

  // Calculate duration based on start and end dates
  useEffect(() => {
    if (itinerary?.startDate && itinerary?.endDate) {
      const start = new Date(itinerary.startDate);
      const end = new Date(itinerary.endDate);
      const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both days
      setCalculatedDuration(durationDays);
    }
  }, [itinerary?.startDate, itinerary?.endDate]);

  // Extract total cost from the raw text
  const extractTotalCost = (rawText) => {
    if (!rawText) return null;
    
    const lines = rawText.split('\n');
    for (const line of lines) {
      if (line.includes('Grand Total: SGD')) {
        return parseFloat(line.split('SGD')[1].trim());
      }
    }
    return null;
  };

  const totalBudget = itinerary?.budget || 0;
  const estimatedCost = extractTotalCost(itinerary?.raw_text) || 0;
  const utilization = totalBudget > 0 ? (estimatedCost / totalBudget) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
        <h1 className="text-white text-2xl font-bold">{calculatedDuration}-Day Trip to {itinerary?.destination}</h1>
        <p className="text-blue-100 mt-1">
          {formatDate(itinerary?.startDate)} - {formatDate(itinerary?.endDate)}
        </p>
      </div>

      
      <div className="p-6">
        {/* Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Trip Overview</h2>
          <p className="text-gray-600">{itinerary?.summary}</p>
        </div>
        
        {/* Budget Information */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Budget</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Budget:</span>
            <span className="font-semibold">{formatCurrency(totalBudget)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Estimated Cost:</span>
            <span className="font-semibold">{formatCurrency(estimatedCost)}</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600">Budget Utilization:</span>
            <span className="font-semibold">{utilization.toFixed(1)}%</span>
          </div>
          
          {/* Budget Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className={`h-2.5 rounded-full ${utilization > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            ></div>
          </div>
          
          {/* Budget Status Message */}
          {utilization > 100 && (
            <p className="text-red-500 text-sm mt-1">Budget exceeded!</p>
          )}
          {utilization < 100 && (
            <p className="text-gray-600 text-sm mt-1">
              Remaining: {formatCurrency(totalBudget - estimatedCost)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItinerarySummary;