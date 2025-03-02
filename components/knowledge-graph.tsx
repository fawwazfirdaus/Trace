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
      reference?: string;
      children?: {
        id: string;
        type: string;
        title: string;
        summary: string;
        reference?: string;
        parentId?: string;
      }[];
      parentId?: string;
    }[];
  };
}

export default function KnowledgeGraph({ caseData }: KnowledgeGraphProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Layout constants
  const centerX = 400;
  const centerY = 300;
  const radius = 350; // Distance from center to top-level nodes
  const childRadius = 250; // Distance from parent to child nodes
  
  // Process nodes to get all top-level branches (nodes without parentId)
  const topLevelNodes = caseData.nodes.filter(node => !node.parentId);

  // Create a map of node IDs to their full data for easier reference
  const nodeMap = new Map();
  caseData.nodes.forEach(node => {
    nodeMap.set(node.id, node);
  });
  
  // Create a separate array to track parent-child relationships
  interface Relationship {
    parent: string;
    child: string;
  }
  
  const parentChildRelationships: Relationship[] = [];
  
  // Debug log before relationship creation
  console.log('Processing nodes for relationships:', caseData.nodes);
  
  caseData.nodes.forEach(node => {
    if (node.children && node.children.length > 0) {
      console.log(`Found parent node ${node.id} with ${node.children.length} children`);
      node.children.forEach(child => {
        console.log(`Adding relationship: ${node.id} -> ${child.id}`);
        parentChildRelationships.push({
          parent: node.id,
          child: child.id
        });
      });
    }
  });
  
  // Debug log after relationship creation
  console.log('Created relationships:', parentChildRelationships);
  
  // Prepare nodes and edges
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  
  // Prepare nodes
  initialNodes.push({
    id: 'center',
    type: 'center',
    position: { x: centerX, y: centerY },
    data: { label: caseData.name, description: caseData.summary },
    draggable: false, // Fixed position for center node
  });
  
  // Add top-level nodes
  topLevelNodes.forEach((node, index) => {
    // Calculate position around the circle
    const angle = (index * (2 * Math.PI)) / topLevelNodes.length;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    initialNodes.push({
      id: node.id,
      type: node.type as string,
      position: { x, y },
      data: { 
        label: node.title, 
        description: node.summary,
        onDetails: () => handleNodeDetails(node.id),
        reference: node.reference
      },
      draggable: true, // Branch nodes can be moved
      style: {
        borderRadius: '8px',
        padding: '10px',
        width: '180px',
        fontWeight: node.children?.length ? 'normal' : 'normal'
      }
    });
    
    // Add edges from center to top-level nodes
    initialEdges.push({
      id: `center-to-${node.id}`,
      source: 'center',
      target: node.id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#555', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    });
  });

  // Add child nodes
  topLevelNodes.forEach((parentNode, parentIndex) => {
    if (parentNode.children && parentNode.children.length > 0) {
      // Calculate parent node position (same as above)
      const parentAngle = (parentIndex * (2 * Math.PI)) / topLevelNodes.length;
      const parentX = centerX + radius * Math.cos(parentAngle);
      const parentY = centerY + radius * Math.sin(parentAngle);
      
      // Add child nodes around their parent
      parentNode.children.forEach((childNode, childIndex) => {
        // Calculate the direction vector from center to parent
        const dirX = parentX - centerX;
        const dirY = parentY - centerY;
        const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
        
        // Normalize the direction vector
        const normDirX = dirX / dirLength;
        const normDirY = dirY / dirLength;
        
        // For multiple children, position them in a fan layout pointing outward from parent
        let offsetX = 0;
        let offsetY = 0;
        
        const totalChildren = parentNode.children!.length;
        if (totalChildren > 1) {
          // Calculate spread angle for the fan based on number of children
          const spreadAngle = Math.min(Math.PI / 2, Math.PI / totalChildren); // Max 90 degree spread
          
          // Calculate the perpendicular vector to the direction
          const perpX = -normDirY;
          const perpY = normDirX;
          
          // Position in the fan formation
          const middleIndex = (totalChildren - 1) / 2;
          const angle = (childIndex - middleIndex) * spreadAngle;
          
          // Rotate the direction vector by this angle
          const cosAngle = Math.cos(angle);
          const sinAngle = Math.sin(angle);
          
          // Calculate the offset
          offsetX = (normDirX * cosAngle + perpX * sinAngle) * childRadius;
          offsetY = (normDirY * cosAngle + perpY * sinAngle) * childRadius;
        } else {
          // For a single child, position directly outward from parent
          offsetX = normDirX * childRadius;
          offsetY = normDirY * childRadius;
        }
        
        // Final position
        const childX = parentX + offsetX;
        const childY = parentY + offsetY;
        
        initialNodes.push({
          id: childNode.id,
          type: childNode.type as string,
          position: { x: childX, y: childY },
          data: { 
            label: childNode.title, 
            description: childNode.summary,
            onDetails: () => handleNodeDetails(childNode.id),
            reference: childNode.reference
          },
          draggable: true,
          style: { 
            borderRadius: '8px',
            padding: '10px',
            fontSize: '12px',
            width: '160px',
            height: 'auto',
            minHeight: '60px',
            zIndex: 10 // Make sure child nodes appear on top
          }
        });
      });
    }
  });

  // Now create all parent-child edges after all nodes are created
  parentChildRelationships.forEach(rel => {
    console.log('Creating edge from', rel.parent, 'to', rel.child);
    console.log('Parent node exists:', initialNodes.some(n => n.id === rel.parent));
    console.log('Child node exists:', initialNodes.some(n => n.id === rel.child));
    
    initialEdges.push({
      id: `edge-${rel.parent}-${rel.child}`,
      source: rel.parent,
      target: rel.child,
      type: 'smoothstep',
      animated: true,
      style: { 
        stroke: '#555', 
        strokeWidth: 2 
      },
      markerEnd: {
        type: MarkerType.ArrowClosed
      }
    });
  });

  // Add debug logging for final state
  console.log('All nodes:', initialNodes.map(n => n.id));
  console.log('All edges:', initialEdges.map(e => ({ from: e.source, to: e.target })));

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
          <div className="bg-card rounded-lg w-full max-w-4xl h-4/5 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">
                {caseData.nodes.find(n => n.id === selectedNode)?.title}
              </h3>
              <Button variant="outline" onClick={handleCloseChat}>
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100%-4rem)]">
              {/* Summary Panel - Takes 2/3 of the space */}
              <div className="md:col-span-2 bg-muted/50 rounded-lg p-6 overflow-y-auto">
                <h4 className="text-lg font-semibold mb-3">Summary</h4>
                <div className="prose dark:prose-invert">
                  <p className="text-base leading-relaxed">
                    {caseData.nodes.find(n => n.id === selectedNode)?.summary}
                  </p>
                  
                  {/* Additional formatted info based on node type */}
                  {selectedNode === 'events' && (
                    <div className="mt-6 border-t pt-4">
                      <h5 className="font-medium mb-2">Key Timeline Events:</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><span className="font-medium">8:46 AM</span> - Flight 11 crashes into North Tower of World Trade Center</li>
                        <li><span className="font-medium">9:03 AM</span> - Flight 175 crashes into South Tower of World Trade Center</li>
                        <li><span className="font-medium">9:37 AM</span> - Flight 77 crashes into the Pentagon</li>
                        <li><span className="font-medium">9:57 AM</span> - Flight 93 crashes in Shanksville, Pennsylvania</li>
                        <li><span className="font-medium">10:28 AM</span> - North Tower of World Trade Center collapses</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'people' && (
                    <div className="mt-6 border-t pt-4">
                      <h5 className="font-medium mb-2">Key Intelligence:</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><span className="font-medium">October 2004</span> - Audio tape claiming responsibility for 9/11 attacks</li>
                        <li><span className="font-medium">2007</span> - Identification of courier Abu Ahmed al-Kuwaiti</li>
                        <li><span className="font-medium">2010</span> - Tracking of courier to Abbottabad compound</li>
                        <li><span className="font-medium">May 2, 2011</span> - Operation Neptune Spear (bin Laden killed)</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'alQaedaMembers' && (
                    <div className="mt-6 border-t pt-4">
                      <h5 className="font-medium mb-2">Network Structure:</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><span className="font-medium">Leadership</span> - Top-level command and decision makers</li>
                        <li><span className="font-medium">Operational Planners</span> - Technical specialists and strategists</li>
                        <li><span className="font-medium">Facilitators</span> - Financiers and logistical support</li>
                        <li><span className="font-medium">Field Operatives</span> - Hijackers and direct actors</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'ksm' && (
                    <div className="mt-6 border-t pt-4">
                      <h5 className="font-medium mb-2">Key Facts:</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Developed the concept for using aircraft as weapons</li>
                        <li>Personally selected and trained many of the hijackers</li>
                        <li>Captured in Rawalpindi, Pakistan on March 1, 2003</li>
                        <li>Currently held at Guantanamo Bay detention camp</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'atta' && (
                    <div className="mt-6 border-t pt-4">
                      <h5 className="font-medium mb-2">Key Facts:</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Engineering student in Hamburg, Germany before joining al-Qaeda</li>
                        <li>Entered the US on a valid visa in June 2000</li>
                        <li>Completed flight training in Florida</li>
                        <li>Coordinated the movements of all 19 hijackers</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'alQahtani' && (
                    <div className="mt-6 border-t pt-4">
                      <h5 className="font-medium mb-2">Key Facts:</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Denied entry at Orlando Airport in August 2001</li>
                        <li>Had $2,800 in cash and suspicious travel patterns</li>
                        <li>Later captured in Afghanistan in December 2001</li>
                        <li>Connected to Mohamed Atta through phone records</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'alKuwaiti' && (
                    <div className="mt-6 border-t pt-4">
                      <h5 className="font-medium mb-2">Key Facts:</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Real name: Ibrahim Saeed Ahmed</li>
                        <li>Trusted courier who delivered messages for bin Laden</li>
                        <li>Lived in the Abbottabad compound with bin Laden</li>
                        <li>Killed during the Operation Neptune Spear raid in 2011</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'ciaInvestigation' && (
                    <div className="mt-6 border-t pt-4">
                      <h5 className="font-medium mb-2">Key Intelligence Documents:</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>CIA-DS-2001-0715: Mohammed al-Qahtani US Entry Attempt</li>
                        <li>NSA-SIGINT-2007-0412: Courier Network Identification</li>
                        <li>DHS-INT-2004-0927: Bin Laden Tape Analysis</li>
                        <li>DHS-CRU-2001-0901: Flight 93 Timeline Report</li>
                        <li>9/11 Commission Report (2004)</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'historical' && (
                    <div className="mt-6 border-t pt-4">
                      <h5 className="font-medium mb-2">Related Terrorist Activities:</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><span className="font-medium">1993</span> - World Trade Center bombing</li>
                        <li><span className="font-medium">1998</span> - US Embassy bombings in Kenya and Tanzania</li>
                        <li><span className="font-medium">2000</span> - USS Cole bombing in Yemen</li>
                        <li><span className="font-medium">2001</span> - 9/11 attacks marking escalation in tactics</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Chat Panel - Takes 1/3 of the space */}
              <div className="h-full overflow-hidden border rounded-lg">
                <div className="bg-secondary/30 px-4 py-2 border-b">
                  <h4 className="text-sm font-medium">Ask Questions</h4>
                </div>
                <div className="h-[calc(100%-2.5rem)]">
                  <ChatInterface nodeId={selectedNode} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 