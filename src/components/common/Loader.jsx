import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200"></div>
        <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-blue-500 border-t-transparent"></div>
      </div>
    </div>
  );
};

export default Loader;