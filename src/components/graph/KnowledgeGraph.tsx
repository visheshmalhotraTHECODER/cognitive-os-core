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
import { HeuristicNode } from './HeuristicNode';
import { ContextNode } from './ContextNode';
import { RootNode } from './RootNode';

const nodeTypes = {
  heuristic: HeuristicNode,
  context: ContextNode,
  root: RootNode,
};

interface DbNode {
  nodeId: string;
  context: { environmentId: string; variables: Record<string, unknown>; confidenceScore?: number | null };
  override: { expertId: string; reasoningPayload: string; timestamp: string; actionId: string };
  derivedRule: string;
}

function buildGraphFromDb(records: DbNode[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 1. Core Root Node
  nodes.push({
    id: 'root-engine',
    type: 'root',
    position: { x: 500, y: 50 },
    data: {},
  });

  // Group by Environments (Contexts)
  const groupedByEnv: Record<string, DbNode[]> = {};
  records.forEach((rec) => {
    const env = rec.context.environmentId;
    if (!groupedByEnv[env]) groupedByEnv[env] = [];
    groupedByEnv[env].push(rec);
  });

  const envs = Object.keys(groupedByEnv);
  const CONTEXT_Y = 320;
  const CONTEXT_X_SPREAD = 500;

  envs.forEach((envId, envIndex) => {
    // Center contexts relative to root (X: 500)
    const cx = 500 + (envIndex - (envs.length - 1) / 2) * CONTEXT_X_SPREAD;

    nodes.push({
      id: `ctx-${envId}`,
      type: 'context',
      position: { x: cx, y: CONTEXT_Y },
      data: {
        label: `Namespace: ${envId.split('-')[0]}-${envId.substring(0,4)}`,
        details: JSON.stringify(groupedByEnv[envId][0].context.variables, null, 2),
      },
    });

    edges.push({
      id: `e-root-${envId}`,
      source: 'root-engine',
      target: `ctx-${envId}`,
      animated: true,
      style: { stroke: '#0ea5e9', strokeWidth: 2, opacity: 0.5 },
    });

    // 3. Attach Heuristic Nodes under their Context
    const heuristics = groupedByEnv[envId];
    const HEURISTIC_Y = 650;
    const HEURISTIC_X_SPREAD = 380;

    heuristics.forEach((rec, hIndex) => {
      const hx = cx + (hIndex - (heuristics.length - 1) / 2) * HEURISTIC_X_SPREAD;

      nodes.push({
        id: rec.nodeId,
        type: 'heuristic',
        position: { x: hx, y: HEURISTIC_Y + (hIndex % 2 === 0 ? 0 : 80) }, // Staggering
        data: {
          label: rec.derivedRule,
          confidenceScore: rec.context.confidenceScore,
          expertId: rec.override.expertId,
          reasoning: rec.override.reasoningPayload,
        },
      });

      edges.push({
        id: `e-ctx-${rec.nodeId}`,
        source: `ctx-${envId}`,
        target: rec.nodeId,
        animated: false,
        style: { stroke: '#fb923c', strokeWidth: 1.5, opacity: 0.8 },
      });
    });
  });

  return { nodes, edges };
}

export function KnowledgeGraph({ dbNodes }: { dbNodes: DbNode[] }) {
  const { nodes: initialNodes, edges: initialEdges } = buildGraphFromDb(dbNodes);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  useEffect(() => {
    const { nodes: n, edges: e } = buildGraphFromDb(dbNodes);
    setNodes(n);
    setEdges(e);
  }, [dbNodes]);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  return (
    <div className="w-full h-full bg-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        className="touch-none"
        minZoom={0.2}
      >
        <Background color="#3f3f46" gap={32} size={1} />
        <Controls className="bg-zinc-900 border-zinc-800 fill-zinc-400" />
      </ReactFlow>
    </div>
  );
}
