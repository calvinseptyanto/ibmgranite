import { MessageSquare, Maximize2, Minimize2, X } from 'lucide-react';

const ChatHeader = ({ title, onToggleMode, displayMode, onClose }) => (
  <div className="flex items-center justify-between p-4 border-b bg-white">
    <div className="flex items-center gap-3">
      <MessageSquare className="w-6 h-6 text-blue-600" />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleMode}
        className="p-2 hover:bg-gray-100 rounded-lg"
        title={displayMode === 'sidebar' ? 'Switch to fullscreen' : 'Switch to sidebar'}
      >
        {displayMode === 'sidebar' ? (
          <Maximize2 className="w-5 h-5" />
        ) : (
          <Minimize2 className="w-5 h-5" />
        )}
      </button>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-lg"
        title="Close chat"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default ChatHeader;