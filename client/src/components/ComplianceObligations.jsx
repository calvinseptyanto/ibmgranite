import React, { useState, useEffect } from 'react';
import { RefreshCw, Users, User, AlertCircle } from 'lucide-react';
import { ConTrackAPI } from '@/services/api/ConTrackAPI';

const ComplianceObligations = () => {
  const [loading, setLoading] = useState(true);
  const [obligations, setObligations] = useState([]);
  const [error, setError] = useState(null);

  const fetchObligations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ConTrackAPI.getComplianceData();
      
      if (Array.isArray(response.obligations)) {
        setObligations(response.obligations);
      } else {
        setObligations([]);
        setError('No obligations data available');
      }
    } catch (error) {
      console.error('Failed to fetch obligations:', error);
      setError('Failed to load obligations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObligations();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow h-[300px] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow h-[300px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Compliance Obligations</h2>
        <button 
          onClick={fetchObligations}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            <p>{error}</p>
            <button 
              onClick={fetchObligations}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : obligations.length > 0 ? (
          <div className="space-y-4">
            {obligations.map((obligation, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  {obligation.party.toLowerCase() === 'both' ? (
                    <Users className="w-5 h-5 text-purple-500" />
                  ) : (
                    <User className="w-5 h-5 text-blue-500" />
                  )}
                  <h3 className="font-medium text-gray-700">
                    {obligation.party}
                  </h3>
                </div>
                <ul className="space-y-2 ml-7">
                  {obligation.obligations.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No obligations found
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceObligations;