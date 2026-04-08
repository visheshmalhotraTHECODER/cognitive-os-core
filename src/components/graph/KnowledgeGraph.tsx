'use client';

import { useCallback, useState, useEffect } from 'react';
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
import { HeuristicNode as HeuristicNodeComponent } from './HeuristicNode';

const nodeTypes = { heuristic: HeuristicNodeComponent };

interface DbNode {
  nodeId: string;
  context: { environmentId: string; variables: Record<string, unknown>; confidenceScore?: number | null };
  override: { expertId: string; reasoningPayload: string; timestamp: string; actionId: string };
  derivedRule: string;
}

function buildGraphFromDb(records: DbNode[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const COLS = 3;
  const X_GAP = 350;
  const Y_GAP = 220;

  records.forEach((rec, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);

    nodes.push({
      id: rec.nodeId,
      type: 'heuristic',
      position: { x: col * X_GAP + 80, y: row * Y_GAP + 50 },
      data: {
        label: rec.derivedRule,
        confidenceScore: rec.context.confidenceScore ?? undefined,
        isAnomaly: false,
      },
    });

    // Chain each node to the previous one sequentially
    if (i > 0) {
      edges.push({
        id: `e-${i}`,
        source: records[i - 1].nodeId,
        target: rec.nodeId,
        animated: true,
        style: { stroke: '#fb923c', strokeWidth: 1.5 },
      });
    }
  });

  return { nodes, edges };
}

interface KnowledgeGraphProps {
  dbNodes: DbNode[];
}

export function KnowledgeGraph({ dbNodes }: KnowledgeGraphProps) {
  const { nodes: initialNodes, edges: initialEdges } = buildGraphFromDb(dbNodes);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  useEffect(() => {
    const { nodes: n, edges: e } = buildGraphFromDb(dbNodes);
    setNodes(n);
    setEdges(e);
  }, [dbNodes]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []
  );

  return (
    <div style={{ width: '100%', height: '100%' }} className="bg-black">
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes} fitView colorMode="dark" className="touch-none"
      >
        <Background color="#222" gap={28} />
        <Controls className="bg-zinc-900 border-zinc-800 fill-zinc-400" />
      </ReactFlow>
    </div>
  );
}
