import apiService from './api';

/**
 * Amadeus service for flight and hotel data
 */
const amadeusService = {
  /**
   * Get flight options based on search criteria
   * @param {string} origin - Origin city
   * @param {string} destination - Destination city
   * @param {string|Date} departDate - Departure date in YYYY-MM-DD format or Date object
   * @param {string|Date} returnDate - Return date in YYYY-MM-DD format or Date object
   * @param {number} adults - Number of adult travelers
   * @returns {Promise<Array>} - Flight options
   */
  async getFlights(origin, destination, departDate, returnDate, adults = 1) {
    try {
      const response = await apiService.getFlights(
        origin, 
        destination, 
        departDate, 
        returnDate, 
        adults
      );
      return response;
    } catch (error) {
      console.error('Error fetching flights:', error);
      throw error;
    }
  },
  
  /**
   * Get hotel options based on search criteria
   * @param {string} destination - Destination city
   * @param {string|Date} checkInDate - Check-in date in YYYY-MM-DD format or Date object
   * @param {string|Date} checkOutDate - Check-out date in YYYY-MM-DD format or Date object
   * @param {number} adults - Number of adult travelers
   * @param {number} rooms - Number of rooms
   * @returns {Promise<Array>} - Hotel options
   */
  async getHotels(destination, checkInDate, checkOutDate, adults = 1, rooms = 1) {
    try {
      const response = await apiService.getHotels(
        destination, 
        checkInDate, 
        checkOutDate, 
        adults, 
        rooms
      );
      return response;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  },
  
  /**
   * Get hotel details
   * @param {string} hotelId - Hotel ID
   * @returns {Promise<Object>} - Hotel details
   */
  async getHotelDetails(hotelId) {
    try {
      const response = await apiService.get(`/hotels/${hotelId}`);
      return response;
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      throw error;
    }
  }
};

export default amadeusService;