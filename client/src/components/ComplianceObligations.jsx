import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ConTrackAPI } from '@/services/api/ConTrackAPI';
import ObligationChart from './ui/obligation-chart';

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

      {/* Chart Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        {error ? (
          <div className="text-red-500 text-center">
            <p>{error}</p>
            <button 
              onClick={fetchObligations}
              className="text-sm text-blue-500 hover:text-blue-600 mt-2"
            >
              Try Again
            </button>
          </div>
        ) : (
          <ObligationChart obligations={obligations} />
        )}
      </div>
    </div>
  );
};

export default ComplianceObligations;