// utils/pdfUtils.js
import { PDFDocument } from 'pdf-lib';

export const downloadSignedPDF = async (file, signatures) => {
  try {
    // Load the PDF document
    const pdfBytes = await file.arrayBuffer();
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

    // Save and download the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `signed_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error) {
    console.error('Error saving PDF:', error);
    return false;
  }
};