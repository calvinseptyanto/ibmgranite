import React, { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import DocumentUpload from '@/components/DocumentUpload';
import ComplianceScore from '@/components/ComplianceScore';
import KeyEvents from '@/components/KeyEvents';
import Summary from '@/components/Summary';
import Navbar from '@/components/Navbar';

const DashboardPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [complianceData, setComplianceData] = useState({
    score: 75,
    requirements: [
      { name: 'Data Protection', met: true },
      { name: 'Document Retention', met: true },
      { name: 'Privacy Policy', met: false },
    ]
  });
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
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top Grid: DocumentUpload, ComplianceScore, and Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <DocumentUpload
              onFileUpload={handleFileUpload}
              uploadedFiles={uploadedFiles}
            />
            <ComplianceScore
              score={complianceData.score}
              requirements={complianceData.requirements}
            />
            <Summary summary={summary} />
          </div>

          {/* Bottom Row: KeyEvents full width */}
          <div>
            <KeyEvents events={keyEvents} />
          </div>
        </div>
      </main>

      {/* Chat Interface */}
      <ChatInterface onSendMessage={handleChatMessage} />
    </div>
  );
};

export default DashboardPage;