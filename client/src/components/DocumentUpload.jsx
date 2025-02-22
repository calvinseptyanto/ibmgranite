import React from 'react';
import { Upload, X, FileText, Folder } from 'lucide-react';

const DocumentUpload = ({ onFileUpload, uploadedFiles }) => {
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    onFileUpload?.(files);
  };

  const handleFolderUpload = (event) => {
    const files = Array.from(event.target.files);
    onFileUpload?.(files);
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
            className="relative group w-24 h-24 bg-gray-50 rounded-lg border flex flex-col items-center justify-center p-2"
          >
            {/* Remove Button */}
            <button 
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onFileUpload(uploadedFiles.filter((_, i) => i !== index))}
            >
              <X className="w-3 h-3" />
            </button>
            
            {/* File Icon */}
            {getFileIcon(file.name)}
            
            {/* File Name */}
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
              accept=".pdf,.doc,.docx,.txt"
            />
            <label
              htmlFor="file-upload"
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Upload Files</span>
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
            />
            <label
              htmlFor="folder-upload"
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
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