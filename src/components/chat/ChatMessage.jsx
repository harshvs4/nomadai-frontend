import React from 'react';

const ChatMessage = ({ message }) => {
  const { sender, text, timestamp } = message;
  
  // Format timestamp
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Helper function to convert URLs to clickable links
  const formatTextWithLinks = (text) => {
    if (!text) return '';
    
    // Simple URL regex pattern
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    
    // Split by URLs and generate spans and anchors
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
  
  // Determine message style based on sender
  const messageStyle = sender === 'user' 
    ? 'bg-blue-100 text-gray-800 ml-auto' 
    : sender === 'system'
      ? 'bg-gray-200 text-gray-800 mx-auto max-w-full' 
      : 'bg-white border border-gray-200 text-gray-800 mr-auto';
  
  return (
    <div className={`mb-4 max-w-3/4 ${sender === 'user' ? 'text-right' : 'text-left'}`}>
      <div className={`inline-block rounded-lg px-4 py-2 shadow-sm ${messageStyle}`}>
        <div className="text-sm whitespace-pre-wrap">
          {formatTextWithLinks(text)}
        </div>
      </div>
      <div className="mt-1 text-xs text-gray-500">
        {formatTime(timestamp)}
      </div>
    </div>
  );
};

export default ChatMessage;