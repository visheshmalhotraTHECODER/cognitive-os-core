'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { logError } from '@/lib/telemetry';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Ping strict logging telemetry before exposing anything to user layer
    logError({
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      level: 'CRITICAL',
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 border border-red-900/50 bg-red-950/10 rounded-2xl backdrop-blur-sm space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
            <h2 className="text-xl font-semibold tracking-tight text-red-200">System Integrity Compromised</h2>
          </div>
          <p className="text-sm text-zinc-400">
            A fatal error was caught by the Cognitive.OS boundary. Telemetry data has been extracted and logged for structural review.
          </p>
        </div>
        
        <div className="p-4 bg-black/50 border border-zinc-800 rounded-lg overflow-x-auto">
          <code className="text-xs font-mono text-red-400/80">{error.message}</code>
        </div>

        <button
          onClick={() => reset()}
          className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all text-sm font-medium tracking-wide flex items-center justify-center gap-2 group"
        >
          <span>Re-initialize Module</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}
