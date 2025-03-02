"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Basic loading steps with complexity weights (1-5 scale)
const baseLoadingSteps = [
  { text: "Scanning documents...", complexity: 2 },
  { text: "Extracting key entities...", complexity: 3 },
  { text: "Identifying relationships...", complexity: 4 },
  { text: "Building knowledge graph...", complexity: 5 },
  { text: "Analyzing timeline events...", complexity: 3 },
  { text: "Generating summaries...", complexity: 4 },
  { text: "Finalizing case visualization...", complexity: 3 }
];

// Additional database steps with complexity weights
const databaseSteps = [
  { text: "Connecting to database...", complexity: 2 },
  { text: "Searching for similar cases...", complexity: 4 },
  { text: "Retrieving preexisting knowledge...", complexity: 3 },
  { text: "Merging knowledge bases...", complexity: 5 },
  { text: "Cross-referencing entities...", complexity: 4 }
];

export function LoadingScreen() {
  const searchParams = useSearchParams();
  const isDbEnabled = searchParams.get('db') === '1';
  
  // Determine which steps to use based on whether database search is enabled
  const loadingSteps = isDbEnabled 
    ? [...baseLoadingSteps.slice(0, 3), ...databaseSteps, ...baseLoadingSteps.slice(3)]
    : baseLoadingSteps;

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Completely revamped step progression
  useEffect(() => {
    // Forced initial step advancement to ensure the first steps are visible
    // Make first step appear immediately
    setTimeout(() => {
      setCurrentStep(1); // Move immediately to step 1
    }, 500);
    
    // Move to step 2 quickly
    setTimeout(() => {
      setCurrentStep(2);
    }, 1500);
    
    // Create a simpler, more reliable interval for the remaining steps
    const interval = setInterval(() => {
      setCurrentStep(prevStep => {
        if (prevStep >= loadingSteps.length - 1) {
          clearInterval(interval);
          return prevStep;
        }
        return prevStep + 1;
      });
    }, 2000); // Advance every 2 seconds
    
    // Significantly longer duration for more realistic feeling
    const totalDuration = isDbEnabled ? 20000 : 15000;  // 15-20 seconds
    
    // Smoother progress bar with more frequent updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 0.4; // Slower progress updates for longer animation
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, totalDuration / 250);
    
    // Clean up all timers on unmount
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [loadingSteps.length, isDbEnabled]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-md p-8 rounded-lg bg-card shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Investigating Your Case
          {isDbEnabled && <span className="block text-sm text-muted-foreground mt-1">With Database Search</span>}
        </h2>
        
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
                <span className={
                  index === currentStep 
                    ? 'font-medium' 
                    : ''
                }>
                  {step.text}
                  {index === currentStep && (
                    <span className="inline-block ml-1 animate-pulse">
                      {[...Array(3)].map((_, i) => (
                        <span key={i} className="inline-block animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>.</span>
                      ))}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 