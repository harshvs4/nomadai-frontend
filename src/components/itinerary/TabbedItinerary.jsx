import React, { useState, useMemo } from 'react';
import FlightCard from './FlightCard';
import HotelCard from './HotelCard';
import DailyActivities from './DailyActivities';
import PointOfInterestCard from './PointOfInterestCard';

const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/^\*+|-|\s*\*+$|\*/g, '') // Remove asterisks and dashes
    .replace(/\s*:\s*/, ': ')          // Clean up colons
    .replace(/\s+/g, ' ')              // Normalize spaces
    .replace(/^(Travel|Activity|Description|Evening Activity|Check-in|Relax)\*?\s*/, '') // Remove activity type prefixes
    .trim();
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
    const lines = dayText.split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => cleanText(line));
    
    for (let j = 1; j < lines.length; j++) {
      const line = lines[j];
      
      // Check for section headers
      if (line.toLowerCase().includes('morning:')) {
        currentSection = 'morning';
        continue;
      } else if (line.toLowerCase().includes('afternoon:')) {
        currentSection = 'afternoon';
        continue;
      } else if (line.toLowerCase().includes('evening:')) {
        currentSection = 'evening';
        continue;
      }

      if (!currentSection || line.toLowerCase().includes('estimated daily cost')) continue;

      // Process activity lines
      if (line) {
        // Initialize new activity
        currentActivity = {
          activity: '',
          type: null,
          cost: null,
          description: null,
          duration: null
        };

        // Extract duration if present
        const durationMatch = line.match(/\((?:Est\.)?\s*Duration:\s*(.*?)\)/i);
        if (durationMatch) {
          currentActivity.duration = durationMatch[1].trim();
        }

        // Extract cost if present
        const costMatch = line.match(/(?:Approx\.)?\s*Cost:\s*SGD\s*(\d+(?:\.\d{2})?)/i);
        if (costMatch) {
          currentActivity.cost = `SGD ${costMatch[1]}`;
        }

        // Clean up the activity text
        let activityText = line
          .replace(/\((?:Est\.)?\s*Duration:.*?\)/i, '')
          .replace(/(?:Approx\.)?\s*Cost:\s*SGD\s*\d+(?:\.\d{2})?/i, '')
          .trim();

        // Extract description if present
        const descriptionMatch = activityText.match(/Description:\s*(.*)/i);
        if (descriptionMatch) {
          currentActivity.description = descriptionMatch[1].trim();
          activityText = activityText.replace(/Description:\s*.*/i, '').trim();
        }

        // Set the main activity text
        currentActivity.activity = activityText;

        // Determine activity type
        if (line.toLowerCase().includes('breakfast')) {
          currentActivity.type = 'Breakfast';
        } else if (line.toLowerCase().includes('lunch')) {
          currentActivity.type = 'Lunch';
        } else if (line.toLowerCase().includes('dinner')) {
          currentActivity.type = 'Dinner';
        } else if (line.toLowerCase().includes('travel') || line.toLowerCase().includes('taxi')) {
          currentActivity.type = 'Travel';
        } else if (line.toLowerCase().includes('visit') || line.toLowerCase().includes('explore')) {
          currentActivity.type = 'Visit';
        } else if (line.toLowerCase().includes('check-in') || line.toLowerCase().includes('hotel')) {
          currentActivity.type = 'Hotel';
        } else if (line.toLowerCase().includes('relax') || line.toLowerCase().includes('free time')) {
          currentActivity.type = 'Relax';
        } else {
          currentActivity.type = 'Activity';
        }

        // Add to the current section if we have valid activity text
        if (currentSection && currentActivity.activity) {
          dayPlan[currentSection].push(currentActivity);
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