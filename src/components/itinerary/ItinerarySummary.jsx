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
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900">
        Travel Itinerary: {itinerary.source || 'Singapore'} to {itinerary.destination || 'Dubai'} ({formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)})
      </h1>

      {/* Budget Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Budget</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Budget:</span>
            <span className="font-medium">{formatCurrency(totalBudget)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Estimated Cost:</span>
            <span className="font-medium">{formatCurrency(estimatedCost)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Budget Utilization:</span>
            <span className="font-medium">{budgetUtilization.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${budgetUtilization > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            ></div>
          </div>
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

      {/* Introduction */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-3">Introduction</h2>
        <p className="text-gray-600">
          {itinerary.summary || `Embark on an exciting ${calculatedDuration}-day adventure in ${itinerary.destination || 'Dubai'}, a city known for its modern architecture, luxury shopping, and vibrant nightlife. This itinerary offers a blend of cultural experiences, culinary delights, and thrilling attractions, all while keeping within your budget of ${formatCurrency(totalBudget)}.`}
        </p>
      </div>

      {/* Flight Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-3">Flight Details</h2>
        <ul className="space-y-2 text-gray-600">
          <li><span className="font-medium">Airline:</span> {itinerary.selectedFlight?.airline || 'Not selected'}</li>
          <li><span className="font-medium">Flight Number:</span> {itinerary.selectedFlight?.flightNumber || 'Not selected'}</li>
          <li><span className="font-medium">Departure:</span> {itinerary.selectedFlight?.departureTime ? `${formatDate(itinerary.selectedFlight.departureTime)} from ${itinerary.source}` : 'Not selected'}</li>
          <li><span className="font-medium">Arrival:</span> {itinerary.selectedFlight?.arrivalTime ? `${formatDate(itinerary.selectedFlight.arrivalTime)} in ${itinerary.destination}` : 'Not selected'}</li>
          <li><span className="font-medium">Price:</span> {itinerary.selectedFlight?.price ? formatCurrency(itinerary.selectedFlight.price) : 'Not selected'}</li>
        </ul>
      </div>

      {/* Hotel Recommendation */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-3">Hotel Recommendation</h2>
        <ul className="space-y-2 text-gray-600">
          <li><span className="font-medium">Hotel Name:</span> {itinerary.selectedHotel?.name || 'Not selected'}</li>
          <li><span className="font-medium">Price per Night:</span> {itinerary.selectedHotel?.pricePerNight ? formatCurrency(itinerary.selectedHotel.pricePerNight) : 'Not selected'}</li>
          <li><span className="font-medium">Total for {calculatedDuration} Nights:</span> {itinerary.selectedHotel?.totalPrice ? formatCurrency(itinerary.selectedHotel.totalPrice) : 'Not selected'}</li>
          <li><span className="font-medium">Amenities:</span> {itinerary.selectedHotel?.amenities?.join(', ') || 'Not specified'}</li>
          <li><span className="font-medium">Address:</span> {itinerary.selectedHotel?.address || 'Not specified'}</li>
        </ul>
      </div>
    </div>
  );
};

export default ItinerarySummary;