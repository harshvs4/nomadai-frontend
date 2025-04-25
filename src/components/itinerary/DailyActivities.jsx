import React from 'react';

const DailyActivities = ({ dayPlan }) => {
  if (!dayPlan) return null;

  const ActivityIcon = ({ type }) => {
    const iconMap = {
      Travel: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
        </svg>
      ),
      Breakfast: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 3a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H3z" />
        </svg>
      ),
      Lunch: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 002 2v.683c-.313.322-.6.677-.854 1.067a.75.75 0 001.51.67c.203-.458.478-.85.798-1.11.474.291.925.446 1.396.446.47 0 .922-.155 1.396-.446.32.26.595.652.798 1.11a.75.75 0 001.51-.67c-.254-.39-.542-.745-.854-1.067V12a2 2 0 002-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      Dinner: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 9.846 4.632 12 6.414 12H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 1H3z" />
        </svg>
      ),
      Visit: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
      Activity: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    };

    const iconColor = {
      Travel: 'text-blue-600',
      Breakfast: 'text-orange-600',
      Lunch: 'text-yellow-600',
      Dinner: 'text-purple-600',
      Visit: 'text-green-600',
      Activity: 'text-indigo-600'
    };

    return (
      <div className={`w-8 h-8 rounded-full bg-${iconColor[type]?.split('text-')[1]?.replace('600', '100')} flex items-center justify-center`}>
        <div className={`${iconColor[type] || 'text-gray-600'}`}>
          {iconMap[type] || iconMap.Activity}
        </div>
      </div>
    );
  };

  const TimeBlock = ({ title, activities }) => {
    if (!activities || activities.length === 0) return null;

    const timeIconMap = {
      Morning: '🌅',
      Afternoon: '☀️',
      Evening: '🌙'
    };

    return (
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="text-2xl mr-3">{timeIconMap[title]}</div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="space-y-6 pl-14">
          {activities.map((item, index) => (
            <div key={index} className="relative flex items-start group">
              <div className="absolute -left-14 mt-1">
                <ActivityIcon type={item.type} />
              </div>
              <div className="flex-1 min-w-0 bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-start justify-between">
                  <p className="text-gray-900 font-medium">
                    {item.activity}
                  </p>
                  {item.cost && item.cost !== 'SGD 0' && (
                    <div className="ml-4 text-sm font-medium text-blue-600 tabular-nums whitespace-nowrap">
                      {item.cost}
                    </div>
                  )}
                </div>
                {item.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-xl p-8">
      {/* Day Title */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Day {dayPlan.day}
        </h2>
        <div className="text-xl text-gray-600 font-medium mb-1">
          {dayPlan.title}
        </div>
        {dayPlan.date && (
          <p className="text-gray-500">{dayPlan.date}</p>
        )}
      </div>

      {/* Time Blocks */}
      <div className="space-y-12 max-w-3xl mx-auto">
        <TimeBlock title="Morning" activities={dayPlan.morning} />
        <TimeBlock title="Afternoon" activities={dayPlan.afternoon} />
        <TimeBlock title="Evening" activities={dayPlan.evening} />
      </div>
    </div>
  );
};

export default DailyActivities; 