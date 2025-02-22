import React, { useState } from 'react';
import { RefreshCcw } from 'lucide-react';

const Summary = ({ summary = "Loading summary..." }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Add your API call here
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow h-[300px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b shrink-0">
        <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
        <button 
          onClick={handleRefresh}
          className={`p-2 rounded-full hover:bg-gray-100 transition-all ${isLoading ? 'animate-spin' : ''}`}
        >
          <RefreshCcw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600 whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;