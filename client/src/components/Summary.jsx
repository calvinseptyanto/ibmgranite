// import React, { useState, useEffect } from 'react';
// import { RefreshCw } from 'lucide-react';
// import { ConTrackAPI } from '@/services/api/ConTrackAPI';

// const Summary = () => {
//   const [loading, setLoading] = useState(true);
//   const [summary, setSummary] = useState("");

//   const fetchSummary = async () => {
//     setLoading(true);
//     try {
//       const response = await ConTrackAPI.getSummary();
//       setSummary(response.summary);
//     } catch (error) {
//       console.error('Failed to fetch summary:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSummary();
//   }, []);

//   return (
//     <div className="bg-white rounded-lg shadow min-h-[470px] max-h-[470px] flex flex-col">
//       {/* Header */}
//       <div className="flex justify-between items-center p-4 border-b shrink-0">
//         <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
//       </div>

//       {/* Content */}
//       <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
//         {loading ? (
//           <div className="flex items-center justify-center h-full">
//             <span className="text-gray-400">Loading summary...</span>
//           </div>
//         ) : (
//           <div className="prose prose-sm max-w-none">
//             <p className="text-gray-600 whitespace-pre-wrap">
//               {summary}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Summary;

import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

const Summary = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");

  const fakeSummary = `Tally Inc. and BuyCo Limited signed a Memorandum of Understanding (MOU) on March 31, 2017, to govern product distribution within ARC, previously served by ABC, XYZ, and DMXZ. The MOU allows Tally to sell directly or through channel partners to BuyCo ARC customers, subject to service fees. Tally must pay BuyCo a percentage-based service fee, including 4.3% for SCO products and variable rates for combined products based on Tally Content. If the Distribution Agreement remains after October 1, 2017, the service fee reduces to 1.0% until December 31, 2017, or until BuyCo’s Aggregate Ownership Interest falls below 12.5%. Payments follow specific deadlines, with monthly payments required after March 31, 2017, and BuyCo may audit Tally’s records for verification. Disputes must be resolved within ten working days, and payments made within fifteen working days of invoice receipt. The MOU remains valid until the Distribution Agreement is terminated or amended, but Tally's obligation to pay service fees continues beyond termination.`;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSummary(fakeSummary);
      setLoading(false);
    }, 10000);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow min-h-[445px] max-h-[445px] flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b shrink-0">
        <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <Bot className="w-8 h-8 text-blue-500 animate-bounce" />
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-100 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
            <div className="text-gray-500 text-sm animate-pulse">
              Analyzing document...
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none animate-fade-in">
            <p className="text-gray-600">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;

//test