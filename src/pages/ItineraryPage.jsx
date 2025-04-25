import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTravelContext } from '../context/TravelContext';
import ItinerarySummary from '../components/itinerary/ItinerarySummary';
import ItineraryMarkdown from '../components/itinerary/ItineraryMarkdown';
import TabbedItinerary from '../components/itinerary/TabbedItinerary';
import ChatWindow from '../components/chat/ChatWindow';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import llmService from '../services/llm';
import amadeusService from '../services/amadeus';
import googlePlacesService from '../services/googlePlaces';

const ItineraryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    itinerary, 
    loading, 
    error,
    setError,
    selectedFlight,
    setSelectedFlight,
    selectedHotel,
    setSelectedHotel,
    setItinerary,
    setLoading
  } = useTravelContext();
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch itinerary by ID if provided in URL
  useEffect(() => {
    const fetchItineraryById = async () => {
      if (id && (!itinerary || itinerary.request_id !== id)) {
        try {
          setLoading(true);
          setError(null);
          // Fetch the itinerary from the backend
          const response = await llmService.getItinerary(id);
          console.log('Full Itinerary Response:', response);
          console.log('Raw Text Content:', response.raw_text);
          setItinerary(response);
        } catch (error) {
          console.error('Error fetching itinerary:', error);
          setError('Failed to fetch itinerary. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchItineraryById();
  }, [id, itinerary, setItinerary, setError, setLoading]);
  
  // Redirect to home if no itinerary data is available
  useEffect(() => {
    if (!loading && !itinerary && !error && !id) {
      navigate('/');
    }
  }, [itinerary, loading, error, navigate, id]);
  
  // Set initial selected flight and hotel
  useEffect(() => {
    if (itinerary && !selectedFlight) {
      setSelectedFlight(itinerary.selected_flight);
    }
    
    if (itinerary && !selectedHotel) {
      setSelectedHotel(itinerary.selected_hotel);
    }
  }, [itinerary, selectedFlight, selectedHotel, setSelectedFlight, setSelectedHotel]);
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  // Handle flight selection change
  const handleFlightChange = async (flight) => {
    try {
      setIsUpdating(true);
      
      // Update flight in the backend
      if (itinerary?.request_id) {
        const updatedItinerary = await llmService.updateItinerary(itinerary.request_id, {
          selected_flight: flight
        });
        console.log(updatedItinerary);
        setItinerary(updatedItinerary);
      }
      
      setSelectedFlight(flight);
    } catch (error) {
      console.error('Error updating flight:', error);
      setError('Failed to update flight selection. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle hotel selection change
  const handleHotelChange = async (hotel) => {
    try {
      setIsUpdating(true);
      
      // Update hotel in the backend
      if (itinerary?.request_id) {
        const updatedItinerary = await llmService.updateItinerary(itinerary.request_id, {
          selected_hotel: hotel
        });
        console.log(updatedItinerary);
        setItinerary(updatedItinerary);
      }
      
      setSelectedHotel(hotel);
    } catch (error) {
      console.error('Error updating hotel:', error);
      setError('Failed to update hotel selection. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Fetch additional flights if needed
  const loadMoreFlights = async () => {
    if (!itinerary || !itinerary.travel_request) return;
    
    try {
      setIsUpdating(true);
      
      const { origin, destination, depart_date, return_date, adults } = itinerary.travel_request;
      
      // Fetch additional flight options
      const flights = await amadeusService.getFlights(
        origin, 
        destination, 
        depart_date, 
        return_date, 
        adults || 1
      );
      
      // Update the itinerary with new flight options
      setItinerary({
        ...itinerary,
        available_flights: [...(itinerary.available_flights || []), ...flights]
      });
    } catch (error) {
      console.error('Error loading more flights:', error);
      setError('Failed to load additional flight options. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Fetch additional hotels if needed
  const loadMoreHotels = async () => {
    if (!itinerary || !itinerary.travel_request) return;
    
    try {
      setIsUpdating(true);
      
      const { destination, depart_date, return_date, adults } = itinerary.travel_request;
      
      // Fetch additional hotel options
      const hotels = await amadeusService.getHotels(
        destination, 
        depart_date, 
        return_date, 
        adults || 1
      );
      
      // Update the itinerary with new hotel options
      setItinerary({
        ...itinerary,
        available_hotels: [...(itinerary.available_hotels || []), ...hotels]
      });
    } catch (error) {
      console.error('Error loading more hotels:', error);
      setError('Failed to load additional hotel options. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Fetch additional points of interest
  const loadMorePOIs = async () => {
    if (!itinerary || !itinerary.travel_request) return;
    
    try {
      setIsUpdating(true);
      
      const { destination, preferences } = itinerary.travel_request;
      
      // Fetch additional points of interest
      const pois = await googlePlacesService.getPointsOfInterest(destination, preferences);
      
      // Update the itinerary with new points of interest
      setItinerary({
        ...itinerary,
        points_of_interest: [...(itinerary.points_of_interest || []), ...pois]
      });
    } catch (error) {
      console.error('Error loading more points of interest:', error);
      setError('Failed to load additional attractions. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <Loader />
        <p className="mt-4 text-xl text-gray-600">Planning your dream trip...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 max-w-lg">
          <p className="text-red-700">{error}</p>
        </div>
        <Button
          onClick={() => navigate('/')}
          variant="primary"
        >
          Return to Home
        </Button>
      </div>
    );
  }
  
  if (!itinerary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-xl text-gray-600 mb-4">No itinerary data available</p>
        <Button
          onClick={() => navigate('/')}
          variant="primary"
        >
          Create New Itinerary
        </Button>
      </div>
    );
  }
  
  // Safely access properties with fallbacks
  const dailyPlan = itinerary.daily_plan || [];
  const totalDays = dailyPlan.length;
  const pointsOfInterest = itinerary.points_of_interest || [];
  const availableFlights = itinerary.available_flights || [];
  const availableHotels = itinerary.available_hotels || [];
  
  // Ensure activeDay is valid
  const safeActiveDay = Math.min(Math.max(1, activeDay), Math.max(1, totalDays));
  
  return (
    <div className="min-h-screen bg-gray-50 pt-5 pb-16">
      {/* Header section */}
      <header className="bg-white shadow-sm mb-6 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">NomadAI</h1>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
          >
            Plan New Trip
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto px-4">
        {/* Itinerary Summary */}
        {itinerary.travel_request && (
          <ItinerarySummary 
            destination={itinerary.travel_request.destination}
            duration={itinerary.travel_request.duration}
            startDate={itinerary.travel_request.depart_date}
            endDate={itinerary.travel_request.return_date}
            budget={itinerary.travel_request.budget}
            totalCost={itinerary.total_cost || 0}
            summary={itinerary.summary || `Your trip to ${itinerary.travel_request.destination}`}
          />
        )}

        {/* Raw Text Content (if needed) */}
        {itinerary.raw_text && (
          <ItineraryMarkdown content={itinerary.raw_text} />
        )}

        {/* Tabbed Interface */}
        <TabbedItinerary
          itinerary={itinerary}
          selectedFlight={selectedFlight}
          selectedHotel={selectedHotel}
          availableFlights={availableFlights}
          availableHotels={availableHotels}
          onFlightChange={handleFlightChange}
          onHotelChange={handleHotelChange}
          onLoadMoreFlights={loadMoreFlights}
          onLoadMoreHotels={loadMoreHotels}
          isUpdating={isUpdating}
        />
      </div>
      
      {/* Chat Widget */}
      <div className={`fixed bottom-0 right-0 transition-all duration-300 ease-in-out ${isChatOpen ? 'mb-0' : 'mb-16'}`}>
        <ChatWindow 
          isOpen={isChatOpen} 
          onToggle={toggleChat} 
          itineraryId={itinerary.request_id || 'temp-id'} 
        />
      </div>
      
      {/* Chat Button */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ItineraryPage;