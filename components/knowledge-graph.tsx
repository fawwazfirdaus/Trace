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
  const centerX = 500; // Increased for more space
  const centerY = 400; // Increased for more space
  const radius = 500; // Increased distance from center to top-level nodes
  const childRadius = 300; // Increased distance from parent to child nodes
  
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
        width: node.id === "people" ? '320px' : '280px', // Increased width for all nodes
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
      style: { stroke: '#ffffff', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#ffffff'
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
            fontSize: '14px',
            width: ["tapedMessages", "cctvFootages", "fingerprints"].includes(childNode.id) ? '300px' : '250px', // Added new nodes to the width condition
            height: 'auto',
            minHeight: '70px',
            zIndex: 10
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
        stroke: '#ffffff',
        strokeWidth: 2 
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#ffffff'
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

  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fullResponse = `The timing sequence of the 9/11 attacks was strategically planned to maximize both physical damage and psychological impact. The 16-minute gap between the first and second World Trade Center strikes was deliberately designed to ensure media coverage of the second impact.

Analysis of the timeline shows several key tactical elements:

1. The 8:46 AM initial strike occurred during peak morning office hours and shift change for emergency personnel
2. The 9:03 AM second strike was timed when maximum media attention was focused on the North Tower
3. The 9:37 AM Pentagon strike targeted the military while response was focused on New York
4. Flight 93's delayed takeoff disrupted the original timing plan, likely contributing to the passenger revolt

Intelligence reports indicate al-Qaeda planned the sequence to overwhelm emergency response capabilities and ensure maximum visibility. The 16-minute window between the first two impacts was specifically referenced in recovered planning documents as the "media window" that would guarantee live television coverage of the second plane.`;

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    
    // Add user message to chat history
    setChatHistory([...chatHistory, inputText]);
    setInputText('');
    setIsLoading(true);
    
    // Simulate initial thinking delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsTyping(true);
    setResponseText('');
    
    // Simulate typing effect
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullResponse.length) {
        setResponseText(prev => prev + fullResponse.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 15); // Typing speed - lower number is faster
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ minHeight: '800px' }}>  
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
        <Background
          variant="dots"
          gap={12}
          size={1}
          color="rgba(255, 255, 255, 0.07)"
        />
        <Controls className="bg-black/20 p-1 backdrop-blur-sm rounded-md border border-white/10" />
      </ReactFlow>

      {chatOpen && selectedNode && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg w-full max-w-4xl h-4/5 p-6 border border-white/10 shadow-2xl shadow-blue-500/10">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-2.5"></div>
                {caseData.nodes.find(n => n.id === selectedNode)?.title}
              </h3>
              <Button variant="outline" onClick={handleCloseChat} className="border-white/20 hover:bg-white/10 text-white hover:text-blue-200 transition-colors">
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100%-4rem)]">
              {/* Summary Panel - Takes 2/3 of the space */}
              <div className="md:col-span-2 bg-black/30 rounded-lg p-6 overflow-y-auto border border-white/10">
                <h4 className="text-lg font-semibold mb-3 text-white">Summary</h4>
                <div className="prose prose-invert prose-headings:text-blue-200 prose-p:text-gray-100 max-w-none">
                  <p className="text-base leading-relaxed text-gray-100">
                    {caseData.nodes.find(n => n.id === selectedNode)?.summary}
                  </p>
                  
                  {/* Additional formatted info based on node type */}
                  {selectedNode === 'events' && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h5 className="font-medium mb-2 text-blue-200">Key Timeline Events:</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-100">
                        <li><span className="font-medium text-orange-300">8:46 AM</span> - Flight 11 crashes into North Tower of World Trade Center</li>
                        <li><span className="font-medium text-orange-300">9:03 AM</span> - Flight 175 crashes into South Tower of World Trade Center</li>
                        <li><span className="font-medium text-orange-300">9:37 AM</span> - Flight 77 crashes into the Pentagon</li>
                        <li><span className="font-medium text-orange-300">9:57 AM</span> - Flight 93 crashes in Shanksville, Pennsylvania</li>
                        <li><span className="font-medium text-orange-300">10:28 AM</span> - North Tower of World Trade Center collapses</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'people' && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h5 className="font-medium mb-2 text-blue-200">Key Intelligence:</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-100">
                        <li><span className="font-medium text-blue-300">October 2004</span> - Audio tape claiming responsibility for 9/11 attacks</li>
                        <li><span className="font-medium text-blue-300">2007</span> - Identification of courier Abu Ahmed al-Kuwaiti</li>
                        <li><span className="font-medium text-blue-300">2010</span> - Tracking of courier to Abbottabad compound</li>
                        <li><span className="font-medium text-blue-300">May 2, 2011</span> - Operation Neptune Spear (bin Laden killed)</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'alQaedaMembers' && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h5 className="font-medium mb-2 text-blue-200">Network Structure:</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-100">
                        <li><span className="font-medium text-green-300">Leadership</span> - Top-level command and decision makers</li>
                        <li><span className="font-medium text-green-300">Operational Planners</span> - Technical specialists and strategists</li>
                        <li><span className="font-medium text-green-300">Facilitators</span> - Financiers and logistical support</li>
                        <li><span className="font-medium text-green-300">Field Operatives</span> - Hijackers and direct actors</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'ksm' && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h5 className="font-medium mb-2 text-blue-200">Key Facts:</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-100">
                        <li>Developed the concept for using aircraft as weapons</li>
                        <li>Personally selected and trained many of the hijackers</li>
                        <li>Captured in Rawalpindi, Pakistan on <span className="text-green-300">March 1, 2003</span></li>
                        <li>Currently held at Guantanamo Bay detention camp</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'atta' && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h5 className="font-medium mb-2 text-blue-200">Key Facts:</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-100">
                        <li>Engineering student in Hamburg, Germany before joining al-Qaeda</li>
                        <li>Entered the US on a valid visa in <span className="text-green-300">June 2000</span></li>
                        <li>Completed flight training in Florida</li>
                        <li>Coordinated the movements of all 19 hijackers</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'alQahtani' && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h5 className="font-medium mb-2 text-blue-200">Key Facts:</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-100">
                        <li>Denied entry at Orlando Airport in <span className="text-green-300">August 2001</span></li>
                        <li>Had <span className="text-green-300">$2,800</span> in cash and suspicious travel patterns</li>
                        <li>Later captured in Afghanistan in <span className="text-green-300">December 2001</span></li>
                        <li>Connected to Mohamed Atta through phone records</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'alKuwaiti' && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h5 className="font-medium mb-2 text-blue-200">Key Facts:</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-100">
                        <li>Real name: <span className="text-green-300">Ibrahim Saeed Ahmed</span></li>
                        <li>Trusted courier who delivered messages for bin Laden</li>
                        <li>Lived in the Abbottabad compound with bin Laden</li>
                        <li>Killed during the Operation Neptune Spear raid in <span className="text-green-300">2011</span></li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'ciaInvestigation' && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h5 className="font-medium mb-2 text-blue-200">Key Intelligence Documents:</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-100">
                        <li><span className="text-purple-300">CIA-DS-2001-0715</span>: Mohammed al-Qahtani US Entry Attempt</li>
                        <li><span className="text-purple-300">NSA-SIGINT-2007-0412</span>: Courier Network Identification</li>
                        <li><span className="text-purple-300">DHS-INT-2004-0927</span>: Bin Laden Tape Analysis</li>
                        <li><span className="text-purple-300">DHS-CRU-2001-0901</span>: Flight 93 Timeline Report</li>
                        <li><span className="text-purple-300">9/11 Commission Report</span> (2004)</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'historical' && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h5 className="font-medium mb-2 text-blue-200">Related Terrorist Activities:</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-100">
                        <li><span className="font-medium text-purple-300">1993</span> - World Trade Center bombing</li>
                        <li><span className="font-medium text-purple-300">1998</span> - US Embassy bombings in Kenya and Tanzania</li>
                        <li><span className="font-medium text-purple-300">2000</span> - USS Cole bombing in Yemen</li>
                        <li><span className="font-medium text-purple-300">2001</span> - 9/11 attacks marking escalation in tactics</li>
                      </ul>
                    </div>
                  )}
                  
                  {selectedNode === 'cctvFootages' && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h5 className="font-medium mb-2 text-blue-200">Key CCTV Evidence:</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-100">
                        <li><span className="font-medium text-purple-300">Portland Airport</span> - Mohamed Atta and Abdul Aziz al-Omari captured on security footage at 5:45 AM on September 11</li>
                        <li><span className="font-medium text-purple-300">Dulles Airport</span> - Five hijackers passing through security checkpoints at 7:18 AM</li>
                        <li><span className="font-medium text-purple-300">Newark Airport</span> - Flight 93 hijackers captured on various cameras between 7:03-7:39 AM</li>
                        <li><span className="font-medium text-purple-300">ATM Machine</span> - Footage of Marwan al-Shehhi withdrawing cash on September 10 at 10:22 PM</li>
                        <li><span className="font-medium text-purple-300">Hotel Security</span> - Several hijackers meeting in hotel lobby in Boston on September 10</li>
                      </ul>
                      
                      <div className="mt-4 p-3 bg-black/30 border border-purple-500/20 rounded-md">
                        <h6 className="text-sm font-medium text-purple-200 mb-2">Technical Analysis Note:</h6>
                        <p className="text-sm text-gray-300">
                          Image enhancement techniques were applied to 73% of recovered footage. Resolution varied significantly between locations, with airport security systems providing the highest quality imagery. Facial recognition algorithms achieved 89% confirmation rate when cross-referenced with known photographs.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedNode === 'fingerprints' && (
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h5 className="font-medium mb-2 text-blue-200">Fingerprint Evidence Collection:</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-100">
                        <li><span className="font-medium text-purple-300">Rental Vehicles</span> - Prints matching 12 hijackers found in 5 different vehicles</li>
                        <li><span className="font-medium text-purple-300">Hotel Rooms</span> - Complete fingerprint sets recovered from rooms in Boston, Newark and Portland</li>
                        <li><span className="font-medium text-purple-300">Training Materials</span> - Partial prints on flight manuals and navigation materials</li>
                        <li><span className="font-medium text-purple-300">ATM Receipts</span> - Prints recovered from cash withdrawal receipts dating August-September 2001</li>
                        <li><span className="font-medium text-purple-300">Identification Documents</span> - Latent prints on forged IDs and supporting documentation</li>
                      </ul>
                      
                      <div className="mt-4 bg-black/30 border border-purple-500/20 rounded-md overflow-hidden">
                        <div className="px-3 py-2 border-b border-purple-500/20 bg-purple-900/20">
                          <h6 className="text-sm font-medium text-purple-200">Match Statistics</h6>
                        </div>
                        <div className="p-3 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400 mb-1">Total Samples</div>
                            <div className="text-gray-100 font-mono">632</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Positive Matches</div>
                            <div className="text-gray-100 font-mono">487 (77.1%)</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Database Hits</div>
                            <div className="text-gray-100 font-mono">19 / 19 Individuals</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Match Confidence</div>
                            <div className="text-purple-200 font-mono">99.8% Average</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Chat Panel - Takes 1/3 of the space */}
              <div className="h-full overflow-hidden border border-white/20 rounded-lg bg-black/40">
                <div className="bg-blue-900/50 px-4 py-2 border-b border-white/20">
                  <h4 className="text-sm font-medium text-white">Ask Questions</h4>
                </div>
                <div className="h-[calc(100%-2.5rem)] overflow-y-auto">
                  {selectedNode === 'events' ? (
                    <div className="p-4 space-y-4">
                      {/* Chat conversation for Timeline - now with state control */}
                      <div className="flex flex-col space-y-4">
                        {/* We'll use React state to control when the conversation appears */}
                        {chatHistory.length > 0 && (
                          <>
                            <div className="self-end max-w-[80%] bg-blue-600/40 backdrop-blur-sm p-3 rounded-lg border border-blue-500/30 text-white">
                              <p className="text-sm">{chatHistory[0]}</p>
                            </div>
                            
                            {(isTyping || responseText) && (
                              <div className="self-start max-w-[90%] bg-gray-800/60 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50 text-gray-100">
                                <div className="flex items-center mb-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse mr-2"></div>
                                  <span className="text-xs font-medium text-blue-300">TRACE AI</span>
                                </div>
                                
                                <div className="text-sm whitespace-pre-line">{responseText}</div>
                                
                                {isTyping && (
                                  <div className="flex mt-1">
                                    <div className="w-1.5 h-1.5 bg-blue-300/50 rounded-full animate-pulse"></div>
                                    <div className="w-1.5 h-1.5 bg-blue-300/50 rounded-full animate-pulse mx-1" style={{ animationDelay: "0.2s" }}></div>
                                    <div className="w-1.5 h-1.5 bg-blue-300/50 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                        
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
                      </div>
                      
                      {/* Input for questions */}
                      <div className={`${chatHistory.length > 0 ? 'border-t border-gray-800 pt-4 mt-4' : ''}`}>
                        <div className="relative">
                          <input 
                            type="text"
                            className="w-full bg-black/30 border border-gray-700 rounded-md py-2 px-4 text-white text-sm placeholder-gray-500"
                            placeholder="Ask a question..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && inputText.trim() !== '') {
                                handleSendMessage();
                              }
                            }}
                            disabled={isLoading}
                          />
                          <button 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
                            onClick={handleSendMessage}
                            disabled={inputText.trim() === '' || isLoading}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ChatInterface nodeId={selectedNode} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 