import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, ArrowRight, Maximize2 } from 'lucide-react';

// ChatButton Component
const ChatButton = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-50"
  >
    {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
  </button>
);

// ChatHeader Component
const ChatHeader = ({ title, onExpand, displayMode }) => (
  <div className="flex items-center justify-between p-4 border-b bg-white">
    <div className="flex items-center gap-3">
      <MessageSquare className="w-6 h-6 text-blue-600" />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    <div className="flex gap-2">
      {displayMode !== 'popup' && (
        <button
          onClick={() => onExpand('popup')}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Contract to popup"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
        </button>
      )}
      {displayMode !== 'sidebar' && (
        <button
          onClick={() => onExpand('sidebar')}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Switch to sidebar"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
      {displayMode !== 'fullscreen' && (
        <button
          onClick={() => onExpand('fullscreen')}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Switch to fullscreen"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      )}
    </div>
  </div>
);

// ChatMessages Component
const ChatMessages = ({ messages }) => (
  <div className="flex-1 overflow-y-auto p-4">
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`
              max-w-[80%] p-3 rounded-2xl
              ${message.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
              }
            `}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ChatInput Component
const ChatInput = ({ value, onChange, onSend }) => (
  <div className="p-4 border-t bg-white">
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        onKeyPress={(e) => e.key === 'Enter' && onSend()}
      />
      <button
        onClick={onSend}
        className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  </div>
);

// Main ChatInterface Component
const ChatInterface = ({ onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState('popup');
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you analyze your documents?', sender: 'assistant' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    const handleSidebarEffect = () => {
      if (displayMode === 'sidebar' && isOpen) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    };

    handleSidebarEffect();
    return () => document.body.classList.remove('sidebar-open');
  }, [displayMode, isOpen]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = { text: inputMessage, sender: 'user' };
      setMessages(prev => [...prev, newMessage]);
      onSendMessage?.(inputMessage);
      setInputMessage('');
    }
  };

  const containerStyles = {
    popup: 'fixed bottom-20 right-4 w-96 h-[600px] rounded-xl',
    sidebar: 'fixed top-0 right-0 w-96 h-full border-l',
    fullscreen: 'fixed inset-4 rounded-xl'
  };

  return (
    <>
      <ChatButton
        isOpen={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
      />
      
      {isOpen && (
        <div className={`
          bg-white shadow-lg transition-all duration-300 z-40
          ${containerStyles[displayMode]}
        `}>
          <div className="flex flex-col h-full">
            <ChatHeader
              title="AI Assistant"
              onExpand={setDisplayMode}
              displayMode={displayMode}
            />
            <ChatMessages messages={messages} />
            <ChatInput
              value={inputMessage}
              onChange={setInputMessage}
              onSend={handleSendMessage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatInterface;