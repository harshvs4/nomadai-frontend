import React, { useState, useMemo } from 'react';
import FlightCard from './FlightCard';
import HotelCard from './HotelCard';
import DailyActivities from './DailyActivities';
import PointOfInterestCard from './PointOfInterestCard';

const cleanMarkdownText = (text) => {
  if (!text) return text;
  return text.replace(/\*\*/g, '').replace(/^\s*-\s*/, '');
};

const parseDayPlans = (rawText) => {
  if (!rawText) return [];

  const dayPlans = [];

  // Find the Day-by-Day Plan section
  const dayByDayMatch = rawText.match(/# Detailed Day-by-Day Plan\n\n([\s\S]*?)(?=\n# Cost Summary|$)/);
  if (!dayByDayMatch) return [];

  const dayByDaySection = dayByDayMatch[1];
  
  // Split into individual days using the Day X pattern
  const days = dayByDaySection.split(/(?=\*\*Day \d+:)/);
  
  // Skip the first element if it's empty
  const startIndex = days[0].trim() === '' ? 1 : 0;
  
  for (let i = startIndex; i < days.length; i++) {
    const dayText = days[i].trim();
    
    // Extract day title and date
    const titleMatch = dayText.match(/\*\*Day (\d+): (.*?) - (.*?)\*\*/);
    if (!titleMatch) continue;

    const dayNumber = parseInt(titleMatch[1]);
    const date = titleMatch[2];
    const title = titleMatch[3];

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

    // Split into lines and process each
    const lines = dayText.split('\n').map(line => line.trim()).filter(Boolean);
    
    for (let j = 1; j < lines.length; j++) {  // Start from 1 to skip the title line
      const line = lines[j];
      
      // Check for section headers
      if (line.match(/\*\*Morning:\*\*/i)) {
        currentSection = 'morning';
        continue;
      } else if (line.match(/\*\*Afternoon:\*\*/i)) {
        currentSection = 'afternoon';
        continue;
      } else if (line.match(/\*\*Evening:\*\*/i)) {
        currentSection = 'evening';
        continue;
      }

      if (!currentSection) continue;

      // Process activity lines (starting with *)
      if (line.startsWith('*')) {
        // Remove asterisks and clean up the line
        let cleanLine = line.replace(/^\* /, '').replace(/\*\*/g, '').trim();
        
        // Initialize new activity
        currentActivity = {
          activity: cleanLine,
          type: null,
          cost: null,
          description: null
        };

        // Extract cost if present
        const costMatch = cleanLine.match(/- Approx\. Cost: SGD (\d+(\.\d{2})?)/);
        if (costMatch) {
          currentActivity.cost = `SGD ${costMatch[1]}`;
          cleanLine = cleanLine.replace(/- Approx\. Cost: SGD \d+(\.\d{2})?/, '').trim();
        }

        // Determine activity type based on content
        if (cleanLine.toLowerCase().includes('breakfast')) {
          currentActivity.type = 'Breakfast';
        } else if (cleanLine.toLowerCase().includes('lunch')) {
          currentActivity.type = 'Lunch';
        } else if (cleanLine.toLowerCase().includes('dinner')) {
          currentActivity.type = 'Dinner';
        } else if (cleanLine.toLowerCase().includes('travel') || cleanLine.toLowerCase().includes('taxi')) {
          currentActivity.type = 'Travel';
        } else if (cleanLine.toLowerCase().includes('visit') || cleanLine.toLowerCase().includes('explore')) {
          currentActivity.type = 'Visit';
        } else {
          currentActivity.type = 'Activity';
        }

        // Update the activity text
        currentActivity.activity = cleanLine;

        // Add to the current section
        if (currentSection && currentActivity.activity) {
          dayPlan[currentSection].push(currentActivity);
        }
      } else if (line.startsWith('Description:')) {
        // Add description to the current activity
        if (currentActivity) {
          currentActivity.description = line.replace('Description:', '').trim();
        }
      }
    }

    dayPlans.push(dayPlan);
  }

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