import React, { useState, useRef, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Pen, Move, X } from 'lucide-react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFSigner = ({ file, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatures, setSignatures] = useState([]);
  const [activeSignature, setActiveSignature] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [pdfUrl, setPdfUrl] = useState(null);
  const sigCanvas = useRef(null);
  const pageRef = useRef(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleCreateSignature = () => {
    setShowSignatureModal(true);
  };

  const handleSaveSignature = () => {
    if (sigCanvas.current.isEmpty()) return;

    const signatureData = sigCanvas.current.toDataURL();
    const newSignature = {
      id: Date.now(),
      image: signatureData,
      page: currentPage,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 100 }
    };

    setSignatures([...signatures, newSignature]);
    setShowSignatureModal(false);
    sigCanvas.current.clear();
  };

  const handleClearSignature = () => {
    sigCanvas.current.clear();
  };

  const handleSavePDF = async () => {
    try {
      // Load the PDF document
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      // For each signature, embed it into the PDF
      for (const signature of signatures) {
        const page = pages[signature.page - 1];
        const { width, height } = page.getSize();

        // Convert signature image to bytes
        const signatureImage = await fetch(signature.image);
        const signatureBytes = await signatureImage.blob().then(blob => blob.arrayBuffer());
        const signatureEmbed = await pdfDoc.embedPng(signatureBytes);

        // Calculate position (convert from pixels to PDF points)
        const pdfX = (signature.position.x / 800) * width;
        const pdfY = height - ((signature.position.y / 800) * height) - (signature.size.height / 800 * height);
        const pdfWidth = (signature.size.width / 800) * width;
        const pdfHeight = (signature.size.height / 800) * height;

        // Draw the signature
        page.drawImage(signatureEmbed, {
          x: pdfX,
          y: pdfY,
          width: pdfWidth,
          height: pdfHeight,
        });
      }

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `signed_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving PDF:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleDragStart = (e, signature) => {
    e.preventDefault();
    const pageRect = pageRef.current.getBoundingClientRect();
    const targetRect = e.currentTarget.getBoundingClientRect();
    
    setDragOffset({
      x: e.clientX - targetRect.left,
      y: e.clientY - targetRect.top
    });
    
    setActiveSignature(signature);
    setIsDragging(true);
  };

  const handleDragMove = (e) => {
    if (!isDragging || !activeSignature) return;

    const pageRect = pageRef.current.getBoundingClientRect();
    const newX = e.clientX - pageRect.left - dragOffset.x;
    const newY = e.clientY - pageRect.top - dragOffset.y;

    const maxX = pageRect.width - (activeSignature.size?.width || 200);
    const maxY = pageRect.height - (activeSignature.size?.height || 100);
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));

    setSignatures(prevSignatures =>
      prevSignatures.map(sig =>
        sig.id === activeSignature.id
          ? { ...sig, position: { x: constrainedX, y: constrainedY } }
          : sig
      )
    );
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setActiveSignature(null);
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => {
        e.preventDefault();
        handleDragMove(e);
      };
      
      const handleMouseUp = (e) => {
        e.preventDefault();
        handleDragEnd();
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center bg-white">
            <h2 className="text-xl font-semibold text-gray-900">Sign Document</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSavePDF}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Save PDF
              </button>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto relative bg-gray-100">
            <div className="flex justify-center p-4">
              {pdfUrl && (
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="shadow-lg"
                  error={<div>Failed to load PDF file.</div>}
                  loading={<div>Loading PDF...</div>}
                >
                  <div className="bg-white shadow-lg">
                    <Page 
                      pageNumber={currentPage}
                      className="relative"
                      width={800}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      inputRef={pageRef}
                    >
                      {signatures
                        .filter(sig => sig.page === currentPage)
                        .map(signature => (
                          <div
                            key={signature.id}
                            style={{
                              position: 'absolute',
                              left: signature.position.x,
                              top: signature.position.y,
                              width: signature.size.width,
                              height: signature.size.height,
                              cursor: isDragging ? 'grabbing' : 'grab',
                              touchAction: 'none'
                            }}
                            onMouseDown={(e) => handleDragStart(e, signature)}
                            className="group"
                          >
                            <img
                              src={signature.image}
                              alt="Signature"
                              style={{ width: '100%', height: '100%' }}
                              draggable={false}
                            />
                            <div className="absolute inset-0 bg-blue-50 border border-blue-200 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSignatures(prev => prev.filter(sig => sig.id !== signature.id));
                                }}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            
                            {['nw', 'ne', 'se', 'sw'].map((position) => {
                              const cursorClass = `cursor-${position}-resize`;
                              const positionClass = `${position.includes('n') ? 'top' : 'bottom'}-0 ${position.includes('w') ? 'left' : 'right'}-0`;
                              
                              return (
                                <div
                                  key={position}
                                  className={`absolute ${positionClass} w-4 h-4 opacity-0 group-hover:opacity-100 ${cursorClass}`}
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    
                                    const startX = e.clientX;
                                    const startY = e.clientY;
                                    const startWidth = signature.size.width;
                                    const startHeight = signature.size.height;
                                    const startLeft = signature.position.x;
                                    const startTop = signature.position.y;

                                    const handleResizeMove = (e) => {
                                      e.preventDefault();
                                      let deltaX = e.clientX - startX;
                                      let deltaY = e.clientY - startY;
                                      let newWidth = startWidth;
                                      let newHeight = startHeight;
                                      let newX = startLeft;
                                      let newY = startTop;

                                      if (position.includes('e')) {
                                        newWidth = Math.max(50, startWidth + deltaX);
                                      } else if (position.includes('w')) {
                                        const proposedWidth = Math.max(50, startWidth - deltaX);
                                        if (proposedWidth !== startWidth) {
                                          newWidth = proposedWidth;
                                          newX = startLeft + (startWidth - proposedWidth);
                                        }
                                      }

                                      if (position.includes('s')) {
                                        newHeight = Math.max(25, startHeight + deltaY);
                                      } else if (position.includes('n')) {
                                        const proposedHeight = Math.max(25, startHeight - deltaY);
                                        if (proposedHeight !== startHeight) {
                                          newHeight = proposedHeight;
                                          newY = startTop + (startHeight - proposedHeight);
                                        }
                                      }

                                      const pageRect = pageRef.current.getBoundingClientRect();
                                      const maxWidth = pageRect.width - newX;
                                      const maxHeight = pageRect.height - newY;

                                      newWidth = Math.min(newWidth, maxWidth);
                                      newHeight = Math.min(newHeight, maxHeight);

                                      setSignatures(prevSigs => 
                                        prevSigs.map(sig => 
                                          sig.id === signature.id
                                            ? {
                                                ...sig,
                                                position: { x: newX, y: newY },
                                                size: { width: newWidth, height: newHeight }
                                              }
                                            : sig
                                        )
                                      );
                                    };

                                    const handleResizeEnd = () => {
                                      document.removeEventListener('mousemove', handleResizeMove);
                                      document.removeEventListener('mouseup', handleResizeEnd);
                                    };

                                    document.addEventListener('mousemove', handleResizeMove);
                                    document.addEventListener('mouseup', handleResizeEnd);
                                  }}
                                />
                              );
                            })}
                          </div>
                        ))}
                    </Page>
                  </div>
                </Document>
              )}
            </div>
          </div>

          <div className="p-4 border-t flex justify-between items-center bg-white">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {numPages || '?'}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(numPages || p, p + 1))}
                disabled={!numPages || currentPage >= numPages}
                className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <button
              onClick={handleCreateSignature}
              className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
            >
              <Pen className="w-4 h-4" />
              Add Signature
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={showSignatureModal} onOpenChange={setShowSignatureModal}>
        <AlertDialogContent className="sm:max-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              Create Your Signature
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          <div className="mt-4">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                  className: 'bg-white border border-gray-200 rounded-md shadow-sm',
                  width: 500,
                  height: 200,
                  style: { width: '100%', height: '200px' }
                }}
              />
              <div className="mt-2 text-sm text-gray-500">
                Use your mouse or touch device to draw your signature
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={handleClearSignature}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleSaveSignature}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Save Signature
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PDFSigner;