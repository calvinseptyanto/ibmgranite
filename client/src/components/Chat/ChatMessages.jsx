const ChatMessages = ({ messages }) => (
  <div className="h-full overflow-y-auto p-6">
    <div className="space-y-6">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`
              max-w-[80%] p-4 rounded-2xl
              ${message.sender === 'user'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-100 shadow-sm'
              }
              transition-all duration-200
              hover:shadow-md
            `}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ChatMessages;