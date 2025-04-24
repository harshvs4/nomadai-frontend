import React, { createContext, useState, useContext } from 'react';

const TravelContext = createContext();

export const useTravelContext = () => useContext(TravelContext);

export const TravelProvider = ({ children }) => {
  // Application state
  const [travelRequest, setTravelRequest] = useState({
    origin: '',
    destination: '',
    depart_date: null,
    return_date: null,
    duration: 0,
    budget: 0,
    preferences: [],
    adults: 1
  });
  
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Update travel request
  const updateTravelRequest = (newData) => {
    setTravelRequest(prev => ({ ...prev, ...newData }));
    
    // Calculate duration if both dates are provided
    if (newData.depart_date && newData.return_date) {
      const departDate = new Date(newData.depart_date);
      const returnDate = new Date(newData.return_date);
      const duration = Math.round((returnDate - departDate) / (1000 * 60 * 60 * 24));
      
      if (!isNaN(duration) && duration > 0) {
        setTravelRequest(prev => ({ ...prev, duration }));
      }
    }
  };

  // Add chat message
  const addChatMessage = (message) => {
    if (message) {
      setChatMessages(prev => Array.isArray(prev) ? [...prev, message] : [message]);
    }
  };

  // Reset state
  const resetState = () => {
    setItinerary(null);
    setLoading(false);
    setError(null);
    setChatMessages([]);
    setSelectedFlight(null);
    setSelectedHotel(null);
  };

  return (
    <TravelContext.Provider
      value={{
        travelRequest,
        updateTravelRequest,
        itinerary,
        setItinerary,
        loading,
        setLoading,
        error,
        setError,
        chatMessages,
        addChatMessage,
        setChatMessages,
        resetState,
        selectedFlight,
        setSelectedFlight,
        selectedHotel,
        setSelectedHotel
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export default TravelContext;