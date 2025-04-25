import React, { useState } from 'react';
import FlightCard from './FlightCard';
import HotelCard from './HotelCard';
import DailyActivities from './DailyActivities';
import PointOfInterestCard from './PointOfInterestCard';

const TabbedItinerary = ({
  itinerary,
  selectedFlight,
  selectedHotel,
  availableFlights,
  availableHotels,
  onFlightChange,
  onHotelChange,
  onLoadMoreFlights,
  onLoadMoreHotels,
  isUpdating,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeDay, setActiveDay] = useState(1);

  const tabs = [
    { id: 'overview', label: 'Travel & Stay' },
    { id: 'daily', label: 'Daily Activities' },
    { id: 'attractions', label: 'Places of Interest' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-6 font-medium text-sm border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab - Flight and Hotel */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Flight</h2>
              {selectedFlight ? (
                <FlightCard
                  flight={selectedFlight}
                  availableFlights={availableFlights}
                  onFlightChange={onFlightChange}
                  isUpdating={isUpdating}
                  onLoadMore={onLoadMoreFlights}
                />
              ) : (
                <div className="p-4 bg-white rounded-lg shadow text-gray-600">
                  <p className="text-center">No flight information available</p>
                </div>
              )}
            </div>
            
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Accommodation</h2>
              {selectedHotel ? (
                <HotelCard
                  hotel={selectedHotel}
                  availableHotels={availableHotels}
                  onHotelChange={onHotelChange}
                  isUpdating={isUpdating}
                  onLoadMore={onLoadMoreHotels}
                />
              ) : (
                <div className="p-4 bg-white rounded-lg shadow text-gray-600">
                  <p className="text-center">No accommodation information available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Daily Activities Tab */}
        {activeTab === 'daily' && (
          <div>
            {/* Day Selection */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex space-x-2">
                {itinerary.daily_plan?.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDay(index + 1)}
                    className={`
                      px-4 py-2 rounded-md transition-colors whitespace-nowrap
                      ${activeDay === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }
                    `}
                  >
                    Day {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Plan Content */}
            {itinerary.daily_plan?.[activeDay - 1] ? (
              <DailyActivities dayPlan={itinerary.daily_plan[activeDay - 1]} />
            ) : (
              <div className="text-center text-gray-600">
                No activities planned for this day.
              </div>
            )}
          </div>
        )}

        {/* Places of Interest Tab */}
        {activeTab === 'attractions' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {itinerary.points_of_interest?.map((poi, index) => (
                <PointOfInterestCard key={index} pointOfInterest={poi} />
              ))}
            </div>
            {(!itinerary.points_of_interest || itinerary.points_of_interest.length === 0) && (
              <div className="text-center text-gray-600">
                No points of interest available.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabbedItinerary; 