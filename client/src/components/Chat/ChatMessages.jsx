const ChatMessages = ({ messages }) => (
  <div className="h-full overflow-y-auto p-4">
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

export default ChatMessages;