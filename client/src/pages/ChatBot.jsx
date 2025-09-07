import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Brain } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { user } = useAuth();

  // Predefined responses for the AI
  const aiResponses = {
    greetings: [
      "Hello! How are you feeling today?",
      "Hi there! I'm here to listen. What's on your mind?",
      "Hello! I'm your mental health assistant. How can I help you today?"
    ],
    stress: [
      "It sounds like you're feeling stressed. Have you tried taking some deep breaths?",
      "Stress can be overwhelming. Remember to take breaks and be kind to yourself.",
      "When I feel stressed, I find that going for a short walk helps clear my mind."
    ],
    anxiety: [
      "Anxiety can be challenging. Have you practiced any grounding techniques today?",
      "Remember that these feelings will pass. You've gotten through difficult moments before.",
      "Try the 5-4-3-2-1 technique: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste."
    ],
    sadness: [
      "I'm sorry you're feeling down. It's okay to not be okay sometimes.",
      "Would you like to talk about what's making you feel this way?",
      "Remember to be gentle with yourself. Healing isn't linear."
    ],
    happiness: [
      "That's wonderful to hear! Celebrate these positive moments.",
      "I'm glad you're feeling good! What do you think contributed to this mood?",
      "Positive feelings are worth savoring. Enjoy this moment!"
    ],
    default: [
      "I'm here to listen. Could you tell me more about how you're feeling?",
      "Thank you for sharing. How has this been affecting your day?",
      "I understand. Remember that it's okay to feel whatever you're feeling right now.",
      "That sounds challenging. What do you think might help you feel better?",
      "I'm listening. What else would you like to share about this?"
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your mental health assistant. I'm here to listen and provide support. How are you feeling today?",
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Simple keyword matching
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return aiResponses.greetings;
    } else if (message.includes('stress') || message.includes('stressed') || message.includes('overwhelm')) {
      return aiResponses.stress;
    } else if (message.includes('anxious') || message.includes('anxiety') || message.includes('worry')) {
      return aiResponses.anxiety;
    } else if (message.includes('sad') || message.includes('depress') || message.includes('down') || message.includes('upset')) {
      return aiResponses.sadness;
    } else if (message.includes('happy') || message.includes('good') || message.includes('great') || message.includes('excite')) {
      return aiResponses.happiness;
    }
    
    return aiResponses.default;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const responses = getAIResponse(inputMessage);
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Chat Support</h2>
          <p className="text-gray-600 mb-6">
            Chat with our AI assistant for mental health support and guidance. 
            Please sign in to access this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <Brain className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">AI Chat Support</h1>
          <p className="text-gray-600">I'm here to listen and provide support</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === 'ai' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {message.sender === 'ai' ? 'MindJournal AI' : 'You'}
                  </span>
                </div>
                <p className="text-sm">{message.text}</p>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4" />
                  <span className="text-sm font-medium">MindJournal AI</span>
                </div>
                <div className="flex space-x-1 mt-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Quick suggestions */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Quick suggestions:</h3>
        <div className="flex flex-wrap gap-2">
          {["I'm feeling stressed", "I'm anxious today", "I'm feeling happy", "I'm sad", "I need some support"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInputMessage(suggestion)}
              className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition-colors border border-blue-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> This AI chat provides supportive listening and general mental health information. 
          It is not a substitute for professional medical advice, diagnosis, or treatment. 
          If you're in crisis, please contact emergency services or a mental health professional.
        </p>
      </div>
    </div>
  );
};

export default ChatBot;