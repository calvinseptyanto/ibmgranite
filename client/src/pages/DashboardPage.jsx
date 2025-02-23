import React, { useState } from 'react';
import { useFile } from '@/services/FileContext';
import ChatInterface from '@/components/Chat/ChatInterface';
import DocumentUpload from '@/components/DocumentUpload';
import ComplianceScore from '@/components/ComplianceScore';
import KeyEvents from '@/components/KeyEvents';
import Summary from '@/components/Summary';
import ComplianceObligations from '@/components/ComplianceObligations';
import Navbar from '@/components/Navbar';

import { ConTrackAPI } from '@/services/api/ConTrackAPI';

const DashboardPage = () => {
  const { uploadedFiles, setUploadedFiles } = useFile(); // Get files from context
  const [complianceData] = useState({
    score: 75,
    requirements: [
      { name: 'Data Protection', met: true },
      { name: 'Document Retention', met: true },
      { name: 'Privacy Policy', met: false },
    ]
  });

  const [chatMode, setChatMode] = useState('popup');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPDFSignerOpen, setIsPDFSignerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [keyEvents] = useState([
    {
      date: '2025-03-15',
      type: 'deadline',
      title: 'Policy Update Required',
      description: 'Update privacy policy to comply with new regulations'
    },
    {
      date: '2025-04-01',
      type: 'milestone',
      title: 'Quarterly Review',
      description: 'Internal compliance review deadline'
    }
  ]);

  const [summary] = useState(
    "This document outlines the compliance requirements and obligations for data handling and privacy policies. Key points include:\n\n" +
    "1. Data protection measures are currently in place and meeting standards\n" +
    "2. Document retention policies are being followed correctly\n" +
    "3. Privacy policy requires updates to align with new regulations\n\n" +
    "Recommended actions include reviewing and updating the privacy policy before the March 15 deadline."
  );

  const handleFileUpload = async (files) => {
    try {
      // Upload files to API
      await ConTrackAPI.uploadFiles(files);
      
      // Update the files in context
      setUploadedFiles(prevFiles => [...prevFiles, ...files]);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className={`flex flex-1 relative ${isPDFSignerOpen ? 'overflow-hidden' : ''}`}>
        <main className={`flex-1 px-6 py-8 transition-all duration-300 ${isChatOpen && chatMode === 'sidebar' ? 'mr-[30vw]' : ''}`}>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Document Analysis Dashboard
            </h1>
            
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Document Upload and Summary */}
                <div className="flex flex-col gap-8">
                  <DocumentUpload
                    onFileUpload={handleFileUpload}
                    uploadedFiles={uploadedFiles} // Pass files from context
                    onPDFSignerOpen={setSelectedFile}
                    onPDFSignerClose={() => setSelectedFile(null)}
                    isPDFSignerOpen={isPDFSignerOpen}
                    selectedFile={selectedFile}
                  />
                  
                  <Summary summary={summary} />
                </div>

                {/* Right Column: Compliance Score and Obligations */}
                <div className="flex flex-col gap-8">
                  <ComplianceScore initialData={complianceData} />
                  <ComplianceObligations />
                </div>
              </div>

              {/* Bottom Row: Key Events */}
              <div className="mt-8 overflow-x-auto">
                <div className="min-w-[640px] w-full">
                  <KeyEvents events={keyEvents} />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Chat Interface */}
        <ChatInterface
          isOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
          displayMode={chatMode}
          onDisplayModeChange={setChatMode}
        />
      </div>
    </div>
  );
};

export default DashboardPage;