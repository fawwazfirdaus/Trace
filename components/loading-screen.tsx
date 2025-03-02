"use client";

import { useState, useEffect } from 'react';

const loadingSteps = [
  "Scanning documents...",
  "Extracting key entities...",
  "Identifying relationships...",
  "Building knowledge graph...",
  "Analyzing timeline events...",
  "Generating summaries...",
  "Finalizing case visualization..."
];

export function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 3000; // 3 seconds total
    const stepDuration = totalDuration / loadingSteps.length;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        if (nextStep >= loadingSteps.length) {
          clearInterval(interval);
          return prev;
        }
        return nextStep;
      });
    }, stepDuration);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, totalDuration / 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-md p-8 rounded-lg bg-card shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Building Your Case</h2>
        
        <div className="space-y-6">
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="space-y-2">
            {loadingSteps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-3 transition-opacity duration-300 ${
                  index > currentStep ? 'opacity-30' : 'opacity-100'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${
                  index < currentStep 
                    ? 'bg-green-500' 
                    : index === currentStep 
                      ? 'bg-primary animate-pulse' 
                      : 'bg-secondary'
                }`}></div>
                <span className={index === currentStep ? 'font-medium' : ''}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 