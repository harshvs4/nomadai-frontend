import apiService from './api';

/**
 * Google Places service for points of interest
 */
const googlePlacesService = {
  /**
   * Get points of interest based on destination and preferences
   * @param {string} destination - Destination city
   * @param {Array<string>} preferences - List of travel preferences
   * @returns {Promise<Array>} - Points of interest
   */
  async getPointsOfInterest(destination, preferences = []) {
    try {
      const response = await apiService.getPointsOfInterest(destination, preferences);
      return response;
    } catch (error) {
      console.error('Error fetching points of interest:', error);
      throw error;
    }
  },
  
  /**
   * Get details for a specific point of interest
   * @param {string} placeId - Place ID
   * @returns {Promise<Object>} - Place details
   */
  async getPlaceDetails(placeId) {
    try {
      const response = await apiService.get(`/points-of-interest/${placeId}`);
      return response;
    } catch (error) {
      console.error('Error fetching place details:', error);
      throw error;
    }
  },
  
  /**
   * Search for places by keyword
   * @param {string} keyword - Search keyword
   * @param {string} destination - Destination city to search within
   * @returns {Promise<Array>} - Search results
   */
  async searchPlaces(keyword, destination) {
    try {
      const response = await apiService.get(
        `/points-of-interest/search?keyword=${encodeURIComponent(keyword)}&destination=${encodeURIComponent(destination)}`
      );
      return response;
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  }
};

export default googlePlacesService;