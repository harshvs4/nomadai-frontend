import apiService from './api';

/**
 * LLM service for generating itineraries and handling chat
 */
const llmService = {
  /**
   * Generate an itinerary based on travel request
   * @param {Object} travelRequest - Travel request data
   * @returns {Promise<Object>} - Generated itinerary
   */
  async generateItinerary(travelRequest) {
    try {
      const response = await apiService.generateItinerary(travelRequest);
      return response;
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw error;
    }
  },
  
  /**
   * Get an existing itinerary by ID
   * @param {string} itineraryId - Itinerary ID
   * @returns {Promise<Object>} - Itinerary data
   */
  async getItinerary(itineraryId) {
    try {
      const response = await apiService.getItinerary(itineraryId);
      return response;
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      throw error;
    }
  },
  
  /**
   * Send a message to the chat interface
   * @param {string} requestId - Itinerary request ID
   * @param {string} message - User message
   * @returns {Promise<Object>} - Chat response
   */
  async sendChatMessage(requestId, message) {
    try {
      const response = await apiService.sendChatMessage(requestId, message);
      return response;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing itinerary with new preferences or selections
   * @param {string} requestId - Itinerary request ID
   * @param {Object} updates - Updates to apply to the itinerary
   * @returns {Promise<Object>} - Updated itinerary
   */
  async updateItinerary(requestId, updates) {
    try {
      const response = await apiService.updateItinerary(requestId, updates);
      return response;
    } catch (error) {
      console.error('Error updating itinerary:', error);
      throw error;
    }
  },
  
  /**
   * Get suggested activities based on destination and preferences
   * @param {string} destination - Destination city
   * @param {Array<string>} preferences - List of travel preferences
   * @returns {Promise<Array>} - Suggested activities
   */
  async getSuggestedActivities(destination, preferences = []) {
    try {
      const response = await apiService.get(
        `/suggestions?destination=${encodeURIComponent(destination)}&preferences=${preferences.join(',')}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching suggested activities:', error);
      throw error;
    }
  }
};

export default llmService;