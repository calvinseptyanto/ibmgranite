import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { ConTrackAPI } from '@/services/api/ConTrackAPI';

const ComplianceScore = ({ initialData }) => {
  const [loading, setLoading] = useState(!initialData);
  const [data, setData] = useState(initialData || {
    score: 0,
    obligations: []
  });

  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      const response = await ConTrackAPI.getComplianceData();
      setData(response);
    } catch (error) {
      console.error('Failed to fetch compliance data:', error);
      // If fetch fails and we have initial data, revert to it
      if (initialData) {
        setData(initialData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchComplianceData();
    }
  }, [initialData]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreRing = (score) => {
    if (score >= 80) return 'border-green-500';
    if (score >= 60) return 'border-yellow-500';
    return 'border-red-500';
  };

  // Transform requirements into obligations format if needed
  const displayObligations = data.obligations || (data.requirements ? [{
    party: 'Requirements',
    obligations: data.requirements.map(req => `${req.name}: ${req.met ? 'Met' : 'Not Met'}`)
  }] : []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Compliance Score</h2>
        <button 
          onClick={fetchComplianceData} 
          className={`p-2 rounded-full hover:bg-gray-100 ${loading ? 'animate-spin' : ''}`}
          disabled={loading}
        >
          <RefreshCw className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      ) : (
        <>
          {/* Score Display */}
          <div className="flex justify-between items-center mb-8">
            <div className={`
              w-24 h-24 rounded-full border-8 ${getScoreRing(data.score)}
              flex items-center justify-center
              transition-all duration-500
            `}>
              <span className={`text-3xl font-bold ${getScoreColor(data.score)}`}>
                {data.score}%
              </span>
            </div>
            <div className="pl-6 border-l">
              <p className="text-sm text-gray-500 mb-1">Overall Status</p>
              <p className={`text-lg font-semibold ${getScoreColor(data.score)}`}>
                {data.score >= 80 ? 'Excellent' : data.score >= 60 ? 'Good' : 'Needs Attention'}
              </p>
            </div>
          </div>

          {/* Obligations List */}
          <div className="space-y-4">
            {displayObligations.map((obligation, index) => (
              <div 
                key={index} 
                className="p-3 rounded-lg bg-gray-50"
              >
                <h3 className="font-medium text-gray-700 mb-2">{obligation.party}</h3>
                <ul className="space-y-2">
                  {obligation.obligations.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ComplianceScore;