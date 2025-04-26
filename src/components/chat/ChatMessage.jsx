import React from 'react';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ message }) => {
  const { sender, text, timestamp } = message;
  
  // Format timestamp
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Helper function to convert URLs to clickable links (for user messages only)
  const formatTextWithLinks = (text) => {
    if (!text) return '';
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlPattern);
    const matches = text.match(urlPattern) || [];
    return parts.reduce((arr, part, i) => {
      arr.push(<span key={`text-${i}`}>{part}</span>);
      if (matches[i]) {
        arr.push(
          <a 
            key={`link-${i}`} 
            href={matches[i]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {matches[i]}
          </a>
        );
      }
      return arr;
    }, []);
  };

  // Get avatar based on sender type
  const getAvatar = () => {
    switch (sender) {
      case 'user':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            U
          </div>
        );
      case 'assistant':
        return (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'system':
        return (
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Determine message style based on sender
  const messageStyle = sender === 'user' 
    ? 'bg-blue-500 text-white rounded-tr-none' 
    : sender === 'system'
      ? 'bg-gray-100 text-gray-800 rounded-lg' 
      : 'bg-green-100 text-gray-800 rounded-tl-none';
  
  return (
    <div className={`flex items-start gap-3 mb-4 ${sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
      {getAvatar()}
      <div className="flex flex-col max-w-[70%]">
        <div className={`rounded-lg px-4 py-2 shadow-sm ${messageStyle}`}>
          <div className="text-sm leading-snug">
            {sender === 'assistant' || sender === 'system' ? (
              <ReactMarkdown>{text}</ReactMarkdown>
            ) : (
              formatTextWithLinks(text)
            )}
          </div>
        </div>
        <div className={`mt-1 text-xs text-gray-500 ${sender === 'user' ? 'text-right' : 'text-left'}`}>
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;