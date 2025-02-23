import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ConTrackAPI } from '@/services/api/ConTrackAPI';
import ObligationChart from './ui/obligation-chart';

const dummyObligations = [
  {
    "obligations": [
      "provide quarterly financial reports",
    ],
    "party": "Company A"
  },
  {
    "obligations": [
      "maintain accurate records",
    ],
    "party": "Company A"
  },
  {
    "obligations": [
      "provide semi-annual market analysis",
    ],
    "party": "Company B"
  },
  {
    "obligations": [
      "ensure data privacy",
    ],
    "party": "Company B"
  },
  {
    "obligations": [
      "comply with applicable laws",
    ],
    "party": "Company B"
  },
  {
    "obligations": [
      "maintain confidentiality"
    ],
    "party": "Both"
  }
];

const ComplianceObligations = () => {
  const [loading, setLoading] = useState(true);
  const [obligations, setObligations] = useState([]);

  const fetchObligations = async () => {
    setLoading(true);
    try {
      const response = await ConTrackAPI.getComplianceData();
      
      if (Array.isArray(response.obligations) && response.obligations.length > 0) {
        setObligations(response.obligations);
      } else {
        setObligations(dummyObligations);
      }
    } catch (error) {
      console.error('Failed to fetch obligations:', error);
      setObligations(dummyObligations);
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
      </div>

      {/* Chart Container with fixed height */}
      <div className="flex-1 min-h-0"> {/* min-h-0 is crucial for flex container */}
        <div className="w-full h-full relative"> {/* relative container for absolute positioning if needed */}
          <ObligationChart obligations={obligations} />
        </div>
      </div>
    </div>
  );
};

export default ComplianceObligations;
