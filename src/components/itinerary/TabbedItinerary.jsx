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

  // Sample structured data for the day-by-day breakdown
  const dayPlans = [
    {
      day: 1,
      date: "April 26, 2025",
      title: "Arrival in Dubai",
      morning: [
        {
          time: "12:10 PM",
          activity: "Arrive in Dubai",
          details: []
        },
        {
          time: "",
          activity: "Transfer to the hotel via taxi",
          cost: "approx. SGD 20",
          details: []
        },
        {
          time: "",
          activity: "Check-in at Crowne Plaza Dubai Deira",
          details: []
        }
      ],
      afternoon: [
        {
          time: "",
          activity: "Lunch at GIA",
          cost: "approx. SGD 30",
          details: ["Italian cuisine"]
        },
        {
          time: "",
          activity: "Visit the Museum of The Future",
          cost: "Entry Fee: approx. SGD 20",
          details: ["Explore the innovative exhibits until 5:00 PM"]
        }
      ],
      evening: [
        {
          time: "",
          activity: "Visit ARTE Museum Dubai at Dubai Mall",
          cost: "Entry Fee: approx. SGD 15",
          details: []
        },
        {
          time: "",
          activity: "Dinner at Trésind Dubai",
          cost: "approx. SGD 60",
          details: ["Upscale Indian meal"]
        },
        {
          time: "",
          activity: "Return to the hotel for rest",
          details: []
        }
      ]
    },
    {
      day: 2,
      date: "April 27, 2025",
      title: "Full Day in Dubai",
      morning: [
        {
          time: "",
          activity: "Breakfast at the hotel",
          cost: "included",
          details: []
        },
        {
          time: "",
          activity: "Visit Illusion City Dubai - Illusion Museum",
          cost: "Entry Fee: approx. SGD 15",
          details: []
        }
      ],
      afternoon: [
        {
          time: "",
          activity: "Lunch at a local café",
          cost: "approx. SGD 25",
          details: []
        },
        {
          time: "",
          activity: "IMG Worlds of Adventure",
          cost: "Entry Fee: approx. SGD 70",
          details: ["Enjoy the rides and attractions until 6:00 PM"]
        }
      ],
      evening: [
        {
          time: "",
          activity: "Dinner at CÉ LA VI",
          cost: "approx. SGD 80",
          details: []
        },
        {
          time: "",
          activity: "Explore Dubai Marina",
          details: ["Relaxing stroll"]
        },
        {
          time: "",
          activity: "Return to the hotel for the night",
          details: []
        }
      ]
    },
    {
      day: 3,
      date: "April 28, 2025",
      title: "Departure",
      morning: [
        {
          time: "",
          activity: "Breakfast at the hotel",
          cost: "included",
          details: []
        },
        {
          time: "",
          activity: "Check-out from the hotel",
          details: []
        },
        {
          time: "",
          activity: "Transfer to the airport via taxi",
          cost: "approx. SGD 20",
          details: []
        },
        {
          time: "",
          activity: "Depart from Dubai back to Singapore",
          details: []
        }
      ],
      afternoon: [],
      evening: []
    }
  ];

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
                {dayPlans.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setActiveDay(day.day)}
                    className={`
                      px-4 py-2 rounded-md transition-colors whitespace-nowrap
                      ${activeDay === day.day
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }
                    `}
                  >
                    Day {day.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Plan Content */}
            {dayPlans.find(day => day.day === activeDay) ? (
              <DailyActivities dayPlan={dayPlans.find(day => day.day === activeDay)} />
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