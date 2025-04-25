import React from 'react';

const ItinerarySummary = ({ 
  destination,
  duration,
  tripDates,
  startDate,
  endDate,
  budget,
  totalCost,
  summary
}) => {
  const utilization = budget > 0 ? (totalCost / budget) * 100 : 0;
  
  const formatSGD = (amount) => {
    return `SGD ${amount.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="mb-6">
      <div className="bg-[#4285F4] text-white p-6 rounded-t-lg">
        <h2 className="text-xl font-medium">{duration} {destination}</h2>
        <p className="text-sm mt-1">{tripDates}</p>
      </div>
      
      <div className="bg-white p-6 rounded-b-lg">
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4">Trip Overview</h3>
          <p className="text-gray-600 leading-relaxed">
            {summary}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-4">Budget</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Budget:</span>
              <span className="font-medium">{formatSGD(budget)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Estimated Cost:</span>
              <span className="font-medium">{formatSGD(totalCost)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Budget Utilization:</span>
              <span className="font-medium">{utilization.toFixed(1)}%</span>
            </div>

            <div className="relative w-full h-1.5 bg-gray-100">
              <div
                className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-500 ease-in-out"
                style={{ 
                  width: `${Math.min(utilization, 100)}%`,
                  transform: 'translateZ(0)' // Force GPU acceleration for smoother transitions
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItinerarySummary;