import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MessageSquare, Maximize2, Minimize2, Send } from "lucide-react";

const ChatInterface = ({ onSendMessage }) => {
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = { text: inputMessage, sender: 'user' };
      setMessages(prev => [...prev, newMessage]);
      onSendMessage?.(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div
      className={`
        fixed transition-all duration-300 ease-in-out
        ${isChatExpanded 
          ? 'inset-4 bg-white shadow-xl rounded-lg z-50' 
          : 'bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-lg'
        }
      `}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} />
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsChatExpanded(!isChatExpanded)}
        >
          {isChatExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-8rem)] p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.sender === 'user' 
                ? 'ml-auto bg-primary text-primary-foreground' 
                : 'bg-muted'
            } p-3 rounded-lg max-w-[80%]`}
          >
            {message.text}
          </div>
        ))}
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
ChatInterface.propTypes = {
  onSendMessage: PropTypes.func,
};

export default ChatInterface;