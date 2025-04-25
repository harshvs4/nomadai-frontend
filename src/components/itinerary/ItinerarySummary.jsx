import React, { useState, useEffect } from 'react';
import { formatDate, formatCurrency } from '../../utils/formatters';

const ItinerarySummary = ({ itinerary }) => {
  const [calculatedDuration, setCalculatedDuration] = useState(0);

  // Calculate duration based on start and end dates
  useEffect(() => {
    if (itinerary?.startDate && itinerary?.endDate) {
      const start = new Date(itinerary.startDate);
      const end = new Date(itinerary.endDate);
      const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      setCalculatedDuration(durationDays);
    }
  }, [itinerary?.startDate, itinerary?.endDate]);

  // Extract total cost from the raw text
  const extractTotalCost = (rawText) => {
    if (!rawText) return null;
    
    const lines = rawText.split('\n');
    for (const line of lines) {
      if (line.includes('Total Budget: SGD')) {
        return parseFloat(line.split('SGD')[1].trim());
      }
      if (line.includes('Grand Total: SGD')) {
        return parseFloat(line.split('SGD')[1].trim());
      }
    }
    return null;
  };

  // Extract budget from raw text
  const extractBudget = (rawText) => {
    if (!rawText) return null;
    
    const lines = rawText.split('\n');
    for (const line of lines) {
      if (line.includes('Total Budget: SGD')) {
        return parseFloat(line.split('SGD')[1].trim());
      }
    }
    return null;
  };

  const totalBudget = extractBudget(itinerary?.raw_text) || 4000; // Default to 4000 if not found
  const estimatedCost = extractTotalCost(itinerary?.raw_text) || 0;
  const utilization = totalBudget > 0 ? (estimatedCost / totalBudget) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Budget</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Budget:</span>
          <span className="font-medium">SGD {totalBudget.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Estimated Cost:</span>
          <span className="font-medium">SGD {estimatedCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Budget Utilization:</span>
          <span className="font-medium">{utilization.toFixed(1)}%</span>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${utilization > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            ></div>
          </div>
        </div>
        {utilization > 100 && (
          <p className="text-red-500 text-sm mt-2">Budget exceeded!</p>
        )}
        {utilization < 100 && (
          <p className="text-gray-600 text-sm mt-2">
            Remaining: SGD {(totalBudget - estimatedCost).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ItinerarySummary;