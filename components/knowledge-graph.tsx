"use client";

import { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  NodeTypes,
  EdgeTypes,
  MarkerType,
  ConnectionLineType,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { ChatInterface } from './chat-interface';

// Define node types
import CenterNode from './nodes/center-node';
import BranchNode from './nodes/branch-node';

// Define node types
const nodeTypes: NodeTypes = {
  center: CenterNode,
  events: BranchNode,
  people: BranchNode,
  documents: BranchNode,
  similar: BranchNode,
};

interface KnowledgeGraphProps {
  caseData: {
    name: string;
    summary: string;
    nodes: {
      id: string;
      type: string;
      title: string;
      summary: string;
    }[];
  };
}

export default function KnowledgeGraph({ caseData }: KnowledgeGraphProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Calculate initial positions
  // Center node in the middle, branch nodes in positions around it
  const centerX = 400;
  const centerY = 300;
  const radius = 250;

  // Prepare nodes
  const initialNodes: Node[] = [
    {
      id: 'center',
      type: 'center',
      position: { x: centerX, y: centerY },
      data: { label: caseData.name, description: caseData.summary },
      draggable: false, // Fixed position for center node
    },
    ...caseData.nodes.map((node, index) => {
      // Calculate position around the circle
      const angle = (index * (2 * Math.PI)) / caseData.nodes.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        id: node.id,
        type: node.type as string,
        position: { x, y },
        data: { 
          label: node.title, 
          description: node.summary,
          onDetails: () => handleNodeDetails(node.id)
        },
        draggable: true, // Branch nodes can be moved
      };
    }),
  ];

  // Prepare edges
  const initialEdges: Edge[] = caseData.nodes.map((node) => ({
    id: `center-to-${node.id}`,
    source: 'center',
    target: node.id,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#555', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeDetails = (nodeId: string) => {
    setSelectedNode(nodeId);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {chatOpen && selectedNode && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-3xl h-3/4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {caseData.nodes.find(n => n.id === selectedNode)?.title} Details
              </h3>
              <Button variant="outline" onClick={handleCloseChat}>
                Close
              </Button>
            </div>
            <ChatInterface nodeId={selectedNode} />
          </div>
        </div>
      )}
    </div>
  );
} 