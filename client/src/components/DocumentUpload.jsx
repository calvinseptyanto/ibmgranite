import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

const DocumentUpload = ({ onFileUpload, uploadedFiles }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    onFileUpload?.(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onFileUpload?.(files);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Upload Area */}
      <div 
        className={`
          p-8 transition-all duration-200
          ${isDragging 
            ? 'bg-blue-50 border-blue-300' 
            : 'bg-slate-50 border-slate-200'
          }
          border-2 border-dashed rounded-xl
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
          className="flex flex-col items-center gap-4 cursor-pointer"
        >
          <div className="p-4 bg-white rounded-full shadow-sm">
            <Upload className="w-8 h-8 text-blue-500" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700">
              Drop your documents here
            </p>
            <p className="text-sm text-slate-500 mt-1">
              or click to browse from your computer
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Supported formats: PDF, DOC, DOCX, TXT
          </p>
        </label>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="p-6 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <FileText className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;