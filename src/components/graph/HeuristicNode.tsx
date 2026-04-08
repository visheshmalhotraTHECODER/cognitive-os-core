'use client';

import { Handle, Position } from '@xyflow/react';
import { BrainCircuit, AlertTriangle, Fingerprint, Activity, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface HeuristicNodeData {
  label: string;
  confidenceScore?: number | null;
  expertId: string;
  reasoning: string;
}

export function HeuristicNode({ data, selected }: { data: HeuristicNodeData; selected?: boolean }) {
  // Try to parse basic telemetry stats out of the mock string if it exists ("Velocity 340 px/s", "Hesitated for 1900ms")
  const velocityMatch = data.reasoning.match(/Velocity (\d+) px\/s/i);
  const timeMatch = data.reasoning.match(/for (\d+)ms/i);

  const velocity = velocityMatch ? velocityMatch[1] : null;
  const time = timeMatch ? timeMatch[1] : null;

  return (
    <div
      className={cn(
        "relative flex flex-col p-4 w-[320px] rounded-xl border bg-black/90 backdrop-blur-xl shadow-2xl transition-all duration-300",
        selected ? "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] z-50 scale-[1.02]" : "border-zinc-800 hover:border-zinc-700"
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-black bg-zinc-600" />
      
      <div className="flex items-start justify-between mb-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-orange-400" />
          <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
            Rule Extracted
          </span>
        </div>
        {data.confidenceScore && (
          <div className="text-[10px] bg-orange-950/40 border border-orange-900/50 px-2 py-0.5 rounded-sm text-orange-400 font-mono">
            CONF: {data.confidenceScore}%
          </div>
        )}
      </div>

      <div className="text-sm font-mono text-zinc-200 leading-relaxed mb-4 bg-zinc-950 p-2 rounded-lg border border-zinc-900">
        <span className="text-orange-500">{"=> "}</span> {data.label}
      </div>

      <div className="space-y-2 mt-auto">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
          <Fingerprint className="w-3 h-3 text-zinc-600" />
          By: <span className="text-zinc-300">{data.expertId}</span>
        </div>
        
        {(velocity || time) && (
          <div className="flex gap-2 pt-2 border-t border-white/5">
            {time && (
              <div className="bg-zinc-900/50 px-2 py-1 rounded-md flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 flex-1">
                <Clock className="w-3 h-3 text-sky-400" />
                {time}ms
              </div>
            )}
            {velocity && (
              <div className="bg-zinc-900/50 px-2 py-1 rounded-md flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 flex-1">
                <Activity className="w-3 h-3 text-red-400" />
                {velocity} px/s
              </div>
            )}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-black bg-orange-500" />
    </div>
  );
}
