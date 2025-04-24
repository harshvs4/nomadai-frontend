// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper function for error handling
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: `HTTP error ${response.status}`
    }));
    throw new Error(error.detail || 'Unknown error occurred');
  }
  return response.json();
};

// API service singleton
const apiService = {
  // Generate travel itinerary
  async generateItinerary(travelRequest) {
    const response = await fetch(`${API_BASE_URL}/itinerary/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(travelRequest),
    });
    
    return handleResponse(response);
  },
  
  // Get itinerary by ID
  async getItinerary(id) {
    const response = await fetch(`${API_BASE_URL}/itinerary/${id}`);
    return handleResponse(response);
  },
  
  // Get flight options
  async getFlights(origin, destination, departDate, returnDate, adults = 1) {
    // Format dates if they are Date objects
    const formatDate = (date) => {
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }
      return date;
    };

    const formattedDepartDate = formatDate(departDate);
    const formattedReturnDate = formatDate(returnDate);
    
    const response = await fetch(
      `${API_BASE_URL}/flights?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&depart_date=${formattedDepartDate}&return_date=${formattedReturnDate}&adults=${adults}`
    );
    
    return handleResponse(response);
  },
  
  // Get hotel options
  async getHotels(destination, checkInDate, checkOutDate, adults = 1, rooms = 1) {
    // Format dates if they are Date objects
    const formatDate = (date) => {
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }
      return date;
    };

    const formattedCheckInDate = formatDate(checkInDate);
    const formattedCheckOutDate = formatDate(checkOutDate);
    
    const response = await fetch(
      `${API_BASE_URL}/hotels?destination=${encodeURIComponent(destination)}&checkin=${formattedCheckInDate}&checkout=${formattedCheckOutDate}&adults=${adults}&rooms=${rooms}`
    );
    
    return handleResponse(response);
  },
  
  // Get points of interest
  async getPointsOfInterest(destination, preferences = []) {
    const prefsQuery = preferences.length > 0 ? `&preferences=${preferences.join(',')}` : '';
    const response = await fetch(
      `${API_BASE_URL}/points-of-interest?destination=${encodeURIComponent(destination)}${prefsQuery}`
    );
    
    return handleResponse(response);
  },
  
  // Get hotel details
  async getHotelDetails(hotelId) {
    const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}`);
    return handleResponse(response);
  },
  
  // Get place details
  async getPlaceDetails(placeId) {
    const response = await fetch(`${API_BASE_URL}/points-of-interest/${placeId}`);
    return handleResponse(response);
  },
  
  // Search places
  async searchPlaces(keyword, destination) {
    const response = await fetch(
      `${API_BASE_URL}/points-of-interest/search?keyword=${encodeURIComponent(keyword)}&destination=${encodeURIComponent(destination)}`
    );
    return handleResponse(response);
  },
  
  // Get suggested activities
  async getSuggestedActivities(destination, preferences = []) {
    const prefsQuery = preferences.length > 0 ? `&preferences=${preferences.join(',')}` : '';
    const response = await fetch(
      `${API_BASE_URL}/suggestions?destination=${encodeURIComponent(destination)}${prefsQuery}`
    );
    
    return handleResponse(response);
  },
  
  // Send message to chat
  async sendChatMessage(requestId, message) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request_id: requestId,
        message
      }),
    });
    
    return handleResponse(response);
  },
  
  // Update itinerary
  async updateItinerary(requestId, updates) {
    const response = await fetch(`${API_BASE_URL}/itinerary/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    return handleResponse(response);
  },
  
  // Generic GET request
  async get(endpoint) {
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(fullUrl);
    return handleResponse(response);
  },
  
  // Generic POST request
  async post(endpoint, data) {
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
  
  // Generic PUT request
  async put(endpoint, data) {
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
  
  // Generic PATCH request
  async patch(endpoint, data) {
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(fullUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
  
  // Generic DELETE request
  async delete(endpoint) {
    const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(fullUrl, {
      method: 'DELETE',
    });
    
    return handleResponse(response);
  }
};

export default apiService;