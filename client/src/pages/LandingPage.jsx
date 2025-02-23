import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link as LinkIcon } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [linkInput, setLinkInput] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    // Handle file upload logic here
    // After successful upload, navigate to dashboard
    navigate('/dashboard');
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (linkInput.trim()) {
      // Handle link validation and navigation
      navigate(`/dashboard?id=${linkInput}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full px-6">
        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Legal Document Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Upload your documents or enter a shared link to get started
          </p>
        </div>

        {/* Options Grid */}
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
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer"
              >
                <div className="mb-4 mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Upload Documents</h2>
                <p className="text-gray-500 text-sm">
                  Upload your legal documents to start analysis
                </p>
              </label>
            </div>
          </div>

          {/* Link Option */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-center">
              {!showLinkInput ? (
                <button
                  onClick={() => setShowLinkInput(true)}
                  className="w-full"
                >
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
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
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