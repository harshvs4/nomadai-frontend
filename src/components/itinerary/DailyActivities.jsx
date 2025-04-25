import React from 'react';

const DailyActivities = ({ dayPlan }) => {
  if (!dayPlan) return null;

  const parseActivities = (text) => {
    const activities = {
      morning: [],
      afternoon: [],
      evening: []
    };

    let currentSection = null;
    let currentActivity = null;

    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    lines.forEach(line => {
      // Detect section headers
      if (line.toLowerCase().includes('morning')) {
        currentSection = 'morning';
        return;
      } else if (line.toLowerCase().includes('afternoon')) {
        currentSection = 'afternoon';
        return;
      } else if (line.toLowerCase().includes('evening')) {
        currentSection = 'evening';
        return;
      }

      if (!currentSection) return;

      // Start a new activity if it begins with a time or specific keywords
      if (line.match(/^\d{2}:\d{2}/) || 
          line.startsWith('Arrival') || 
          line.startsWith('Transport') || 
          line.startsWith('Check-in') ||
          line.startsWith('Lunch:') ||
          line.startsWith('Visit') ||
          line.startsWith('Dinner:') ||
          line.startsWith('Breakfast') ||
          line.startsWith('Free Time:') ||
          line.startsWith('Return') ||
          line.startsWith('Flight')) {
        
        if (currentActivity) {
          activities[currentSection].push(currentActivity);
        }
        
        currentActivity = { description: line };
        
        // Extract time if present
        const timeMatch = line.match(/^\d{2}:\d{2}/);
        if (timeMatch) {
          currentActivity.time = timeMatch[0];
          currentActivity.description = line.substring(timeMatch[0].length).trim();
        }
        
      } else if (line.toLowerCase().startsWith('transport:')) {
        if (currentActivity) {
          currentActivity.transport = line.substring('transport:'.length).trim();
        }
      } else if (line.toLowerCase().startsWith('duration:')) {
        if (currentActivity) {
          currentActivity.duration = line.substring('duration:'.length).trim();
        }
      } else if (line.includes('approx.') || line.includes('SGD')) {
        if (currentActivity) {
          currentActivity.cost = line.trim();
        }
      } else if (currentActivity) {
        // Append to description for additional details
        currentActivity.description += ' ' + line;
      }
    });

    // Add the last activity
    if (currentActivity && currentSection) {
      activities[currentSection].push(currentActivity);
    }

    return activities;
  };

  const activities = parseActivities(dayPlan);

  const TimeBlock = ({ title, activities, icon }) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className={`rounded-full p-2 mr-3 ${icon.bgColor}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${icon.textColor}`} viewBox="0 0 20 20" fill="currentColor">
            {icon.path}
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="pl-10 space-y-4">
        {activities.map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="font-medium text-gray-800">
                  {item.time && <span className="text-blue-600 mr-2">{item.time}</span>}
                  {item.description}
                </div>
                {item.transport && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Transport:</span> {item.transport}
                  </div>
                )}
                {item.duration && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Duration:</span> {item.duration}
                  </div>
                )}
                {item.cost && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Cost:</span> {item.cost}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      {/* Day Title */}
      {dayPlan.split('\n')[0] && (
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {dayPlan.split('\n')[0]}
        </h2>
      )}

      {/* Morning Activities */}
      {activities.morning.length > 0 && (
        <TimeBlock
          title="Morning"
          activities={activities.morning}
          icon={{
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-600',
            path: <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          }}
        />
      )}

      {/* Afternoon Activities */}
      {activities.afternoon.length > 0 && (
        <TimeBlock
          title="Afternoon"
          activities={activities.afternoon}
          icon={{
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600',
            path: <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 100 12A6 6 0 0010 4zm0 5a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" clipRule="evenodd" />
          }}
        />
      )}

      {/* Evening Activities */}
      {activities.evening.length > 0 && (
        <TimeBlock
          title="Evening"
          activities={activities.evening}
          icon={{
            bgColor: 'bg-indigo-100',
            textColor: 'text-indigo-600',
            path: <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          }}
        />
      )}
    </div>
  );
};

export default DailyActivities; 