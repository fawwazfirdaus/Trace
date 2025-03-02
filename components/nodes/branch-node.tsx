"use client";

import { Handle, Position } from 'reactflow';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Get color based on node type
const getNodeColor = (type: string) => {
  switch (type) {
    case 'events':
      return 'bg-orange-100 border-orange-400 text-orange-800';
    case 'people':
      return 'bg-blue-100 border-blue-400 text-blue-800';
    case 'documents':
      return 'bg-green-100 border-green-400 text-green-800';
    case 'similar':
      return 'bg-purple-100 border-purple-400 text-purple-800';
    default:
      return 'bg-gray-100 border-gray-400 text-gray-800';
  }
};

// Get icon based on node type
const getNodeIcon = (type: string) => {
  switch (type) {
    case 'events':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'people':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'documents':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'similar':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

interface BranchNodeProps {
  id?: string;
  type?: string;
  data: {
    label: string;
    description: string;
    onDetails: () => void;
    reference?: string;
  };
}

export default function BranchNode({ id, type = 'default', data }: BranchNodeProps) {
  const colorClass = getNodeColor(type);
  const icon = getNodeIcon(type);

  // Determine the appropriate reference label based on node id and type
  const getReferenceLabel = () => {
    if (id === "ciaInvestigation" || id === "courierNetwork") {
      return "Reference: Courier Report";
    } else if (id === "people" || id === "tapedMessages") {
      return "Reference: Intel Report";
    } else if (type === "events") {
      return "Reference: Timeline Report";
    }
    return "View Document";
  };
  
  // Get futuristic background gradient based on node type
  const getGradientStyle = () => {
    switch (type) {
      case 'events':
        return 'bg-gradient-to-br from-orange-400/20 to-orange-600/20 border-orange-500';
      case 'people':
        return 'bg-gradient-to-br from-blue-400/20 to-blue-600/20 border-blue-500';
      case 'documents':
        return 'bg-gradient-to-br from-green-400/20 to-green-600/20 border-green-500';
      case 'similar':
        return 'bg-gradient-to-br from-purple-400/20 to-purple-600/20 border-purple-500';
      default:
        return 'bg-gradient-to-br from-gray-400/20 to-gray-600/20 border-gray-500';
    }
  };
  
  // Get glow color for hover and focus effects
  const getGlowColor = () => {
    switch (type) {
      case 'events':
        return 'hover:shadow-orange-500/30';
      case 'people':
        return 'hover:shadow-blue-500/30';
      case 'documents':
        return 'hover:shadow-green-500/30';
      case 'similar':
        return 'hover:shadow-purple-500/30';
      default:
        return 'hover:shadow-gray-500/30';
    }
  };

  // Get text color based on node type
  const getTextColor = () => {
    switch (type) {
      case 'events':
        return 'text-orange-200';
      case 'people':
        return 'text-blue-100';
      case 'documents':
        return 'text-green-100';
      case 'similar':
        return 'text-purple-100';
      default:
        return 'text-gray-100';
    }
  };

  return (
    <div className={`min-w-[280px] max-w-[350px] p-5 rounded-lg backdrop-blur-sm ${getGradientStyle()} border-[1px] shadow-lg ${getGlowColor()} hover:shadow-xl transition-all duration-300 ${getTextColor()} relative overflow-hidden`}>
      {/* Futuristic accent corner */}
      <div className="absolute -top-2 -right-2 w-12 h-12 rotate-45 bg-gradient-to-b from-white/20 to-transparent"></div>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2"
      />

      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <div className="mr-3 bg-white/10 p-2 rounded-full">{icon}</div>
          <h3 className="text-lg font-bold backdrop-blur-sm text-white drop-shadow-sm">{data.label}</h3>
        </div>
        
        <p className="text-base mb-3 backdrop-blur-sm drop-shadow-sm font-medium">{data.description}</p>
        
        {id === "people" && (
          <div className="mb-3 overflow-hidden rounded-md border-[1px] backdrop-blur-sm relative">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-blue-900/20 pointer-events-none"></div>
            <Image 
              src="/images/osama.png" 
              alt="Osama Bin Laden" 
              width={280} 
              height={180} 
              className="w-full h-auto object-cover opacity-90"
            />
            <div className="absolute bottom-2 right-2 flex space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse delay-100"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse delay-200"></div>
            </div>
          </div>
        )}
        
        {id === "tapedMessages" && (
          <>
            <div className="mb-3 overflow-hidden rounded-md border-[1px] backdrop-blur-sm relative">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-blue-900/20 pointer-events-none"></div>
              <Image 
                src="/images/voice.png" 
                alt="Bin Laden Taped Message" 
                width={280} 
                height={160} 
                className="w-full h-auto object-cover opacity-90"
              />
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs text-blue-200 border-[0.5px] border-blue-400/50 flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse mr-1.5"></div>
                INTEL·CLASSIFIED
              </div>
            </div>
            
            {/* Futuristic MP3 Player UI */}
            <div className="mb-3 bg-black/50 backdrop-blur-lg border-[1px] border-blue-500/50 rounded-md p-3 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              
              <div className="flex items-center mb-3">
                <button className="w-10 h-10 bg-blue-500/90 hover:bg-blue-600/90 text-white rounded-md flex items-center justify-center relative group transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-blue-600/50"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <div className="absolute inset-0 bg-blue-500/70 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-md"></div>
                </button>
                
                <div className="ml-3 flex flex-col">
                  <div className="text-xs font-mono text-blue-100 tracking-wider flex items-center">
                    <span className="bg-black/50 px-1.5 py-0.5 rounded-sm">01:24</span>
                    <span className="mx-1 opacity-70">/</span>
                    <span className="opacity-90">03:42</span>
                  </div>
                  <div className="text-xs text-blue-200 font-mono mt-0.5">
                    FREQ: 1.25kHz
                  </div>
                </div>
                
                <div className="ml-auto flex items-center space-x-2">
                  <div className="flex flex-col items-end">
                    <div className="flex space-x-0.5">
                      <div className="w-0.5 h-2 bg-blue-400 animate-pulse"></div>
                      <div className="w-0.5 h-3 bg-blue-400 animate-pulse delay-100"></div>
                      <div className="w-0.5 h-2 bg-blue-400 animate-pulse delay-300"></div>
                      <div className="w-0.5 h-4 bg-blue-400 animate-pulse delay-150"></div>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="relative w-full h-2 bg-blue-900/50 rounded-full overflow-hidden mb-2">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-800/30 to-blue-600/30"></div>
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-300 rounded-full" style={{ width: '37%' }}></div>
                <div className="absolute h-full w-1 bg-white/90 rounded-full" style={{ left: '37%' }}></div>
                
                {/* Decorative time markers */}
                <div className="absolute top-0 left-1/4 h-1/2 w-px bg-blue-300/50"></div>
                <div className="absolute top-0 left-2/4 h-1/2 w-px bg-blue-300/50"></div>
                <div className="absolute top-0 left-3/4 h-1/2 w-px bg-blue-300/50"></div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="text-blue-100 font-mono tracking-wider">Oct 2004 Bin Laden Message</div>
                <div className="px-1.5 rounded border border-blue-500/50 text-blue-200 font-mono text-[10px] tracking-wider">INTEL·PRIME</div>
              </div>
            </div>
          </>
        )}
        
        {id === "cctvFootages" && (
          <div className="mb-3 overflow-hidden rounded-md border-[1px] backdrop-blur-sm relative">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-purple-900/20 pointer-events-none"></div>
            <Image 
              src="/images/cctv.png" 
              alt="CCTV Footage" 
              width={280} 
              height={160} 
              className="w-full h-auto object-cover opacity-90"
            />
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs text-purple-200 border-[0.5px] border-purple-400/50 flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse mr-1.5"></div>
              VISUAL·EVIDENCE
            </div>
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs text-purple-200 font-mono">
              09.11.2001 · 07:15AM
            </div>
          </div>
        )}
        
        {id === "fingerprints" && (
          <div className="mb-3 overflow-hidden rounded-md border-[1px] backdrop-blur-sm relative">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-purple-900/20 pointer-events-none"></div>
            <Image 
              src="/images/fingerprint.png" 
              alt="Fingerprint Evidence" 
              width={280} 
              height={160} 
              className="w-full h-auto object-cover opacity-90"
            />
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs text-purple-200 border-[0.5px] border-purple-400/50 flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse mr-1.5"></div>
              FORENSIC·DATA
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-purple-200 font-mono border-[0.5px] border-purple-400/20">
              MATCH: 99.8% · CONFIRMED
            </div>
          </div>
        )}
        
        {(type === 'events' || type === 'similar' || type === 'people') && data.reference && (
          <a 
            href={data.reference} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-white hover:text-opacity-90 mb-3 inline-flex items-center px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors border-[0.5px] border-white/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {getReferenceLabel()}
          </a>
        )}
        
        <Button
          onClick={data.onDetails}
          variant="outline"
          size="sm"
          className="self-end mt-2 backdrop-blur-sm bg-white/20 hover:bg-white/30 border-[0.5px] border-white/50 text-white"
        >
          See Details
        </Button>
      </div>
    </div>
  );
} 