
import React, { useState, useRef, useEffect } from 'react';
import { getFunctions, httpsCallable } from "firebase/functions";
import { MessageSquare, X, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Message {
  isUser: boolean;
  text: string;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Load message history from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem('chatHistory');
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        setMessages(parsedMessages.map((m: {user: boolean, text: string}) => ({
          isUser: m.user,
          text: m.text
        })));
      } catch (error) {
        console.error("Error parsing stored messages:", error);
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      const historyFormat = messages.map(m => ({
        user: m.isUser,
        text: m.text
      }));
      localStorage.setItem('chatHistory', JSON.stringify(historyFormat));
    }
  }, [messages]);

  // This function would call the Firebase function in production
  // For now, we'll mock the response
  const sendMessageToAI = async (message: string): Promise<string> => {
    // In production, this would actually call Firebase:
    // const functions = getFunctions();
    // const chatSupport = httpsCallable(functions, 'chatSupport');
    // const result = await chatSupport({ message });
    // return result.data.reply;
    
    // For now, we'll simulate a response after a short delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Thanks for your message: "${message}". This is a simulated response as the Firebase function is not yet deployed. When deployed, I'll be able to provide real assistance with the platform.`);
      }, 1000);
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = inputText.trim();
    setInputText("");
    
    // Add user message to chat
    setMessages(prev => [...prev, { isUser: true, text: userMessage }]);
    
    setIsLoading(true);
    try {
      // Add temporary "typing" message
      setMessages(prev => [...prev, { isUser: false, text: "..." }]);
      
      // Get AI response
      const aiResponse = await sendMessageToAI(userMessage);
      
      // Replace "typing" with actual response
      setMessages(prev => [
        ...prev.slice(0, -1),
        { isUser: false, text: aiResponse }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      
      // Replace "typing" with error message
      setMessages(prev => [
        ...prev.slice(0, -1),
        { isUser: false, text: "Oops, try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-procloud-green text-white flex items-center justify-center shadow-lg hover:bg-procloud-green/90 transition-all z-50"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-lg flex flex-col z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ maxHeight: "70vh" }}
      >
        {/* Chat Header */}
        <div className="bg-procloud-green text-white p-3 rounded-t-lg flex justify-between items-center">
          <h3 className="font-bold">Help Center</h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="bg-transparent border-none text-white text-xl cursor-pointer"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-3 overflow-y-auto bg-gray-50" style={{ maxHeight: "50vh" }}>
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Send a message to start a conversation
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.isUser ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div
                  className={`inline-block rounded-lg px-3 py-2 max-w-[80%] ${
                    msg.isUser
                      ? 'bg-procloud-green text-white rounded-bl-none'
                      : 'bg-white text-gray-800 rounded-br-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-3 flex">
          <Textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 resize-none focus:outline-none"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="ml-2 h-auto"
            variant="default"
          >
            <ArrowUp size={18} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
