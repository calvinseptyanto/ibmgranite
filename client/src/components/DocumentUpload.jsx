import React, { useState } from 'react';
import { Upload, X, FileText, Folder } from 'lucide-react';
import { ConTrackAPI } from '@/services/api/ConTrackAPI';

const DocumentUpload = ({ onFileUpload, uploadedFiles }) => {
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

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-wrap gap-4">
        {/* Uploaded Files */}
        {uploadedFiles.map((file, index) => (
          <div
            key={index}
            className="relative group w-24 h-24 bg-gray-50 rounded-lg border flex flex-col items-center justify-center p-2"
          >
            <button 
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onFileUpload(uploadedFiles.filter((_, i) => i !== index))}
            >
              <X className="w-3 h-3" />
            </button>
            
            <FileText className="w-8 h-8 text-blue-500" />
            
            <span className="text-xs text-gray-600 mt-1 truncate w-full text-center">
              {file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}
            </span>
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
    </div>
  );
};

export default DocumentUpload;