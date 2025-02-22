import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-50"
  >
    <MessageSquare className="w-6 h-6" />
  </button>
);

export default ChatButton;