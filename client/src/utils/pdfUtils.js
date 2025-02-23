import { PDFDocument } from 'pdf-lib';

export const downloadSignedPDF = async (file, signatures) => {
  try {
    // Handle different file input types
    let pdfBytes;
    if (file instanceof Blob || file instanceof File) {
      pdfBytes = await file.arrayBuffer();
    } else if (typeof file === 'string' || file?.url) {
      const response = await fetch(file.url || file);
      pdfBytes = await response.arrayBuffer();
    } else {
      throw new Error('Invalid file input');
    }

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    // Add each signature to the PDF
    for (const signature of signatures) {
      const page = pages[signature.page - 1];
      const { width, height } = page.getSize();

      // Extract the base64 image data
      // Handle both full data URL and raw base64
      let signatureImageData = signature.image;
      if (signatureImageData.includes('base64,')) {
        signatureImageData = signatureImageData.split('base64,')[1];
      }

      // Convert base64 to bytes
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
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

    // Return blob if no download is needed
    if (typeof file === 'string' || file?.url) {
      return blob;
    }

    // Download the file
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `signed_${file.name || 'document.pdf'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw error; // Propagate error to caller
  }
};

// Helper function to validate signatures
export const validateSignatures = (signatures) => {
  if (!Array.isArray(signatures) || signatures.length === 0) {
    throw new Error('No signatures provided');
  }

  for (const sig of signatures) {
    if (!sig.page || !sig.position || !sig.size || !sig.image) {
      throw new Error('Invalid signature format');
    }
  }
};

// Helper function to handle file download
export const downloadPDF = (blob, filename) => {
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
};