import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ConTrackAPI } from '@/services/api/ConTrackAPI';
import ObligationChart from './ui/obligation-chart';

const dummyObligations = [
  {
    "obligations": ["Submit quarterly financial reports to BuyCo Limited"],
    "party": "Tally Inc."
  },
  {
    "obligations": ["Maintain accurate and up-to-date transaction records"],
    "party": "Tally Inc."
  },
  {
    "obligations": ["Ensure compliance with international financial reporting standards (IFRS)"],
    "party": "Tally Inc."
  },
  {
    "obligations": ["Notify BuyCo Limited of any material changes in financial standing"],
    "party": "Tally Inc."
  },
  {
    "obligations": ["Provide semi-annual market analysis and industry insights"],
    "party": "BuyCo Limited"
  },
  {
    "obligations": ["Ensure data privacy and security compliance under GDPR"],
    "party": "Tally Inc."
  },
  {
    "obligations": ["Notify Tally Inc. of any regulatory changes affecting the agreement"],
    "party": "BuyCo Limited"
  },
  {
    "obligations": ["Maintain a transparent dispute resolution process"],
    "party": "BuyCo Limited"
  },
  {
    "obligations": ["Maintain strict confidentiality regarding proprietary information"],
    "party": "Both"
  },
  {
    "obligations": ["Comply with all applicable local and international laws"],
    "party": "Both"
  },
  {
    "obligations": ["Conduct an annual compliance review and report findings"],
    "party": "Both"
  },
  {
    "obligations": ["Ensure that any amendments to the agreement are mutually agreed upon and documented"],
    "party": "Both"
  }
];


const ComplianceObligations = () => {
  const [loading, setLoading] = useState(true);
  const [obligations, setObligations] = useState([]);

  const fetchObligations = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      setTimeout(() => {
        setObligations(dummyObligations);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error fetching obligations:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObligations();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow min-h-[360px] max-h-[360px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Compliance Obligations</h2>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex-1 flex flex-col justify-center items-center space-y-4 p-4">
          <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
          <div className="w-full space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      ) : (
        // Chart Section
        <div className="flex-1 min-h-0">
          <div className="w-full h-full relative">
            <ObligationChart obligations={obligations} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceObligations;
