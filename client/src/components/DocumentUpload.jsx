import React, { useState } from 'react';
import { Upload, X, FileText, Folder, Pen } from 'lucide-react';
import PDFSigner from './PDF/PDFSigner';
import { ConTrackAPI } from '@/services/api/ConTrackAPI';

const DocumentUpload = ({ onFileUpload, uploadedFiles }) => {
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);
    try {
      await ConTrackAPI.uploadFiles(files);
      onFileUpload?.(files);
    } catch (error) {
      console.error('Upload failed:', error);
      // You might want to add error handling UI here
    } finally {
      setIsUploading(false);
    }
  };

  const handleFolderUpload = async (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);
    try {
      await ConTrackAPI.uploadFiles(files);
      onFileUpload?.(files);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileClick = (file) => {
    if (file.type === 'application/pdf') {
      setSelectedPDF(file);
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-500" />;
      case 'txt':
        return <FileText className="w-8 h-8 text-gray-500" />;
      default:
        return <FileText className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-wrap gap-4">
        {/* Uploaded Files */}
        {uploadedFiles.map((file, index) => (
          <div
            key={index}
            className="relative group w-24 h-24 bg-gray-50 rounded-lg border flex flex-col items-center justify-center p-2 cursor-pointer"
            onClick={() => handleFileClick(file)}
          >
            {/* Remove Button */}
            <button 
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onFileUpload(uploadedFiles.filter((_, i) => i !== index));
              }}
            >
              <X className="w-3 h-3" />
            </button>
           
            {/* File Icon */}
            {getFileIcon(file.name)}
            
            {/* File Name */}
            <span className="text-xs text-gray-600 mt-1 truncate w-full text-center">
              {file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}
            </span>

            {/* Sign PDF Button (only show for PDFs) */}
            {file.type === 'application/pdf' && (
              <button
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPDF(file);
                }}
              >
                <Pen className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        
        {/* Upload Buttons */}
        <div className="flex gap-2">
          {/* File Upload */}
          <div>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf"
              disabled={isUploading}
            />
            <label
              htmlFor="file-upload"
              className={`
                w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg 
                flex flex-col items-center justify-center cursor-pointer 
                hover:bg-gray-50 transition-colors
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Upload className={`w-6 h-6 text-gray-400 ${isUploading ? 'animate-bounce' : ''}`} />
              <span className="text-xs text-gray-500 mt-1">
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </span>
            </label>
          </div>

          {/* Folder Upload */}
          <div>
            <input
              type="file"
              webkitdirectory=""
              directory=""
              onChange={handleFolderUpload}
              className="hidden"
              id="folder-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="folder-upload"
              className={`
                w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg 
                flex flex-col items-center justify-center cursor-pointer 
                hover:bg-gray-50 transition-colors
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Folder className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Upload Folder</span>
            </label>
          </div>
        </div>
      </div>

      {/* PDF Signer Modal */}
      {selectedPDF && (
        <PDFSigner
          file={selectedPDF}
          onClose={() => setSelectedPDF(null)}
        />
      )}
    </div>
  );
};

export default DocumentUpload;