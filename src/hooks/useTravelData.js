import { useState, useEffect } from 'react';
import amadeusService from '../services/amadeus';
import googlePlacesService from '../services/googlePlaces';
import llmService from '../services/llm';
import { useTravelContext } from '../context/TravelContext';

/**
 * Custom hook for fetching and managing travel data
 */
const useTravelData = () => {
  const {
    travelRequest,
    setItinerary,
    setLoading,
    setError,
    resetState
  } = useTravelContext();
  
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [isLoadingFlights, setIsLoadingFlights] = useState(false);
  const [isLoadingHotels, setIsLoadingHotels] = useState(false);
  const [isLoadingPOIs, setIsLoadingPOIs] = useState(false);
  
  /**
   * Fetch flights based on the travel request
   */
  const fetchFlights = async () => {
    if (!travelRequest.origin || !travelRequest.destination ||
        !travelRequest.depart_date || !travelRequest.return_date) {
      return;
    }
    
    try {
      setIsLoadingFlights(true);
      const flightsData = await amadeusService.getFlights(
        travelRequest.origin,
        travelRequest.destination,
        travelRequest.depart_date,
        travelRequest.return_date,
        travelRequest.adults
      );
      setFlights(flightsData);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setError('Failed to fetch flight options. Please try again.');
    } finally {
      setIsLoadingFlights(false);
    }
  };
  
  /**
   * Fetch hotels based on the travel request
   */
  const fetchHotels = async () => {
    if (!travelRequest.destination ||
        !travelRequest.depart_date || !travelRequest.return_date) {
      return;
    }
    
    try {
      setIsLoadingHotels(true);
      const hotelsData = await amadeusService.getHotels(
        travelRequest.destination,
        travelRequest.depart_date,
        travelRequest.return_date,
        travelRequest.adults
      );
      setHotels(hotelsData);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('Failed to fetch hotel options. Please try again.');
    } finally {
      setIsLoadingHotels(false);
    }
  };
  
  /**
   * Fetch points of interest based on the travel request
   */
  const fetchPointsOfInterest = async () => {
    if (!travelRequest.destination) {
      return;
    }
    
    try {
      setIsLoadingPOIs(true);
      const poisData = await googlePlacesService.getPointsOfInterest(
        travelRequest.destination,
        travelRequest.preferences
      );
      setPointsOfInterest(poisData);
    } catch (error) {
      console.error('Error fetching points of interest:', error);
      setError('Failed to fetch attractions. Please try again.');
    } finally {
      setIsLoadingPOIs(false);
    }
  };
  
  /**
   * Generate a complete travel itinerary
   */
  const generateItinerary = async () => {
    if (!travelRequest.origin || !travelRequest.destination ||
        !travelRequest.depart_date || !travelRequest.return_date ||
        !travelRequest.budget) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      const generatedItinerary = await llmService.generateItinerary(travelRequest);
      setItinerary(generatedItinerary);
      return generatedItinerary;
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setError('Failed to generate itinerary. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Update an existing itinerary
   * @param {string} requestId - Itinerary request ID
   * @param {Object} updates - Updates to apply
   */
  const updateItinerary = async (requestId, updates) => {
    try {
      setLoading(true);
      const updatedItinerary = await llmService.updateItinerary(requestId, updates);
      setItinerary(updatedItinerary);
      return updatedItinerary;
    } catch (error) {
      console.error('Error updating itinerary:', error);
      setError('Failed to update itinerary. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    flights,
    hotels,
    pointsOfInterest,
    isLoadingFlights,
    isLoadingHotels,
    isLoadingPOIs,
    fetchFlights,
    fetchHotels,
    fetchPointsOfInterest,
    generateItinerary,
    updateItinerary,
    isLoading: isLoadingFlights || isLoadingHotels || isLoadingPOIs
  };
};

export default useTravelData;