import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import { Pen, X, Download } from 'lucide-react';
import { downloadSignedPDF } from '../../utils/pdfUtils';
import PDFViewer from './PDFViewer';
import PDFPageNavigation from './PDFPageNavigation';
import SignatureModal from './SignatureModal';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFSigner = ({ file, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatures, setSignatures] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleDocumentLoad = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDownload = async () => {
    if (signatures.length === 0) {
      alert('Please add at least one signature before downloading.');
      return;
    }

    setIsDownloading(true);
    try {
      const success = await downloadSignedPDF(file, signatures);
      if (!success) {
        alert('Failed to download PDF. Please try again.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Sign Document</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={signatures.length === 0 || isDownloading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Processing...' : 'Download Signed PDF'}
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto relative bg-gray-100">
          <div className="flex justify-center p-4">
            <PDFViewer
              url={pdfUrl}
              currentPage={currentPage}
              signatures={signatures}
              onDocumentLoad={handleDocumentLoad}
              onSignatureUpdate={(id, updates) => {
                setSignatures(sigs =>
                  sigs.map(sig => sig.id === id ? { ...sig, ...updates } : sig)
                );
              }}
              onSignatureDelete={(id) => {
                setSignatures(sigs => sigs.filter(sig => sig.id !== id));
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center">
          <PDFPageNavigation
            currentPage={currentPage}
            numPages={numPages}
            onPageChange={setCurrentPage}
          />
          <button
            onClick={() => setShowSignatureModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <Pen className="w-4 h-4" />
            Add Signature
          </button>
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={(signatureData) => {
          const newSignature = {
            id: Date.now(),
            image: signatureData,
            page: currentPage,
            position: { x: 50, y: 50 },
            size: { width: 200, height: 100 }
          };
          setSignatures([...signatures, newSignature]);
          setShowSignatureModal(false);
        }}
      />
    </div>
  );
};

export default PDFSigner;