import React, { useState, useMemo } from 'react';
import FlightCard from './FlightCard';
import HotelCard from './HotelCard';
import DailyActivities from './DailyActivities';
import PointOfInterestCard from './PointOfInterestCard';

const parseDayPlans = (rawText) => {
  if (!rawText) return [];

  const dayPlans = [];
  const dayRegex = /Day (\d+): ([^\n]+)/;
  const dateRegex = /\((.*?)\)/;

  // Split the text into day sections
  const dayTexts = rawText.split(/Day \d+:/).filter(text => text.trim());
  
  dayTexts.forEach((dayText, index) => {
    const dayNumber = index + 1;
    const lines = dayText.split('\n').map(line => line.trim()).filter(Boolean);
    
    // Extract day title and date
    const titleLine = lines[0];
    const dateMatch = titleLine.match(dateRegex);
    const title = titleLine.replace(dateRegex, '').trim();
    const date = dateMatch ? dateMatch[1].trim() : '';

    const dayPlan = {
      day: dayNumber,
      date,
      title,
      morning: [],
      afternoon: [],
      evening: []
    };

    let currentSection = null;
    let currentActivity = null;

    lines.forEach(line => {
      // Detect section
      if (line.toLowerCase().includes('morning:')) {
        currentSection = 'morning';
        return;
      } else if (line.toLowerCase().includes('afternoon:')) {
        currentSection = 'afternoon';
        return;
      } else if (line.toLowerCase().includes('evening:')) {
        currentSection = 'evening';
        return;
      }

      if (!currentSection) return;

      // Check for activity markers
      if (line.match(/^\*\*(.*?):\*\*/)) {
        // Save previous activity if exists
        if (currentActivity) {
          dayPlan[currentSection].push(currentActivity);
        }

        // Extract activity type and content
        const [, type, content] = line.match(/^\*\*(.*?):\*\*(.*)$/);
        currentActivity = {
          type,
          activity: content.trim(),
          details: []
        };
      }
      // Check for cost
      else if (line.toLowerCase().startsWith('cost:')) {
        if (currentActivity) {
          currentActivity.cost = line.replace('Cost:', '').trim();
        }
      }
      // Check for address
      else if (line.match(/^\*\*Address:\*\*/)) {
        if (currentActivity) {
          currentActivity.address = line.replace(/^\*\*Address:\*\*/, '').trim();
        }
      }
      // Check for description
      else if (line.match(/^\*\*Description:\*\*/)) {
        if (currentActivity) {
          currentActivity.description = line.replace(/^\*\*Description:\*\*/, '').trim();
        }
      }
      // Check for entry fee
      else if (line.match(/^\*\*Entry Fee:\*\*/)) {
        if (currentActivity) {
          currentActivity.entryFee = line.replace(/^\*\*Entry Fee:\*\*/, '').trim();
        }
      }
      // Add as detail if none of the above
      else if (currentActivity && line.trim()) {
        currentActivity.details.push(line.trim());
      }
    });

    // Add the last activity
    if (currentActivity) {
      dayPlan[currentSection].push(currentActivity);
    }

    dayPlans.push(dayPlan);
  });

  return dayPlans;
};

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

  // Parse the day plans from the LLM response
  const dayPlans = useMemo(() => {
    return parseDayPlans(itinerary?.raw_text);
  }, [itinerary?.raw_text]);

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