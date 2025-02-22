import React from 'react';
import PropTypes from 'prop-types';
import { Card } from "@/components/ui/card";

const ComplianceScore = ({ score, requirements }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Compliance Score</h3>
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
          </div>
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#eee"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#dc2626"}
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
            />
          </svg>
        </div>
      </div>
      {requirements && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Key Requirements:</h4>
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  req.met ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm">{req.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
ComplianceScore.propTypes = {
  score: PropTypes.number.isRequired,
  requirements: PropTypes.arrayOf(
    PropTypes.shape({
      met: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired
    })
  )
};

export default ComplianceScore;