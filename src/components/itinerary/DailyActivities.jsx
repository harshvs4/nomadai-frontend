import React from 'react';

const DailyActivities = ({ dayPlan }) => {
  if (!dayPlan) return null;

  const { morning, afternoon, evening } = dayPlan;

  const TimeBlock = ({ title, content, icon }) => (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <div className={`rounded-full p-2 mr-3 ${icon.bgColor}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${icon.textColor}`} viewBox="0 0 20 20" fill="currentColor">
            {icon.path}
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="pl-10 space-y-2">
        {content.map((item, index) => {
          if (item.activity) {
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                <div className="font-medium text-gray-800">{item.activity}</div>
                {item.address && (
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Address:</span> {item.address}
                  </div>
                )}
                {item.time && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Time:</span> {item.time}
                  </div>
                )}
                {item.description && (
                  <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                )}
                {item.cost && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Cost:</span> {item.cost}
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );

  const parseActivities = (text) => {
    if (!text) return [];
    
    // Split the text into lines and process each line
    const activities = [];
    let currentActivity = {};
    
    text.split('\n').forEach(line => {
      line = line.trim();
      if (!line) return;
      
      if (line.startsWith('Visit') || line.startsWith('Dinner') || line.startsWith('Lunch') || 
          line.startsWith('Breakfast') || line.startsWith('Explore') || line.startsWith('Transfer') ||
          line.startsWith('Check') || line.startsWith('Return') || line.startsWith('Relax')) {
        if (Object.keys(currentActivity).length > 0) {
          activities.push(currentActivity);
        }
        currentActivity = { activity: line };
      } else if (line.startsWith('Address:')) {
        currentActivity.address = line.replace('Address:', '').trim();
      } else if (line.startsWith('Time:')) {
        currentActivity.time = line.replace('Time:', '').trim();
      } else if (line.startsWith('Description:')) {
        currentActivity.description = line.replace('Description:', '').trim();
      } else if (line.includes('Approx.') || line.includes('Entry Fee:')) {
        currentActivity.cost = line;
      } else if (currentActivity.activity) {
        // Append to description if it's additional information
        currentActivity.description = currentActivity.description 
          ? `${currentActivity.description} ${line}`
          : line;
      }
    });
    
    if (Object.keys(currentActivity).length > 0) {
      activities.push(currentActivity);
    }
    
    return activities;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      {/* Morning Activities */}
      <TimeBlock
        title="Morning"
        content={parseActivities(morning)}
        icon={{
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-600',
          path: <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        }}
      />

      {/* Afternoon Activities */}
      <TimeBlock
        title="Afternoon"
        content={parseActivities(afternoon)}
        icon={{
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600',
          path: <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 100 12A6 6 0 0010 4zm0 5a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" clipRule="evenodd" />
        }}
      />

      {/* Evening Activities */}
      <TimeBlock
        title="Evening"
        content={parseActivities(evening)}
        icon={{
          bgColor: 'bg-indigo-100',
          textColor: 'text-indigo-600',
          path: <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        }}
      />
    </div>
  );
};

export default DailyActivities; 