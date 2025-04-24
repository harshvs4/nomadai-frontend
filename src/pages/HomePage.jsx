import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravelContext } from '../context/TravelContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import DatePicker from '../components/common/DatePicker';
import llmService from '../services/llm';
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { 
    travelRequest, 
    updateTravelRequest,
    setItinerary, 
    setLoading, 
    setError,
    loading
  } = useTravelContext();
  
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
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateTravelRequest({ [name]: value });
  };
  
  // Handle date changes
  const handleDateChange = (name, date) => {
    updateTravelRequest({ [name]: date });
  };
  
  // Handle preference changes
  const handlePreferenceChange = (preference) => {
    const updatedPreferences = [...travelRequest.preferences];
    const index = updatedPreferences.indexOf(preference);
    
    if (index !== -1) {
      updatedPreferences.splice(index, 1);
    } else if (updatedPreferences.length < 3) {
      updatedPreferences.push(preference);
    }
    
    updateTravelRequest({ preferences: updatedPreferences });
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!travelRequest.origin) errors.origin = 'Origin is required';
    if (!travelRequest.destination) errors.destination = 'Destination is required';
    if (!travelRequest.depart_date) errors.depart_date = 'Departure date is required';
    if (!travelRequest.return_date) errors.return_date = 'Return date is required';
    if (!travelRequest.budget || travelRequest.budget <= 0) errors.budget = 'Budget must be greater than 0';
    
    // Check if return date is after departure date
    if (travelRequest.depart_date && travelRequest.return_date && 
        travelRequest.depart_date >= travelRequest.return_date) {
      errors.return_date = 'Return date must be after departure date';
    }
    
    // Check if departure date is in the future
    if (travelRequest.depart_date && travelRequest.depart_date < new Date()) {
      errors.depart_date = 'Departure date must be in the future';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Format the travel request data for the API
      const formattedRequest = {
        ...travelRequest,
        depart_date: travelRequest.depart_date.toISOString().split('T')[0],
        return_date: travelRequest.return_date.toISOString().split('T')[0],
        budget: parseFloat(travelRequest.budget),
        adults: parseInt(travelRequest.adults, 10)
      };
      
      // Call the actual API to generate the itinerary
      const generatedItinerary = await llmService.generateItinerary(formattedRequest);
      
      // Update context with generated itinerary
      setItinerary(generatedItinerary);
      
      // Navigate to itinerary page
      navigate('/itinerary');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setError(error.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">NomadAI</h1>
        <p className="text-xl text-gray-600">Your Intelligent Travel Companion</p>
      </header>
      
      <div className="max-w-3xl mx-auto">
        <Card title="Plan Your Perfect Trip">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                id="origin"
                name="origin"
                label="Origin"
                value={travelRequest.origin}
                onChange={handleChange}
                placeholder="e.g., Singapore"
                error={formErrors.origin}
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
                required
              />
              
              <Input
                id="destination"
                name="destination"
                label="Destination"
                value={travelRequest.destination}
                onChange={handleChange}
                placeholder="e.g., Tokyo"
                error={formErrors.destination}
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
                required
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <DatePicker
                id="depart_date"
                name="depart_date"
                label="Departure Date"
                selected={travelRequest.depart_date}
                onChange={(date) => handleDateChange('depart_date', date)}
                error={formErrors.depart_date}
                minDate={new Date()}
                placeholderText="Select departure date"
                icon={<Calendar className="h-5 w-5 text-gray-400" />}
                required
              />
              
              <DatePicker
                id="return_date"
                name="return_date"
                label="Return Date"
                selected={travelRequest.return_date}
                onChange={(date) => handleDateChange('return_date', date)}
                error={formErrors.return_date}
                minDate={travelRequest.depart_date || new Date()}
                placeholderText="Select return date"
                icon={<Calendar className="h-5 w-5 text-gray-400" />}
                required
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                id="budget"
                name="budget"
                type="number"
                label="Budget (SGD)"
                value={travelRequest.budget || ''}
                onChange={handleChange}
                error={formErrors.budget}
                icon={<DollarSign className="h-5 w-5 text-gray-400" />}
                required
              />
              
              <div>
                <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Travelers
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="adults"
                    name="adults"
                    value={travelRequest.adults}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Adult' : 'Adults'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Preferences (Select up to 3)
              </label>
              <div className="flex flex-wrap gap-2">
                {availablePreferences.map((preference) => (
                  <button
                    key={preference.id}
                    type="button"
                    onClick={() => handlePreferenceChange(preference.id)}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${
                      travelRequest.preferences.includes(preference.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={
                      !travelRequest.preferences.includes(preference.id) &&
                      travelRequest.preferences.length >= 3
                    }
                  >
                    {preference.label}
                  </button>
                ))}
              </div>
              
              {travelRequest.preferences.length >= 3 && (
                <p className="mt-2 text-sm text-gray-500">
                  Maximum 3 preferences selected
                </p>
              )}
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                isLoading={loading}
                className="w-full"
              >
                Generate Itinerary
              </Button>
            </div>
          </form>
        </Card>
        
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Use NomadAI?</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <h4 className="font-bold text-blue-700 mb-2">Personalized Itineraries</h4>
              <p className="text-gray-600">Get travel plans tailored to your unique preferences and budget.</p>
            </Card>
            
            <Card>
              <h4 className="font-bold text-blue-700 mb-2">Real-Time Data</h4>
              <p className="text-gray-600">Access up-to-date information on flights, hotels, and attractions.</p>
            </Card>
            
            <Card>
              <h4 className="font-bold text-blue-700 mb-2">Interactive Assistant</h4>
              <p className="text-gray-600">Refine your itinerary through natural conversation with our AI.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;