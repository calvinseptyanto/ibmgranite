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
    const baseClasses = "bg-white flex flex-col transition-all duration-300 ease-in-out z-40";
    
    switch (displayMode) {
      case 'popup':
        return `${baseClasses} fixed bottom-20 right-4 w-96 h-[600px] rounded-xl shadow-lg`;
      case 'sidebar':
        return `${baseClasses} fixed top-16 right-0 h-[calc(100vh-64px)] w-[30vw] border-l shadow-lg bg-white`;
      case 'fullscreen':
        return `${baseClasses} fixed top-16 left-4 right-4 bottom-4 rounded-xl shadow-lg`;
      default:
        return baseClasses;
    }
  };

  const handleSend = () => {
    if (inputMessage.trim()) {
      setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
    }
  };

  if (!isOpen) {
    return <ChatButton isOpen={isOpen} onClick={() => onOpenChange(true)} />;
  }

  if (displayMode === 'sidebar') {
    return (
      <>
        <ChatButton isOpen={isOpen} onClick={() => onOpenChange(false)} />
        <div className={getContainerClasses()}>
          <ChatHeader 
            title="AI Assistant"
            onExpand={onDisplayModeChange}
            displayMode={displayMode}
          />
          <div className="flex-1 overflow-hidden bg-white relative">
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
  }

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={() => onOpenChange(false)} />
      <div className={getContainerClasses()}>
        <ChatHeader 
          title="AI Assistant"
          onExpand={onDisplayModeChange}
          displayMode={displayMode}
        />
        <div className="flex-1 overflow-hidden bg-white relative">
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