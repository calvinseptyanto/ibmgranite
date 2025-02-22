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
  };

  const handleChatMessage = (message) => {
    console.log('Processing message:', message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Document Analysis Dashboard</h1>
        
        {/* Upload Section */}
        <section className="mb-8">
          <DocumentUpload
            onFileUpload={handleFileUpload}
            uploadedFiles={uploadedFiles}
          />
        </section>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ComplianceScore
            score={complianceData.score}
            requirements={complianceData.requirements}
          />
          <KeyEvents events={keyEvents} />
        </div>
      </main>

      {/* Chat Interface */}
      <ChatInterface onSendMessage={handleChatMessage} />
    </div>
  );
};

export default DashboardPage;