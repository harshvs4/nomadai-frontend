import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useTravelContext } from '../../context/TravelContext';
import llmService from '../../services/llm';

const ChatWindow = ({ isOpen, onToggle, itineraryId }) => {
  const { chatMessages, addChatMessage, setItinerary } = useTravelContext();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isOpen]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Welcome message
  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      // Add a welcome message when chat is opened for the first time
      addChatMessage({
        id: 'welcome',
        sender: 'assistant',
        text: "Hello! I'm your NomadAI assistant. You can ask me to modify your itinerary, suggest more activities, or answer any questions about your trip. How can I help you today?",
        timestamp: new Date().toISOString()
      });
    }
  }, [isOpen, chatMessages.length, addChatMessage]);
  
  // Handle sending a chat message
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    addChatMessage(userMessage);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Send message to the API
      const response = await llmService.sendChatMessage(itineraryId, message);
      
      // Add assistant response to chat
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toISOString()
      };
      
      addChatMessage(assistantMessage);
      
      // Update itinerary if it was modified by the assistant
      if (response.updated_itinerary) {
        setItinerary(response.updated_itinerary);
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      
      // Add error message to chat
      addChatMessage({
        id: `error-${Date.now()}`,
        sender: 'system',
        text: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTyping(false);
    }
  };
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 bg-white shadow-lg rounded-t-lg overflow-hidden flex flex-col z-10">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-medium">NomadAI Assistant</h3>
        <button
          onClick={onToggle}
          className="text-white hover:text-blue-100"
          aria-label="Close chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 8 5.293 4.707a1 1 0 011.414-1.414L10 6.586l3.293-3.293a1 1 0 111.414 1.414L11.414 8l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-h-96">
        {chatMessages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 my-2">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
        
        {/* Auto scroll reference */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
    </div>
  );
};

export default ChatWindow;