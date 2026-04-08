'use client';

import { Handle, Position } from '@xyflow/react';
import { Network } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function RootNode({ selected }: { selected?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center p-6 w-48 h-48 rounded-full border-4 bg-black/90 backdrop-blur-md shadow-2xl transition-all duration-300",
        selected ? "border-white shadow-[0_0_30px_rgba(255,255,255,0.4)] scale-105" : "border-zinc-800"
      )}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/10 to-amber-200/10 animate-pulse" />
      <div className="text-center z-10">
        <Network className="w-10 h-10 text-white mx-auto mb-2 opacity-80" />
        <h2 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-200 uppercase tracking-widest">
          Cognitive Core
        </h2>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-4 h-4 border-2 border-black bg-white" />
    </div>
  );
}
