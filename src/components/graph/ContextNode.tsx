'use client';

import { Handle, Position } from '@xyflow/react';
import { Database, Network } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function ContextNode({ data, selected }: { data: { label: string; details: string }; selected?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex flex-col p-4 w-64 rounded-xl border bg-black/80 backdrop-blur-md shadow-2xl transition-all duration-200",
        selected ? "border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.4)]" : "border-sky-900/50"
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-black bg-zinc-600" />
      
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-sky-950/50 rounded-lg">
          <Database className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Context Entity</span>
          <div className="text-sm text-zinc-100 font-semibold">{data.label}</div>
        </div>
      </div>
      
      <div className="text-[10px] text-zinc-400 font-mono bg-zinc-900/50 p-2 rounded border border-zinc-800">
        {data.details}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-black bg-sky-500" />
    </div>
  );
}
