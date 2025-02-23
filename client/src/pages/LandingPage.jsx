import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link as LinkIcon } from 'lucide-react';
import { ConTrackAPI } from '@/services/api/ConTrackAPI';
import { useFile } from "../services/FileContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { uploadedFile, setUploadedFile } = useFile();  // ✅ Get file context
  const [linkInput, setLinkInput] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const { uploadedFiles, setUploadedFiles } = useFile();  // Changed from uploadedFile to uploadedFiles
  
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      // Upload files to API
      await ConTrackAPI.uploadFiles(files);

      // Store files in context
      setUploadedFiles(files);  // Changed from setUploadedFile to setUploadedFiles

      navigate('/dashboard');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (linkInput.trim()) {
      navigate(`/dashboard?id=${linkInput}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full px-6">
        {/* Logo and Text */}
        <div className="flex justify-center items-center">
          <img src="assets/contrack.png" alt="ConTrack" className="h-40 w-auto mx-auto" />
        </div>
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600">
            Upload your documents or enter a shared link to get started
          </p>
        </div>

        {/* Upload & Link Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Option */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-center">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx"
                disabled={isUploading}
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer ${isUploading ? 'opacity-50' : ''}`}
              >
                <div className={`mb-4 mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center ${isUploading ? 'animate-pulse' : ''}`}>
                  <Upload className={`w-8 h-8 text-blue-500 ${isUploading ? 'animate-bounce' : ''}`} />
                </div>
                <h2 className="text-xl font-semibold mb-2">Upload Documents</h2>
                <p className="text-gray-500 text-sm">
                  {isUploading ? 'Uploading...' : 'Upload your legal documents to start analysis'}
                </p>
              </label>
            </div>
          </div>

          {/* Link Input */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-center">
              {!showLinkInput ? (
                <button onClick={() => setShowLinkInput(true)} className="w-full">
                  <div className="mb-4 mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <LinkIcon className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Enter Link</h2>
                  <p className="text-gray-500 text-sm">
                    Access an existing dashboard via shared link
                  </p>
                </button>
              ) : (
                <form onSubmit={handleLinkSubmit}>
                  <div className="mb-4 mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <LinkIcon className="w-8 h-8 text-green-500" />
                  </div>
                  <input
                    type="text"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="Enter your shared link"
                    className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoFocus
                  />
                  <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                    Access Dashboard
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;