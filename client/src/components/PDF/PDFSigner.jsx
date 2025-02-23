import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';
import { Pen, X, Download } from 'lucide-react';
import PDFViewer from './PDFViewer';
import PDFPageNavigation from './PDFPageNavigation';
import SignatureModal from './SignatureModal';
import { supabase } from '@/utils/supabase';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFSigner = ({ file, onClose, onFileUpdate }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatures, setSignatures] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (file) {
      setPdfUrl(file.url);
    }
  }, [file]);

  const handleDocumentLoad = ({ numPages }) => {
    setNumPages(numPages);
  };

  const createSignedPDF = async () => {
    try {
      // Fetch the original PDF
      const response = await fetch(file.url);
      const pdfBytes = await response.arrayBuffer();
      
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      // Add each signature to the PDF
      for (const signature of signatures) {
        const page = pages[signature.page - 1];
        const { width, height } = page.getSize();

        // Convert base64 signature image to bytes
        const signatureImageData = signature.image.split(',')[1];
        const signatureBytes = Uint8Array.from(atob(signatureImageData), c => c.charCodeAt(0));
        
        // Embed the signature image
        const signatureImage = await pdfDoc.embedPng(signatureBytes);

        // Calculate dimensions (convert from 800px display width to PDF points)
        const scaleFactor = width / 800;
        const pdfX = signature.position.x * scaleFactor;
        const pdfY = height - ((signature.position.y + signature.size.height) * scaleFactor);
        const pdfWidth = signature.size.width * scaleFactor;
        const pdfHeight = signature.size.height * scaleFactor;

        // Draw signature on the page
        page.drawImage(signatureImage, {
          x: pdfX,
          y: pdfY,
          width: pdfWidth,
          height: pdfHeight,
        });
      }

      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      return new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error creating signed PDF:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (signatures.length === 0) {
      alert('Please add at least one signature before saving.');
      return;
    }
  
    setIsProcessing(true);
    setSaveStatus('Processing...');
  
    try {
      // Create the signed PDF blob
      const signedPdfBlob = await createSignedPDF();
      if (!signedPdfBlob) {
        throw new Error('Failed to create signed PDF');
      }
  
      // Keep the original filename
      const filePath = `signed/${file.file_name}`;
  
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, signedPdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });
  
      if (uploadError) {
        throw uploadError;
      }
  
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
  
      // Update the document record
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          file_name: file.file_name,
          file_url: publicUrl,
          file_type: 'application/pdf',
          file_size: signedPdfBlob.size,
          metadata: {
            ...file.metadata,
            signed: true,
            signed_at: new Date().toISOString()
          }
        })
        .eq('id', file.id);
  
      if (updateError) {
        throw updateError;
      }
  
      setSaveStatus('Saved successfully!');
      
      // Update the parent component
      if (onFileUpdate) {
        onFileUpdate({
          ...file,
          file_url: publicUrl,
          file_type: 'application/pdf',
          file_size: signedPdfBlob.size,
          metadata: {
            ...file.metadata,
            signed: true,
            signed_at: new Date().toISOString()
          }
        });
      }
  
      // Close the modal and reload the page after successful save
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
  
    } catch (error) {
      console.error('Error saving signed PDF:', error);
      setSaveStatus('Error saving file');
    } finally {
      setIsProcessing(false);
      if (saveStatus.includes('Error')) {
        setTimeout(() => setSaveStatus(''), 3000);
      }
    }
  };

  const handleDownload = async () => {
    if (signatures.length === 0) {
      alert('Please add at least one signature before downloading.');
      return;
    }

    setIsProcessing(true);
    try {
      const signedPdfBlob = await createSignedPDF();
      const downloadUrl = URL.createObjectURL(signedPdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `signed_${file.name || 'document.pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading signed PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Sign Document</h2>
          <div className="flex items-center gap-2">
            {saveStatus && (
              <span className={`text-sm ${
                saveStatus.includes('Error') ? 'text-red-500' : 'text-green-500'
              }`}>
                {saveStatus}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isProcessing || signatures.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Save'}
            </button>
            <button
              onClick={handleDownload}
              disabled={isProcessing || signatures.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Download Copy
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