'use client';

import { Handle, Position } from '@xyflow/react';
import { BrainCircuit, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface HeuristicNodeData {
  label: string;
  confidenceScore?: number;
  isAnomaly?: boolean;
}

export function HeuristicNode({ data, selected }: { data: HeuristicNodeData; selected?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex flex-col p-4 w-64 rounded-xl border bg-black/80 backdrop-blur-md shadow-2xl transition-all duration-200",
        selected ? "border-orange-500 shadow-[0_0_15px_rgba(251,146,60,0.4)]" : "border-zinc-800",
        data.isAnomaly && !selected ? "border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]" : ""
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-black bg-zinc-600" />
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {data.isAnomaly ? (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          ) : (
            <BrainCircuit className="w-4 h-4 text-orange-400" />
          )}
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            {data.isAnomaly ? 'Anomaly Context' : 'Heuristic Rule'}
          </span>
        </div>
        {data.confidenceScore && (
          <div className="text-[10px] bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded-full text-zinc-400">
            {data.confidenceScore}% Conf
          </div>
        )}
      </div>

      <div className="text-sm text-zinc-200 leading-relaxed font-medium">
        {data.label}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-black bg-orange-500" />
    </div>
  );
}
