import React from 'react';

const PreferenceSelector = ({ 
  availablePreferences, 
  selectedPreferences, 
  onChange, 
  maxSelections = 3 
}) => {
  const handlePreferenceToggle = (preferenceId) => {
    // If preference is already selected, remove it
    if (selectedPreferences.includes(preferenceId)) {
      onChange(selectedPreferences.filter(id => id !== preferenceId));
    } 
    // If not selected and we haven't reached max selections, add it
    else if (selectedPreferences.length < maxSelections) {
      onChange([...selectedPreferences, preferenceId]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {availablePreferences.map((preference) => (
          <button
            key={preference.id}
            type="button"
            onClick={() => handlePreferenceToggle(preference.id)}
            className={`px-4 py-2 text-sm rounded-full transition-colors duration-200 ${
              selectedPreferences.includes(preference.id)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={
              !selectedPreferences.includes(preference.id) &&
              selectedPreferences.length >= maxSelections
            }
          >
            {preference.label}
          </button>
        ))}
      </div>
      
      {selectedPreferences.length >= maxSelections && (
        <p className="mt-2 text-sm text-gray-500">
          Maximum {maxSelections} preferences selected
        </p>
      )}
    </div>
  );
};

export default PreferenceSelector;