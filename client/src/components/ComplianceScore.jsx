import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const ComplianceScore = ({ score, requirements }) => {
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

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Compliance Score</h2>
      
      {/* Score Display */}
      <div className="flex justify-between items-center mb-8">
        <div className={`
          w-24 h-24 rounded-full border-8 ${getScoreRing(score)}
          flex items-center justify-center
          transition-all duration-500
        `}>
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </span>
        </div>
        <div className="pl-6 border-l">
          <p className="text-sm text-gray-500 mb-1">Overall Status</p>
          <p className={`text-lg font-semibold ${getScoreColor(score)}`}>
            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Attention'}
          </p>
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Key Requirements</h3>
        {requirements.map((req, index) => (
          <div 
            key={index} 
            className={`
              flex items-center justify-between p-3 rounded-lg
              ${req.met ? 'bg-green-50' : 'bg-red-50'}
            `}
          >
            <div className="flex items-center gap-3">
              {req.met ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={`
                font-medium
                ${req.met ? 'text-green-700' : 'text-red-700'}
              `}>
                {req.name}
              </span>
            </div>
            <span className={`
              text-sm px-2 py-1 rounded
              ${req.met 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
              }
            `}>
              {req.met ? 'Compliant' : 'Non-Compliant'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceScore;