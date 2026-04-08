'use client';

import { motion } from 'framer-motion';
import { KnowledgeGraph } from '@/components/graph/KnowledgeGraph';

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden">
      
      {/* Sidebar - Simulated Glassmorphism */}
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
          <div>
            <h3 className="text-xs text-zinc-400 uppercase font-semibold mb-3">Live Telemetry</h3>
            <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-red-200">Anomaly Detected</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-2">ID: env-prod-1</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs text-zinc-400 uppercase font-semibold mb-3">Extracted Protocol</h3>
            <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-zinc-500">Expert Action</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded">Verified</span>
              </div>
              <p className="text-sm text-zinc-300 leading-snug font-medium">
                "Ignored trading spike because institutional client pre-notified."
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <button className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-semibold text-sm rounded-lg transition-colors">
            Deploy Heuristic Rule
          </button>
        </div>
      </motion.aside>

      {/* Main Graph Area */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex-1 relative"
      >
        <KnowledgeGraph />
      </motion.main>
      
    </div>
  );
}
