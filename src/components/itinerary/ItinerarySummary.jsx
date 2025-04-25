import React, { useState, useEffect } from 'react';
import { formatDate, formatCurrency } from '../../utils/formatters';

const ItinerarySummary = ({ itinerary }) => {
  const [calculatedDuration, setCalculatedDuration] = useState(0);

  // Calculate duration based on start and end dates
  useEffect(() => {
    if (itinerary?.startDate && itinerary?.endDate) {
      const start = new Date(itinerary.startDate);
      const end = new Date(itinerary.endDate);
      const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both days
      setCalculatedDuration(durationDays);
    }
  }, [itinerary?.startDate, itinerary?.endDate]);

  // Return early if no itinerary is provided
  if (!itinerary) {
    return null;
  }

  // Extract total cost from raw text
  const extractTotalCost = (rawText) => {
    if (!rawText) return null;
    
    const lines = rawText.split('\n');
    let totalCost = null;
    
    for (const line of lines) {
      if (line.includes('Grand Total: SGD')) {
        const match = line.match(/SGD\s+([\d,.]+)/);
        if (match) {
          totalCost = parseFloat(match[1]);
          break;
        }
      }
    }
    
    return totalCost;
  };

  const estimatedCost = extractTotalCost(itinerary.raw_text) || 0;
  const totalBudget = parseFloat(itinerary.budget) || 0;
  const budgetUtilization = totalBudget > 0 ? (estimatedCost / totalBudget) * 100 : 0;

  return (
    <>
      {/* Main Title Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Trip Itinerary: {itinerary.source || 'Singapore'} to {itinerary.destination || 'Unknown'} ({formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)})
        </h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Overview</h2>
          <p className="text-gray-600 text-lg">
            {itinerary.summary || `Embark on a ${calculatedDuration}-day adventure from ${itinerary.source || 'Singapore'} to ${itinerary.destination || 'Unknown'}, experiencing a mix of cultural attractions and culinary delights. Your itinerary is designed to maximize your time and enjoyment while staying within your budget of ${formatCurrency(totalBudget)}.`}
          </p>
        </div>

        {/* Flight Details Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Flight Details</h2>
          <ul className="space-y-2 text-gray-600">
            <li><span className="font-medium">Airline:</span> {itinerary.selectedFlight?.airline || 'Not selected'}</li>
            <li><span className="font-medium">Flight Number:</span> {itinerary.selectedFlight?.flightNumber || 'Not selected'}</li>
            <li><span className="font-medium">Departure:</span> {itinerary.selectedFlight?.departureTime ? `${formatDate(itinerary.selectedFlight.departureTime)} from ${itinerary.source}` : 'Not selected'}</li>
            <li><span className="font-medium">Arrival:</span> {itinerary.selectedFlight?.arrivalTime ? `${formatDate(itinerary.selectedFlight.arrivalTime)} in ${itinerary.destination}` : 'Not selected'}</li>
            <li><span className="font-medium">Price:</span> {itinerary.selectedFlight?.price ? formatCurrency(itinerary.selectedFlight.price) : 'Not selected'}</li>
          </ul>
        </div>

        {/* Hotel Recommendation Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Hotel Recommendation</h2>
          <ul className="space-y-2 text-gray-600">
            <li><span className="font-medium">Hotel Name:</span> {itinerary.selectedHotel?.name || 'Not selected'}</li>
            <li><span className="font-medium">Price per Night:</span> {itinerary.selectedHotel?.pricePerNight ? formatCurrency(itinerary.selectedHotel.pricePerNight) : 'Not selected'}</li>
            <li><span className="font-medium">Total for {calculatedDuration} Nights:</span> {itinerary.selectedHotel?.totalPrice ? formatCurrency(itinerary.selectedHotel.totalPrice) : 'Not selected'}</li>
            <li><span className="font-medium">Amenities:</span> {itinerary.selectedHotel?.amenities?.join(', ') || 'Not specified'}</li>
            <li><span className="font-medium">Address:</span> {itinerary.selectedHotel?.address || 'Not specified'}</li>
          </ul>
        </div>
      </div>

      {/* Budget Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Budget</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Budget:</span>
              <span className="font-semibold text-lg">{formatCurrency(totalBudget)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Estimated Cost:</span>
              <span className="font-semibold text-lg">{formatCurrency(estimatedCost)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Budget Utilization:</span>
              <span className="font-semibold text-lg">{budgetUtilization.toFixed(1)}%</span>
            </div>
            
            {/* Budget Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${budgetUtilization > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
              ></div>
            </div>
            
            {/* Budget Status Message */}
            {budgetUtilization > 100 ? (
              <p className="text-red-500 text-sm">Budget exceeded.</p>
            ) : budgetUtilization === 100 ? (
              <p className="text-blue-500 text-sm">Budget fully utilized.</p>
            ) : (
              <p className="text-green-500 text-sm">
                Remaining: {formatCurrency(totalBudget - estimatedCost)}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ItinerarySummary;