import React, { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import DocumentUpload from '@/components/DocumentUpload';
import ComplianceScore from '@/components/ComplianceScore';
import KeyEvents from '@/components/KeyEvents';

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

  const handleFileUpload = (files) => {
    setUploadedFiles(prev => [...prev, ...files]);
    // Add your file processing logic here
  };

  const handleChatMessage = (message) => {
    // Add your chat message processing logic here
    console.log('Processing message:', message);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <DocumentUpload
            onFileUpload={handleFileUpload}
            uploadedFiles={uploadedFiles}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ComplianceScore
            score={complianceData.score}
            requirements={complianceData.requirements}
          />
          <KeyEvents events={keyEvents} />
        </div>
      </div>

      <ChatInterface onSendMessage={handleChatMessage} />
    </div>
  );
};

export default DashboardPage;