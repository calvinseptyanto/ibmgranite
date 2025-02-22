import React, { useState } from 'react';
import ChatButton from './ChatButton';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

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

  const getContainerClasses = () => {
    const baseClasses = "bg-white flex flex-col transition-all duration-300 ease-in-out";
    
    if (displayMode === 'sidebar') {
      return `${baseClasses} fixed top-16 right-0 h-[calc(100vh-64px)] w-[30vw] border-l shadow-lg z-40`;
    }
    
    // Enhanced fullscreen styling
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

  const handleSend = () => {
    if (inputMessage.trim()) {
      setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
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
          <ChatMessages messages={messages} />
        </div>
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSend}
        />
      </div>
    </>
  );
};

export default ChatInterface;