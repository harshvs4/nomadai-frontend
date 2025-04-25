import React from 'react';

const DailyActivities = ({ dayPlan }) => {
  if (!dayPlan) return null;

  const TimeBlock = ({ title, activities }) => {
    if (!activities || activities.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="space-y-6">
          {activities.map((item, index) => (
            <div key={index} className="pl-11">
              {/* Activity Header */}
              <div className="font-medium text-gray-900 mb-2">
                {item.type && (
                  <span className="font-bold text-gray-700">**{item.type}:** </span>
                )}
                {item.activity}
              </div>

              {/* Cost */}
              {item.cost && (
                <div className="text-gray-600 mb-2">
                  Cost: {item.cost}
                </div>
              )}

              {/* Address */}
              {item.address && (
                <div className="text-gray-600 mb-1">
                  <span className="font-bold text-gray-700">**Address:** </span>
                  {item.address}
                </div>
              )}

              {/* Description */}
              {item.description && (
                <div className="text-gray-600 mb-1">
                  <span className="font-bold text-gray-700">**Description:** </span>
                  {item.description}
                </div>
              )}

              {/* Entry Fee */}
              {item.entryFee && (
                <div className="text-gray-600 mb-1">
                  <span className="font-bold text-gray-700">**Entry Fee:** </span>
                  {item.entryFee}
                </div>
              )}

              {/* Additional Details */}
              {item.details && item.details.map((detail, i) => (
                <div key={i} className="text-gray-600">
                  {detail}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Day Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Day {dayPlan.day}: {dayPlan.title}
        </h2>
        {dayPlan.date && (
          <p className="text-gray-600 mt-1">{dayPlan.date}</p>
        )}
      </div>

      {/* Time Blocks */}
      <div className="space-y-8">
        <TimeBlock title="Morning" activities={dayPlan.morning} />
        <TimeBlock title="Afternoon" activities={dayPlan.afternoon} />
        <TimeBlock title="Evening" activities={dayPlan.evening} />
      </div>
    </div>
  );
};

export default DailyActivities; 