import React, { useState } from 'react';
import ChatInterface from '@/components/Chat/ChatInterface';
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
  const [chatMode, setChatMode] = useState('popup'); // 'popup', 'sidebar', or 'fullscreen'
  const [isChatOpen, setIsChatOpen] = useState(false);

  const getMainContentClass = () => {
    if (isChatOpen && chatMode === 'sidebar') {
      return 'w-[70vw]';
    }
    return 'w-full';
  };

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
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Main Content */}
      <main className={`${getMainContentClass()} transition-all duration-300 ease-in-out`}>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Document Analysis Dashboard
          </h1>
          {/* Your other dashboard content */}
          {/* Dashboard content */}

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