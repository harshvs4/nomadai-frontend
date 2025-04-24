import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

const HotelCard = ({ 
  hotel, 
  availableHotels, 
  onHotelChange, 
  isUpdating,
  onLoadMore
}) => {
  const [showOptions, setShowOptions] = useState(false);
  
  // Generate hotel stars display
  const renderStars = (stars) => {
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${i < fullStars ? 'text-yellow-400' : i === fullStars && hasHalfStar ? 'text-yellow-400' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {i === fullStars && hasHalfStar ? (
              // Half star
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            ) : (
              // Full or empty star
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            )}
          </svg>
        ))}
        <span className="ml-1 text-gray-600 text-sm">{stars.toFixed(1)}</span>
      </div>
    );
  };
  
  const handleSelectHotel = (selectedHotel) => {
    onHotelChange(selectedHotel);
    setShowOptions(false);
  };
  
  // Generate amenities list
  const renderAmenities = () => {
    if (!hotel.amenities || hotel.amenities.length === 0) {
      return null;
    }
    
    return (
      <div className="mt-3">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Amenities</h4>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.slice(0, 4).map((amenity, index) => (
            <span key={index} className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 4 && (
            <span className="inline-block bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded">
              +{hotel.amenities.length - 4} more
            </span>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Hotel Card Header */}
      <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex justify-between items-center">
        <div className="font-medium text-blue-800">{hotel.name}</div>
        <div className="text-green-700 font-semibold">
          {formatCurrency(hotel.price_per_night)}<span className="text-sm font-normal text-gray-600">/night</span>
        </div>
      </div>
      
      {/* Hotel Details */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            {/* Stars */}
            {renderStars(hotel.stars)}
            
            {/* Location */}
            <div className="mt-2 flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 mr-1 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-gray-600">{hotel.address ? hotel.address : hotel.city}</span>
            </div>
          </div>
          
          {/* Hotel Image */}
          <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
            <img
              src={hotel.image_url || `/api/placeholder/240/160?text=${encodeURIComponent(hotel.name)}`}
              alt={hotel.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `/api/placeholder/240/160?text=${encodeURIComponent(hotel.name)}`;
              }}
            />
          </div>
        </div>
        
        {/* Amenities */}
        {renderAmenities()}
      </div>
      
      {/* Hotel Options */}
      {availableHotels && availableHotels.length > 1 && (
        <div className="border-t border-gray-200 px-4 py-3">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-blue-600 text-sm font-medium flex items-center"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Change Hotel'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 transition-transform ${showOptions ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showOptions && (
            <div className="mt-3 space-y-2">
              {availableHotels.map((option, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border cursor-pointer transition-colors ${
                    option.name === hotel.name && option.price_per_night === hotel.price_per_night
                      ? 'bg-blue-50 border-blue-200'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectHotel(option)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{option.name}</div>
                      {renderStars(option.stars)}
                    </div>
                    <div className={`font-semibold ${option.price_per_night < hotel.price_per_night ? 'text-green-600' : 'text-gray-700'}`}>
                      {formatCurrency(option.price_per_night)}<span className="text-xs font-normal text-gray-600">/night</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {onLoadMore && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={onLoadMore}
                  disabled={isUpdating}
                  size="sm"
                >
                  Load More Options
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelCard;