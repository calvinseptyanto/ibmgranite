import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, ArrowRight, Maximize2 } from 'lucide-react';

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
    const baseClasses = "bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out";
    
    switch (displayMode) {
      case 'popup':
        return `${baseClasses} fixed bottom-20 right-4 w-96 h-[600px] rounded-xl`;
      case 'sidebar':
        return `${baseClasses} fixed top-0 right-0 w-[30vw] h-full border-l`;
      case 'fullscreen':
        return `${baseClasses} fixed inset-4 rounded-xl`;
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

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => onOpenChange(!isOpen)}
        className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-50"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>

      {/* Chat Container */}
      {isOpen && (
        <div className={getContainerClasses()}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold">AI Assistant</h2>
            </div>
            <div className="flex gap-2">
              {displayMode !== 'popup' && (
                <button
                  onClick={() => onDisplayModeChange('popup')}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
              )}
              {displayMode !== 'sidebar' && (
                <button
                  onClick={() => onDisplayModeChange('sidebar')}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              {displayMode !== 'fullscreen' && (
                <button
                  onClick={() => onDisplayModeChange('fullscreen')}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
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

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatInterface;