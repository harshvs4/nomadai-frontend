import React from 'react';

const PointOfInterestCard = ({ pointOfInterest }) => {
  // Generate placeholder image if no image URL is provided
  const imageUrl = pointOfInterest.image_url || `/api/placeholder/400/300?text=${encodeURIComponent(pointOfInterest.name)}`;
  
  // Format price level
  const formatPriceLevel = (level) => {
    if (level === undefined || level === null) return '';
    
    const priceLabels = ['Free', 'Inexpensive', 'Moderate', 'Expensive', 'Very Expensive'];
    return priceLabels[level] || '';
  };
  
  // Generate star rating display
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
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
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        ))}
        <span className="ml-1 text-gray-600 text-sm">{rating ? rating.toFixed(1) : '-'}</span>
      </div>
    );
  };
  
  // Format category for display
  const formatCategory = (category) => {
    if (!category) return '';
    
    // Convert from enum format (e.g., FOOD) to title case (e.g., Food)
    return category
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={pointOfInterest.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `/api/placeholder/400/300?text=${encodeURIComponent('No Image')}`;
          }}
        />
        {pointOfInterest.category && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {formatCategory(pointOfInterest.category)}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{pointOfInterest.name}</h3>
        
        <div className="flex items-center justify-between mb-2">
          {/* Rating */}
          <div>{renderRating(pointOfInterest.rating)}</div>
          
          {/* Price Level */}
          {pointOfInterest.price_level !== undefined && pointOfInterest.price_level !== null && (
            <div className="text-sm text-gray-600">
              {formatPriceLevel(pointOfInterest.price_level)}
            </div>
          )}
        </div>
        
        {/* Location */}
        <div className="flex items-start text-gray-600 mb-3">
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
          <span className="text-sm truncate">{pointOfInterest.address}</span>
        </div>
        
        {/* Description */}
        {pointOfInterest.description && (
          <p className="text-sm text-gray-600 line-clamp-3">{pointOfInterest.description}</p>
        )}
      </div>
    </div>
  );
};

export default PointOfInterestCard;