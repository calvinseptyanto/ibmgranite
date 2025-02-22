import { Send } from 'lucide-react';

const ChatInput = ({ value, onChange, onSend }) => (
  <div className="p-6 border-t bg-white/50 backdrop-blur-sm">
    <div className="flex gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-3 bg-white border rounded-full 
                 focus:outline-none focus:ring-2 focus:ring-blue-200 
                 shadow-sm transition-all duration-200"
        onKeyPress={(e) => e.key === 'Enter' && onSend()}
      />
      <button
        onClick={onSend}
        className="p-3 bg-blue-500 text-white rounded-full 
                   hover:bg-blue-600 shadow-sm hover:shadow
                   transition-all duration-200 
                   focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default ChatInput;