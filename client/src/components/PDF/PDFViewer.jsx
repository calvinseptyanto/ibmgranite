import React, { useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { DraggableSignature } from './DraggableSignature';

export const PDFViewer = ({ 
  url, 
  currentPage, 
  signatures, 
  onSignatureUpdate, 
  onSignatureDelete,
  onDocumentLoad 
}) => {
  const pageRef = useRef(null);

  return (
    <Document
      file={url}
      onLoadSuccess={onDocumentLoad}
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
              <DraggableSignature
                key={signature.id}
                signature={signature}
                pageRef={pageRef}
                onDelete={onSignatureDelete}
                onUpdate={onSignatureUpdate}
              />
            ))}
        </Page>
      </div>
    </Document>
  );
};

export default PDFViewer;