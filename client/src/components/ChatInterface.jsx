import React, { useState } from 'react';
import { MessageSquare, Maximize2, Minimize2, Send } from 'lucide-react';

const ChatInterface = ({ onSendMessage }) => {
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }]);
      onSendMessage?.(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className={`
      fixed bg-white rounded-xl shadow-lg transition-all duration-300
      ${isChatExpanded 
        ? 'inset-4 z-50' 
        : 'bottom-4 right-4 w-96 h-[600px]'
      }
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <button
          onClick={() => setIsChatExpanded(!isChatExpanded)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          {isChatExpanded 
            ? <Minimize2 className="w-5 h-5" />
            : <Maximize2 className="w-5 h-5" />
          }
        </button>
      </div>

      {/* Messages */}
      <div className="h-[calc(100%-8rem)] overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`
                flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}
              `}
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
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-full focus:outline-none focus:ring focus:ring-blue-200"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;