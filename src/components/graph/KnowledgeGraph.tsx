'use client';

import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { HeuristicNode } from './HeuristicNode';

// Map custom nodes
const nodeTypes = {
  heuristic: HeuristicNode,
};

const initialNodes: Node[] = [
  {
    id: 'ctx-1',
    type: 'heuristic',
    position: { x: 250, y: 50 },
    data: { label: 'Trading Spike Detected > 200%', isAnomaly: true, confidenceScore: 92 },
  },
  {
    id: 'rule-1',
    type: 'heuristic',
    position: { x: 100, y: 250 },
    data: { label: 'IF client_type = institutional THEN require_manual_review = false', isAnomaly: false },
  },
  {
    id: 'rule-2',
    type: 'heuristic',
    position: { x: 400, y: 250 },
    data: { label: 'IF client_type = retail THEN trigger_fraud_alert = true', isAnomaly: false },
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'ctx-1', target: 'rule-1', animated: true, style: { stroke: '#fb923c' } },
  { id: 'e1-3', source: 'ctx-1', target: 'rule-2', animated: true, style: { stroke: '#ef4444' } },
];

export function KnowledgeGraph() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div style={{ width: '100%', height: '100%' }} className="bg-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        className="touch-none"
      >
        <Background color="#333" gap={24} />
        <Controls className="bg-zinc-900 border-zinc-800 fill-zinc-400" />
      </ReactFlow>
    </div>
  );
}
