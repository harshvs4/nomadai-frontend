import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Page Not Found</h1>
      <p className="text-gray-600 max-w-md text-center mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;