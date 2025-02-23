import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PDFPageNavigation = ({ currentPage, numPages, onPageChange }) => {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="px-3 py-2 bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <span className="px-3 py-2 text-sm">
          Page {currentPage} of {numPages || '?'}
        </span>
        <button
          onClick={() => onPageChange(Math.min(numPages || currentPage, currentPage + 1))}
          disabled={!numPages || currentPage >= numPages}
          className="px-3 py-2 bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors flex items-center gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

export default PDFPageNavigation;