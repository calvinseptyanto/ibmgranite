import { Send } from 'lucide-react';

const ChatInput = ({ value, onChange, onSend }) => (
  <div className="p-4 border-t bg-white">
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded-full focus:outline-none focus:ring focus:ring-blue-200"
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

export default ChatInput;