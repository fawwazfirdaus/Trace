"use client";

import { Handle, Position } from 'reactflow';
import { Button } from '@/components/ui/button';

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

  return (
    <div className={`min-w-[220px] max-w-[280px] p-4 rounded-lg shadow-md border-2 ${colorClass}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3"
      />

      <div className="flex flex-col">
        <div className="flex items-center mb-2">
          <div className="mr-2">{icon}</div>
          <h3 className="text-md font-bold">{data.label}</h3>
        </div>
        
        <p className="text-sm mb-2">{data.description}</p>
        
        {type === 'events' && data.reference && (
          <a 
            href={data.reference} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline mb-2 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reference: timeline.pdf
          </a>
        )}
        
        <Button
          onClick={data.onDetails}
          variant="outline"
          size="sm"
          className="self-end mt-2"
        >
          See Details
        </Button>
      </div>
    </div>
  );
} 