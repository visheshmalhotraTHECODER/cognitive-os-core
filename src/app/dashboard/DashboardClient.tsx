'use client';

import { motion } from 'framer-motion';
import { KnowledgeGraph } from '@/components/graph/KnowledgeGraph';
import { BrainCircuit, Zap } from 'lucide-react';

interface DbNode {
  nodeId: string;
  context: { environmentId: string; variables: Record<string, unknown>; confidenceScore?: number | null };
  override: { expertId: string; reasoningPayload: string; timestamp: string; actionId: string };
  derivedRule: string;
}

export function DashboardClient({ dbNodes }: { dbNodes: DbNode[] }) {
  const latest = dbNodes[dbNodes.length - 1];

  return (
    <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden">

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-80 h-full border-r border-white/10 bg-zinc-950/50 backdrop-blur-3xl z-10 flex flex-col p-6"
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-200">
            Cognitive.OS
          </h2>
          <p className="text-xs text-zinc-500 font-medium tracking-widest mt-1 uppercase">Tacit Query Engine</p>
        </div>

        <div className="space-y-6 flex-1">
          {/* Live DB Stats */}
          <div>
            <h3 className="text-xs text-zinc-400 uppercase font-semibold mb-3">Knowledge Graph</h3>
            <div className="p-3 bg-orange-950/20 border border-orange-900/30 rounded-lg flex items-center gap-3">
              <BrainCircuit className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <p className="text-lg font-bold text-orange-300">{dbNodes.length}</p>
                <p className="text-[10px] text-zinc-500">Codified heuristic nodes in SQLite</p>
              </div>
            </div>
          </div>

          {/* Latest Rule from DB */}
          {latest && (
            <div>
              <h3 className="text-xs text-zinc-400 uppercase font-semibold mb-3">Latest Extracted Rule</h3>
              <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-zinc-500">{latest.override.expertId}</span>
                  <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">Live DB</span>
                </div>
                <p className="text-xs text-zinc-300 leading-snug font-mono">{latest.derivedRule}</p>
                <p className="text-[10px] text-zinc-600">{latest.override.reasoningPayload.slice(0, 80)}...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {dbNodes.length === 0 && (
            <div className="p-4 border border-dashed border-zinc-800 rounded-xl text-center">
              <Zap className="w-5 h-5 text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">No heuristics yet.</p>
              <a href="/simulator" className="text-xs text-orange-400 hover:underline mt-1 block">Run the Simulator →</a>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <a href="/simulator" className="block w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-semibold text-sm rounded-lg transition-colors text-center">
            + Capture New Intent
          </a>
        </div>
      </motion.aside>

      {/* Main Graph Area */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex-1 relative"
      >
        <KnowledgeGraph dbNodes={dbNodes} />
      </motion.main>

    </div>
  );
}
