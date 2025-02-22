import React, { useState } from 'react';
import { Share2, Check, Link } from 'lucide-react';

const Navbar = () => {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const handleShare = async () => {
    try {
      // Get the current URL
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
     
      // Show copied message
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 bg-white border-b z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link className="w-6 h-6 text-blue-600" />
            <span className="ml-2 text-xl font-semibold">Legal AI</span>
          </div>

          {/* Share Button */}
          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showCopiedMessage ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Tooltip/Message (appears when copying) */}
            {showCopiedMessage && (
              <div className="absolute right-0 mt-2 py-1 px-3 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap">
                Link copied to clipboard
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;