import { MessageSquare, ArrowRight, Maximize2 } from 'lucide-react';

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

export default ChatHeader;