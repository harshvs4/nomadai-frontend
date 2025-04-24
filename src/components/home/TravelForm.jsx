import React, { useState, useEffect } from 'react';
import { useTravelContext } from '../../context/TravelContext';
import PreferenceSelector from './PreferenceSelector';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const TravelForm = ({ onSubmit }) => {
  const { travelRequest, updateTravelRequest, loading } = useTravelContext();
  
  const [formState, setFormState] = useState({
    origin: travelRequest.origin || '',
    destination: travelRequest.destination || '',
    depart_date: travelRequest.depart_date ? new Date(travelRequest.depart_date) : null,
    return_date: travelRequest.return_date ? new Date(travelRequest.return_date) : null,
    budget: travelRequest.budget || 2000,
    preferences: travelRequest.preferences || [],
    adults: travelRequest.adults || 1
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Available travel preferences
  const availablePreferences = [
    { id: 'CULTURE', label: 'Culture' },
    { id: 'RELAXATION', label: 'Relaxation' },
    { id: 'ADVENTURE', label: 'Adventure' },
    { id: 'FOOD', label: 'Food & Dining' },
    { id: 'NATURE', label: 'Nature' },
    { id: 'NIGHTLIFE', label: 'Nightlife' },
    { id: 'LUXURY', label: 'Luxury' },
    { id: 'BUDGET', label: 'Budget-friendly' },
    { id: 'FAMILY', label: 'Family' },
    { id: 'SHOPPING', label: 'Shopping' },
    { id: 'BEACH', label: 'Beach' },
    { id: 'MOUNTAIN', label: 'Mountain' }
  ];
  
  // Update context when form state changes
  useEffect(() => {
    updateTravelRequest(formState);
  }, [formState]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormState(prev => ({ ...prev, [name]: date }));
  };
  
  // Handle preference changes
  const handlePreferenceChange = (selectedPreferences) => {
    setFormState(prev => ({ ...prev, preferences: selectedPreferences }));
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formState.origin) errors.origin = 'Origin is required';
    if (!formState.destination) errors.destination = 'Destination is required';
    if (!formState.depart_date) errors.depart_date = 'Departure date is required';
    if (!formState.return_date) errors.return_date = 'Return date is required';
    if (formState.budget <= 0) errors.budget = 'Budget must be greater than 0';
    
    // Check if return date is after departure date
    if (formState.depart_date && formState.return_date && 
        formState.depart_date >= formState.return_date) {
      errors.return_date = 'Return date must be after departure date';
    }
    
    // Check if departure date is in the future
    if (formState.depart_date && formState.depart_date < new Date()) {
      errors.depart_date = 'Departure date must be in the future';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format dates for API
      const formattedData = {
        ...formState,
        depart_date: formState.depart_date.toISOString().split('T')[0],
        return_date: formState.return_date.toISOString().split('T')[0]
      };
      
      onSubmit(formattedData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
          <input
            id="origin"
            name="origin"
            type="text"
            value={formState.origin}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md ${formErrors.origin ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="e.g., Singapore"
          />
          {formErrors.origin && <p className="mt-1 text-sm text-red-500">{formErrors.origin}</p>}
        </div>
        
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <input
            id="destination"
            name="destination"
            type="text"
            value={formState.destination}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md ${formErrors.destination ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="e.g., Tokyo"
          />
          {formErrors.destination && <p className="mt-1 text-sm text-red-500">{formErrors.destination}</p>}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="depart_date" className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
          <DatePicker
            id="depart_date"
            selected={formState.depart_date}
            onChange={(date) => handleDateChange('depart_date', date)}
            className={`w-full p-3 border rounded-md ${formErrors.depart_date ? 'border-red-500' : 'border-gray-300'}`}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            placeholderText="Select departure date"
          />
          {formErrors.depart_date && <p className="mt-1 text-sm text-red-500">{formErrors.depart_date}</p>}
        </div>
        
        <div>
          <label htmlFor="return_date" className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
          <DatePicker
            id="return_date"
            selected={formState.return_date}
            onChange={(date) => handleDateChange('return_date', date)}
            className={`w-full p-3 border rounded-md ${formErrors.return_date ? 'border-red-500' : 'border-gray-300'}`}
            dateFormat="yyyy-MM-dd"
            minDate={formState.depart_date || new Date()}
            placeholderText="Select return date"
          />
          {formErrors.return_date && <p className="mt-1 text-sm text-red-500">{formErrors.return_date}</p>}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget (SGD)
          </label>
          <input
            id="budget"
            name="budget"
            type="number"
            min="0"
            step="100"
            value={formState.budget}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md ${formErrors.budget ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formErrors.budget && <p className="mt-1 text-sm text-red-500">{formErrors.budget}</p>}
        </div>
        
        <div>
          <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Travelers
          </label>
          <select
            id="adults"
            name="adults"
            value={formState.adults}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Adult' : 'Adults'}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Travel Preferences (Select up to 3)
        </label>
        <PreferenceSelector
          availablePreferences={availablePreferences}
          selectedPreferences={formState.preferences}
          onChange={handlePreferenceChange}
          maxSelections={3}
        />
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
        >
          {loading ? 'Planning Your Trip...' : 'Generate Itinerary'}
        </button>
      </div>
    </form>
  );
};

export default TravelForm;