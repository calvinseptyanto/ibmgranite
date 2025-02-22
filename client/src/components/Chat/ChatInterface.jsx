import React, { useState } from 'react';
import ChatButton from './ChatButton';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { ConTrackAPI } from '@/services/api/ContrackAPI';

const ChatInterface = ({
  isOpen,
  onOpenChange,
  displayMode,
  onDisplayModeChange
}) => {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you analyze your documents?', sender: 'assistant' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getContainerClasses = () => {
    const baseClasses = "bg-white flex flex-col transition-all duration-300 ease-in-out";
    
    if (displayMode === 'sidebar') {
      return `${baseClasses} fixed top-16 right-0 h-[calc(100vh-64px)] w-[30vw] border-l shadow-lg z-40`;
    }
    
    return `
      ${baseClasses}
      fixed inset-8
      rounded-2xl
      shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)]
      border border-gray-200
      backdrop-blur-xl
      bg-white/95
      z-50
      overflow-hidden
    `;
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Add user message immediately
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to API
      const response = await ConTrackAPI.sendChatMessage(inputMessage);
      
      // Add AI response
      const aiMessage = { 
        text: response.response.output || response.response, 
        sender: 'assistant'
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      setMessages(prev => [...prev, {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    onDisplayModeChange(displayMode === 'sidebar' ? 'fullscreen' : 'sidebar');
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // When closed, show only the button
  if (!isOpen) {
    return <ChatButton onClick={() => onOpenChange(true)} />;
  }

  // Enhanced overlay for fullscreen mode
  const Overlay = displayMode === 'fullscreen' ? (
    <div 
      className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-opacity duration-300"
      onClick={handleClose}
    />
  ) : null;

  // When open, show the overlay (if fullscreen) and interface
  return (
    <>
      {Overlay}
      <div className={getContainerClasses()}>
        <ChatHeader
          title="AI Assistant"
          onToggleMode={toggleMode}
          displayMode={displayMode}
          onClose={handleClose}
        />
        <div className="flex-1 overflow-hidden relative">
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading}
          />
        </div>
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSend}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>
    </>
  );
};

export default ChatInterface;