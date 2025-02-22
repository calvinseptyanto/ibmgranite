import React, { useState } from 'react';
import { RefreshCcw } from 'lucide-react';

const Summary = ({ summary = "Loading summary..." }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Add your API call here
    setTimeout(() => setIsLoading(false), 1000); // Temporary timeout for demo
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
        <button 
          onClick={handleRefresh}
          className={`p-2 rounded-full hover:bg-gray-100 transition-all ${isLoading ? 'animate-spin' : ''}`}
        >
          <RefreshCcw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Summary Content */}
      <div className="h-[calc(100%-2rem)] overflow-auto">
        <p className="text-gray-600 whitespace-pre-wrap">
          {summary}
        </p>
      </div>
    </div>
  );
};

export default Summary;