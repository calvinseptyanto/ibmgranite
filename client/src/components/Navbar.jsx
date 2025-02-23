// import React, { useState } from 'react';
// import { Check, Link } from 'lucide-react';

// const Navbar = () => {
//   const [showCopiedMessage, setShowCopiedMessage] = useState(false);

//   const handleShare = async () => {
//     try {
//       // Get the current URL
//       const currentUrl = window.location.href;
//       await navigator.clipboard.writeText(currentUrl);
     
//       // Show copied message
//       setShowCopiedMessage(true);
//       setTimeout(() => setShowCopiedMessage(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };

//   return (
//     <header className="sticky top-0 left-0 right-0 bg-white border-b z-30">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo/Brand */}
//           <div className="flex items-center">
//             <img src="assets/contrack.png" alt="ConTrack" className="h-30" />
//           </div>

//           {/* Share Button */}
//           <div className="relative">
//             <button
//               onClick={handleShare}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               {showCopiedMessage ? (
//                 <>
//                   <Check className="w-4 h-4" />
//                   <span>Copied!</span>
//                 </>
//               ) : (
//                 <>
//                   <Link className="w-6 h-6 text-white-600" />
//                   <span>Share</span>
//                 </>
//               )}
//             </button>

//             {/* Tooltip/Message (appears when copying) */}
//             {showCopiedMessage && (
//               <div className="absolute right-0 mt-2 py-1 px-3 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap">
//                 Link copied to clipboard
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

import React, { useState } from 'react';
import { Check, Link } from 'lucide-react';

const Navbar = () => {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  // Generate a convincing unique dashboard URL
  const generateShareableUrl = () => {
    // Create components for the URL
    const baseUrl = 'https://contrack.ai/dashboard';
    const timestamp = Date.now().toString(36); // Convert timestamp to base36
    const randomStr = Math.random().toString(36).substring(2, 8); // Random string
    const documentId = `doc-${timestamp}-${randomStr}`;

    return `${baseUrl}/${documentId}`;
  };

  const handleShare = async () => {
    try {
      // Get the current URL including query parameters
      const currentUrl = window.location.href;
      
      // Use the Clipboard API with fallback
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        // Fallback for non-HTTPS or browsers without clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
        }
        textArea.remove();
      }
      
      // Show copied message
      setShowCopiedMessage(true);
      
      // Hide message after 2 seconds
      setTimeout(() => {
        setShowCopiedMessage(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <img src="assets/contrack.png" alt="ConTrack" className="h-30" />
          </div>
          
          {/* Share Button */}
          <div className="relative inline-block">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              aria-label="Share link"
            >
              {showCopiedMessage ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Link className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>
            
            {/* Tooltip/Message */}
            {showCopiedMessage && (
              <div 
                className="absolute right-0 mt-2 py-2 px-3 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap"
                role="status"
                aria-live="polite"
              >
                Link copied to clipboard
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;