import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import './AIChatbot.css';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`ai-chatbot-container ${isOpen ? 'open' : ''}`}>
      {/* Floating Button */}
      <button 
        className="chatbot-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && <span className="tooltip">Spice AI Expert</span>}
      </button>

      {/* Chat Interface */}
      <div className="chat-interface">
        <div className="chat-header">
          <div className="ai-avatar">
            <Sparkles size={20} />
          </div>
          <div className="chat-title">
            <h4>Spice Expert AI</h4>
            <span>Online | Expert Guidance</span>
          </div>
        </div>

        <div className="chat-body">
          <div className="message bot">
            <p>Hello! I'm your Richeema Spicy Expert. How can I help you elevate your cooking today?</p>
            <span className="time">Just now</span>
          </div>
          
          <div className="message user">
            <p>I'm looking for a mild cinnamon for baking.</p>
            <span className="time">1 min ago</span>
          </div>

          <div className="message bot">
            <p>For baking, I highly recommend our <strong>Ceylon Cinnamon Quills</strong>. It has a delicate, sweet flavor profile that won't overpower your desserts.</p>
            <span className="time">1 min ago</span>
          </div>
        </div>

        <div className="chat-footer">
          <input type="text" placeholder="Ask about spices, recipes..." />
          <button className="send-btn"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
