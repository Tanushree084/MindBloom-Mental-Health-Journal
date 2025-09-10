import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Brain } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import styles from './ChatBot.module.css';

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
    <div className={styles.chatbotContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.chatIcon}>
          <Brain className={styles.chatIconSvg} />
        </div>
        <div>
          <h1 className={styles.chatTitle}>AI Chat Support</h1>
          <p className={styles.chatSubtitle}>I'm here to listen and provide support</p>
        </div>
      </div>

      <div className={styles.chatInterface}>
        {/* Chat messages */}
        <div className={styles.chatMessages}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageContainer} ${message.sender === 'user' ? styles.messageUser : styles.messageAi}`}
            >
              <div className={styles.messageBubble}>
                <div className={styles.messageHeader}>
                  {message.sender === 'ai' ? (
                    <Bot className={styles.messageIcon} />
                  ) : (
                    <User className={styles.messageIcon} />
                  )}
                  <span className={styles.messageSender}>
                    {message.sender === 'ai' ? 'MindJournal AI' : 'You'}
                  </span>
                </div>
                <p className={styles.messageText}>{message.text}</p>
                <div className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className={styles.messageContainer}>
              <div className={styles.messageBubble}>
                <div className={styles.messageHeader}>
                  <Bot className={styles.messageIcon} />
                  <span className={styles.messageSender}>MindJournal AI</span>
                </div>
                <div className={styles.loadingDots}>
                  <div className={styles.dot}></div>
                  <div className={styles.dot} style={{ animationDelay: '0.1s' }}></div>
                  <div className={styles.dot} style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className={styles.chatInput}>
          <form onSubmit={handleSendMessage} className={styles.inputForm}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className={styles.messageInput}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className={styles.sendButton}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Quick suggestions */}
      <div className={styles.suggestions}>
        <h3 className={styles.suggestionsTitle}>Quick suggestions:</h3>
        <div className={styles.suggestionsGrid}>
          {["I'm feeling stressed", "I'm anxious today", "I'm feeling happy", "I'm sad", "I need some support"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInputMessage(suggestion)}
              className={styles.suggestionButton}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className={styles.disclaimer}>
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