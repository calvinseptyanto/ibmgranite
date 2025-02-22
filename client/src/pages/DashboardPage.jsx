import React, { useState } from 'react';
import ChatInterface from '@/components/Chat/ChatInterface';
import DocumentUpload from '@/components/DocumentUpload';
import ComplianceScore from '@/components/ComplianceScore';
import KeyEvents from '@/components/KeyEvents';
import Summary from '@/components/Summary';
import ComplianceObligations from '@/components/ComplianceObligations';
import Navbar from '@/components/Navbar';

const DashboardPage = () => {
  // State definitions
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [complianceData, setComplianceData] = useState({
    score: 75,
    requirements: [
      { name: 'Data Protection', met: true },
      { name: 'Document Retention', met: true },
      { name: 'Privacy Policy', met: false },
    ]
  });
  const [chatMode, setChatMode] = useState('popup'); // 'popup', 'sidebar', or 'fullscreen'
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [keyEvents, setKeyEvents] = useState([
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
  const [summary, setSummary] = useState(
    "This document outlines the compliance requirements and obligations for data handling and privacy policies. Key points include:\n\n" +
    "1. Data protection measures are currently in place and meeting standards\n" +
    "2. Document retention policies are being followed correctly\n" +
    "3. Privacy policy requires updates to align with new regulations\n\n" +
    "Recommended actions include reviewing and updating the privacy policy before the March 15 deadline."
  );

  // Helper functions
  const getMainContentClass = () => {
    if (isChatOpen && chatMode === 'sidebar') {
      return 'w-[70vw]';
    }
    return 'w-full';
  };

  const handleFileUpload = (files) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleChatMessage = (message) => {
    console.log('Processing message:', message);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className={`container mx-auto px-6 py-8 transition-all duration-300 ${getMainContentClass()}`}>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Document Analysis Dashboard
        </h1>
        
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Document Upload and Summary */}
            <div className="flex flex-col gap-8">
              <DocumentUpload
                onFileUpload={handleFileUpload}
                uploadedFiles={uploadedFiles}
              />
              <Summary summary={summary} />
            </div>

            {/* Right Column: Compliance Score and Obligations */}
            <div className="flex flex-col gap-8">
              <ComplianceScore
                score={complianceData.score}
                requirements={complianceData.requirements}
              />
              <ComplianceObligations />
            </div>
          </div>

          {/* Bottom Row: KeyEvents full width */}
          <div className="mt-8 overflow-x-auto">
            <div className="min-w-[640px] w-full">
              <KeyEvents events={keyEvents} />
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
  );
};

export default DashboardPage;