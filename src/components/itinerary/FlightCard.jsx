import React, { useState } from 'react';
import { formatDate, formatCurrency, formatTime } from '../../utils/formatters';
import Button from '../common/Button';

const FlightCard = ({ 
  flight, 
  availableFlights, 
  onFlightChange, 
  isUpdating,
  onLoadMore
}) => {
  const [showOptions, setShowOptions] = useState(false);
  
  // Check if we have departure/arrival time information
  const hasTimeInfo = flight.departure_time && flight.arrival_time;
  
  // Format airline code to airline name
  const getAirlineName = (code) => {
    const airlines = {
      'SQ': 'Singapore Airlines',
      'JL': 'Japan Airlines',
      'AF': 'Air France',
      'BA': 'British Airways',
      'UA': 'United Airlines',
      'TG': 'Thai Airways',
      'EK': 'Emirates',
      'QF': 'Qantas',
      'AA': 'American Airlines',
      'DL': 'Delta Air Lines'
    };
    
    return airlines[code] || code;
  };
  
  const handleSelectFlight = (selectedFlight) => {
    onFlightChange(selectedFlight);
    setShowOptions(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Flight Card Header */}
      <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex justify-between items-center">
        <div className="font-medium text-blue-800">
          {flight.flight_number ? `${flight.airline} ${flight.flight_number}` : getAirlineName(flight.airline)}
        </div>
        <div className="text-green-700 font-semibold">
          {formatCurrency(flight.price)}
        </div>
      </div>
      
      {/* Flight Details */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-gray-500 text-sm">From</div>
            <div className="text-lg font-medium">{flight.origin}</div>
            {hasTimeInfo && (
              <div className="text-gray-600 text-sm mt-1">{formatTime(flight.departure_time)}</div>
            )}
          </div>
          
          <div className="flex-1 px-4">
            <div className="relative flex items-center justify-center">
              <div className="border-t-2 border-gray-300 flex-grow mx-2"></div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.143a1 1 0 00-1-1H4.429a1 1 0 00-.429.076l-1.452.412a1 1 0 01-1.17-1.409l7-14z" />
                  <path d="M12 3.429V2a1 1 0 011.553-.833l4 2A1 1 0 0118 4v13a1 1 0 01-1.447.894l-4-2A1 1 0 0112 15v-1.571L8.553 14.33A1 1 0 018 14.571V15a1 1 0 01-2 0v-4.429a1 1 0 01.725-.961l2.898-.828A1 1 0 0110 8v-.571A1 1 0 0110.894 6.553l1.106-.553z" />
                </svg>
              </div>
              <div className="border-t-2 border-gray-300 flex-grow mx-2"></div>
            </div>
            <div className="text-xs text-center text-gray-500 mt-1">
              {formatDate(flight.depart_date)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-gray-500 text-sm">To</div>
            <div className="text-lg font-medium">{flight.destination}</div>
            {hasTimeInfo && (
              <div className="text-gray-600 text-sm mt-1">{formatTime(flight.arrival_time)}</div>
            )}
          </div>
        </div>
        
        {/* Return Flight */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-gray-500 text-sm">Return</div>
              <div className="text-lg font-medium">{flight.destination}</div>
            </div>
            
            <div className="flex-1 px-4">
              <div className="relative flex items-center justify-center">
                <div className="border-t-2 border-gray-300 flex-grow mx-2"></div>
                <div className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.143a1 1 0 00-1-1H4.429a1 1 0 00-.429.076l-1.452.412a1 1 0 01-1.17-1.409l7-14z" />
                    <path d="M12 3.429V2a1 1 0 011.553-.833l4 2A1 1 0 0118 4v13a1 1 0 01-1.447.894l-4-2A1 1 0 0112 15v-1.571L8.553 14.33A1 1 0 018 14.571V15a1 1 0 01-2 0v-4.429a1 1 0 01.725-.961l2.898-.828A1 1 0 0110 8v-.571A1 1 0 0110.894 6.553l1.106-.553z" />
                  </svg>
                </div>
                <div className="border-t-2 border-gray-300 flex-grow mx-2"></div>
              </div>
              <div className="text-xs text-center text-gray-500 mt-1">
                {formatDate(flight.return_date)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-gray-500 text-sm">To</div>
              <div className="text-lg font-medium">{flight.origin}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Flight Options */}
      {availableFlights && availableFlights.length > 1 && (
        <div className="border-t border-gray-200 px-4 py-3">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-blue-600 text-sm font-medium flex items-center"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Change Flight'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 transition-transform ${showOptions ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showOptions && (
            <div className="mt-3 space-y-2">
              {availableFlights.map((option, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border cursor-pointer transition-colors ${
                    option.airline === flight.airline && option.price === flight.price
                      ? 'bg-blue-50 border-blue-200'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectFlight(option)}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">
                      {option.flight_number ? `${option.airline} ${option.flight_number}` : getAirlineName(option.airline)}
                    </div>
                    <div className={`font-semibold ${option.price < flight.price ? 'text-green-600' : 'text-gray-700'}`}>
                      {formatCurrency(option.price)}
                    </div>
                  </div>
                  {option.departure_time && (
                    <div className="text-sm text-gray-500 mt-1">
                      Departs at {formatTime(option.departure_time)}
                    </div>
                  )}
                </div>
              ))}
              
              {onLoadMore && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={onLoadMore}
                  disabled={isUpdating}
                  size="sm"
                >
                  Load More Options
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightCard;