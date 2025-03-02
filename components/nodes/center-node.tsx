"use client";

import { Handle, Position } from 'reactflow';

interface CenterNodeProps {
  data: {
    label: string;
    description: string;
  };
}

export default function CenterNode({ data }: CenterNodeProps) {
  return (
    <div className="min-w-[250px] max-w-[300px] p-4 bg-primary text-primary-foreground rounded-lg shadow-lg border-2 border-primary">
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
        <h3 className="text-lg font-bold mb-2">{data.label}</h3>
        <p className="text-sm opacity-90">{data.description}</p>
      </div>
    </div>
  );
} 