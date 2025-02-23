import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ConTrackAPI } from '@/services/api/ConTrackAPI';

const Summary = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await ConTrackAPI.getSummary();
      setSummary(response.summary);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow min-h-[470px] max-h-[470px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b shrink-0">
        <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-400">Loading summary...</span>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 whitespace-pre-wrap">
              {summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;