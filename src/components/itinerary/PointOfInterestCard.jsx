import React, { useState, useRef, useEffect } from 'react';
import apiService from '../../services/api'; // Adjust the path as needed

const PointOfInterestCard = ({ pointOfInterest }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  // Generate placeholder image if no image URL is provided
  const imageUrl = pointOfInterest.image_url ||
    `/api/placeholder/400/300?text=${encodeURIComponent(pointOfInterest.name)}`;

  // Clean up audio element when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

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
            className={`h-4 w-4 ${
              i < fullStars
                ? 'text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-gray-600 text-sm">
          {rating ? rating.toFixed(1) : '-'}
        </span>
      </div>
    );
  };

  // Format category for display
  const formatCategory = (category) => {
    if (!category) return '';
    return category
      .toLowerCase()
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  // Handle audio playback
  const handlePlayAudio = async () => {
    setError(null);

    // If already playing, stop it
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    setAudioLoading(true);

    // Capture current or new URL in a temp var
    let src = audioUrl;
    if (!src) {
      try {
        const { audioUrl: returned } = await apiService.post('/audio-guide', {
          poiName: pointOfInterest.name,
          poiCategory: pointOfInterest.category || '',
          poiDescription: pointOfInterest.description || '',
        });
        if (!returned) throw new Error('No audio URL from server');
        src = `http://localhost:8000${returned}`;
        setAudioUrl(src);
      } catch (err) {
        console.error('Failed to get audio:', err);
        setError(`Could not generate audio: ${err.message}`);
        setAudioLoading(false);
        return;
      }
    }

    // Create a fresh Audio instance and wire up events
    const player = new Audio(src);
    player.onended = () => setIsPlaying(false);
    player.onerror = (e) => {
      console.error('Audio playback error:', e);
      setError(`Audio playback error: ${e.target.error?.message || 'Unknown'}`);
      setIsPlaying(false);
    };

    audioRef.current = player;

    // Try to play
    try {
      const playPromise = player.play();
      if (playPromise) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((playErr) => {
            console.error('Play() rejected:', playErr);
            setError(`Could not play audio: ${playErr.message}`);
          });
      }
    } catch (playException) {
      console.error('Exception during play():', playException);
      setError(`Playback exception: ${playException.message}`);
    } finally {
      setAudioLoading(false);
    }
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
            e.target.src = `/api/placeholder/400/300?text=${encodeURIComponent(
              'No Image'
            )}`;
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
        <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">
          {pointOfInterest.name}
        </h3>

        <div className="flex items-center justify-between mb-2">
          <div>{renderRating(pointOfInterest.rating)}</div>
          {pointOfInterest.price_level != null && (
            <div className="text-sm text-gray-600">
              {formatPriceLevel(pointOfInterest.price_level)}
            </div>
          )}
        </div>

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

        {pointOfInterest.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {pointOfInterest.description}
          </p>
        )}

        {error && (
          <div className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handlePlayAudio}
          disabled={audioLoading}
          className={`mt-2 flex items-center justify-center w-full py-2 px-4 rounded-md text-sm transition-colors ${
            isPlaying
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } ${audioLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {audioLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating Audio...
            </span>
          ) : isPlaying ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              Stop Audio Guide
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m5.657-5.657a1 1 0 010 1.414m-2.829 2.829a1 1 0 001.414 0m5.656-5.657a1 1 0 010 1.414m0 0l-2.829 2.829m-2.828-2.829a1 1 0 010-1.414m0 0L8.464 8.464"
                />
              </svg>
              Play Audio Guide
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PointOfInterestCard;
