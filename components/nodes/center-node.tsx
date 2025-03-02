"use client";

import { Handle, Position } from 'reactflow';
import Image from 'next/image';

interface CenterNodeProps {
  data: {
    label: string;
    description: string;
  };
}

export default function CenterNode({ data }: CenterNodeProps) {
  return (
    <div className="min-w-[450px] max-w-[500px] p-6 bg-primary text-primary-foreground rounded-lg shadow-lg border-2 border-primary">
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="w-3 h-3 !bg-primary-foreground"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 !bg-primary-foreground"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 !bg-primary-foreground"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-3 h-3 !bg-primary-foreground"
      />

      <div className="text-center">
        <h3 className="text-xl font-bold mb-3">{data.label}</h3>
        <p className="text-base opacity-90 mb-4">{data.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="overflow-hidden rounded-md border border-primary-foreground/20">
            <Image 
              src="/images/flightmap.png" 
              alt="Flight Map of 9/11 Attacks" 
              width={200} 
              height={150} 
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-md border border-primary-foreground/20">
            <Image 
              src="/images/twintower.png" 
              alt="Twin Towers" 
              width={200} 
              height={150} 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 