"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

interface ChatInterfaceProps {
  nodeId: string;
}

// This is where you would integrate with your LLM API
// For the hackathon, we'll simulate responses based on the node type
const generateResponse = async (nodeId: string, message: string): Promise<string> => {
  const responses: Record<string, string[]> = {
    events: [
      "The suspicious package was discovered at 9:45 AM on February 15, 2023 by security guard Michael Johnson during a routine patrol.",
      "The evacuation began at 9:52 AM and was completed by 10:08 AM. All 243 people in the building were safely evacuated.",
      "The bomb squad arrived at 10:15 AM and deployed a robot to examine the package. The controlled detonation was performed at 11:30 AM.",
      "According to the police report, security footage shows the male suspect placing the package at 9:03 AM. He was wearing a gray hoodie and baseball cap.",
      "The courthouse was reopened at 2:30 PM after thorough sweeps confirmed no additional threats."
    ],
    people: [
      "John Doe (35) has a history of making threatening calls to government offices. He was previously arrested in 2019 for trespassing at a federal building.",
      "Eyewitness Jane Smith reported seeing someone matching the suspect's description leaving the courthouse parking lot in a blue sedan.",
      "Judge Patricia Williams was presiding over a high-profile drug trafficking case that day. She had received threats in the weeks prior.",
      "Security guard Michael Johnson has worked at the courthouse for 12 years and received commendation for his quick response.",
      "The suspect remains at large. Police have released a composite sketch based on security footage and witness descriptions."
    ],
    documents: [
      "The police report (Case #2023-0215-BT) was filed by Officer Carlos Rodriguez. It details the initial response and evidence collection procedures.",
      "Security footage from three angles shows the suspect entering at 8:57 AM through the north entrance, placing the package at 9:03 AM, and exiting at 9:05 AM.",
      "Forensic analysis of device components shows similarities to a 2018 device, including the use of similar timer mechanisms and detonator wiring patterns.",
      "Witness statements were collected from 17 courthouse staff and visitors. Three witnesses reported seeing the suspect, with consistent descriptions.",
      "The bomb squad report details components of the device, which included a timer, wires, and a non-explosive substance designed to look like C-4."
    ],
    similar: [
      "The 2018 Pineville Courthouse bomb attempt occurred on July 12, 2018. The suspect in that case, Thomas Green, was apprehended and is currently serving a 15-year sentence.",
      "Forensic analysis showed that both the 2018 and 2023 devices had similar wiring patterns and timing mechanisms, suggesting a possible connection or copycat.",
      "In 2021, a threat was made to a government building in Madison County using a different method (called-in bomb threat), but the timing coincided with a similar high-profile drug case.",
      "Analysis of nationwide courthouse threats shows a pattern of incidents occurring during high-profile trials, particularly drug trafficking and organized crime cases.",
      "The FBI has established a task force to investigate potential connections between these cases, focusing on whether the 2023 suspect had contact with Thomas Green while he was in prison."
    ]
  };

  // Simulate API delay - longer to seem more realistic
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Get random response for the node type or return default
  if (nodeId in responses) {
    const nodeResponses = responses[nodeId];
    // Try to find a response that matches the query, or return a random one
    const lowerQuery = message.toLowerCase();
    const matchingResponses = nodeResponses.filter(r => 
      r.toLowerCase().includes(lowerQuery)
    );
    
    if (matchingResponses.length > 0) {
      return matchingResponses[0];
    }
    
    return nodeResponses[Math.floor(Math.random() * nodeResponses.length)];
  }
  
  return "I don't have specific information about that in my current dataset.";
};

export function ChatInterface({ nodeId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await generateResponse(nodeId, inputValue);
      
      // Add placeholder AI message for typing animation
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: '',
        isTyping: true
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      // Simulate typing effect
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < response.length) {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            lastMessage.content += response.charAt(currentIndex);
            return newMessages;
          });
          currentIndex++;
        } else {
          // Remove typing indicator when done
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            lastMessage.isTyping = false;
            return newMessages;
          });
          clearInterval(typingInterval);
        }
      }, 15); // Typing speed - lower number is faster
      
    } catch (error) {
      console.error('Error generating response:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your question.'
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600/40 backdrop-blur-sm border border-blue-500/30 text-white'
                  : 'bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-100'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse mr-2"></div>
                  <span className="text-xs font-medium text-blue-300">TRACE AI</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              
              {message.role === 'assistant' && message.isTyping && (
                <div className="flex mt-1">
                  <div className="w-1.5 h-1.5 bg-blue-300/50 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-blue-300/50 rounded-full animate-pulse mx-1" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-300/50 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-800 pt-4 mt-4 px-4 pb-4">
        <div className="relative">
          <Input
            placeholder="Ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="w-full bg-black/30 border border-gray-700 rounded-md py-2 px-4 text-white text-sm placeholder-gray-500"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || inputValue.trim() === ''}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors bg-transparent border-none hover:bg-transparent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
} 