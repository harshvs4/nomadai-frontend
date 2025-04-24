import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, isTyping }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() || isTyping) return;
    
    onSendMessage(message);
    setMessage('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isTyping}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r-md disabled:opacity-50"
          disabled={!message.trim() || isTyping}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.143a1 1 0 00-1-1H4.429a1 1 0 00-.429.076l-1.452.412a1 1 0 01-1.17-1.409l7-14z" />
            <path d="M12 3.429V2a1 1 0 011.553-.833l4 2A1 1 0 0118 4v13a1 1 0 01-1.447.894l-4-2A1 1 0 0112 15v-1.571L8.553 14.33A1 1 0 018 14.571V15a1 1 0 01-2 0v-4.429a1 1 0 01.725-.961l2.898-.828A1 1 0 0110 8v-.571A1 1 0 0110.894 6.553l1.106-.553z" />
          </svg>
        </button>
      </div>
      
      {/* Quick suggestion chips */}
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSendMessage("Can you suggest more activities?")}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full"
          disabled={isTyping}
        >
          Suggest more activities
        </button>
        <button
          type="button"
          onClick={() => onSendMessage("Is there a cheaper hotel option?")}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full"
          disabled={isTyping}
        >
          Cheaper hotel options
        </button>
        <button
          type="button"
          onClick={() => onSendMessage("How can I get around the city?")}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full"
          disabled={isTyping}
        >
          Transportation options
        </button>
      </div>
    </form>
  );
};

export default ChatInput;