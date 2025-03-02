"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
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

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Ask me any questions about this aspect of the case.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      
      // Add AI message
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your question.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
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
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask a question about this aspect of the case..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || inputValue.trim() === ''}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
} 