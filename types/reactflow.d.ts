declare module 'reactflow' {
  import { Component, ComponentType, MouseEvent as ReactMouseEvent, ReactNode } from 'react';

  export type NodeTypes = Record<string, ComponentType<any>>;
  export type EdgeTypes = Record<string, ComponentType<any>>;

  export enum Position {
    Left = 'left',
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
  }

  export enum MarkerType {
    Arrow = 'arrow',
    ArrowClosed = 'arrowclosed',
  }

  export enum ConnectionLineType {
    Bezier = 'bezier',
    Straight = 'straight',
    Step = 'step',
    SmoothStep = 'smoothstep',
  }

  export type Node<T = any> = {
    id: string;
    position: { x: number; y: number };
    data: T;
    type?: string;
    style?: React.CSSProperties;
    className?: string;
    draggable?: boolean;
    selectable?: boolean;
    connectable?: boolean;
  };

  export type Edge<T = any> = {
    id: string;
    source: string;
    target: string;
    type?: string;
    animated?: boolean;
    style?: React.CSSProperties;
    data?: T;
    markerEnd?: {
      type: MarkerType;
      width?: number;
      height?: number;
      color?: string;
    };
  };

  export type ReactFlowProps = {
    nodes: Node[];
    edges: Edge[];
    onNodesChange?: (changes: any) => void;
    onEdgesChange?: (changes: any) => void;
    nodeTypes?: NodeTypes;
    edgeTypes?: EdgeTypes;
    fitView?: boolean;
    attributionPosition?: string;
    connectionLineType?: ConnectionLineType;
    children?: ReactNode;
  };

  export type HandleProps = {
    type: 'source' | 'target';
    position: Position;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
  };

  // Hook types
  export function useNodesState(initialNodes: Node[]): [Node[], React.Dispatch<React.SetStateAction<Node[]>>, (changes: any) => void];
  export function useEdgesState(initialEdges: Edge[]): [Edge[], React.Dispatch<React.SetStateAction<Edge[]>>, (changes: any) => void];

  // Component exports
  export const Handle: ComponentType<HandleProps>;
  export const Background: ComponentType<any>;
  export const Controls: ComponentType<any>;
  export default function ReactFlow(props: ReactFlowProps): JSX.Element;
} 