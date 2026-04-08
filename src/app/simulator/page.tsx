'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ObserverTracker, ObserverTrackerHandle, TelemetryData } from '@/components/telemetry/ObserverTracker';
import { submitHeuristicNode } from '@/app/actions';

export default function SimulatorPage() {
  const trackerRef = useRef<ObserverTrackerHandle>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'extracted'>('idle');
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);

  const handleOverride = async (trackingData: TelemetryData) => {
    setStatus('processing');
    setTelemetry(trackingData);
    const payload = {
      nodeId: crypto.randomUUID(),
      context: {
        environmentId: 'sim-env-001',
        variables: { incoming_loan: '$500k', age: '19', risk_model: 'HIGH_RISK_REJECT' },
        confidenceScore: 12,
      },
      override: {
        actionId: crypto.randomUUID(),
        expertId: 'senior-analyst-alpha',
        reasoningPayload: `Ignored AI: Hesitated for ${trackingData.timeToDecisionMs}ms. Velocity ${trackingData.avgVelocityPxPerSec} px/s. Guarantor A++.`,
        timestamp: new Date().toISOString(),
      },
      derivedRule: 'IF base_risk=high AND guarantor_rating=A++ THEN approve=true',
    };
    const res = await submitHeuristicNode(payload);
    if (res.success) setStatus('extracted');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans flex flex-col items-center justify-center">
      <div className="absolute top-8 left-8 text-xs font-mono text-zinc-500">Live Workspace: Loan Origination</div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-8">Loan Application #891A</h1>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
            <h3 className="text-sm text-zinc-400">Applicant Data</h3>
            <p className="font-mono text-xs">Amount: $500,000</p>
            <p className="font-mono text-xs">Age: 19</p>
            <p className="font-mono text-xs text-green-400">Guarantor: 850 (A++)</p>
          </div>
          <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl space-y-2">
            <h3 className="text-sm text-red-400">🤖 AI Initial Decision</h3>
            <p className="font-mono text-xs text-red-200">Recommendation: REJECT</p>
            <p className="font-mono text-[10px] text-zinc-500">Reason: Age profile high risk for $500k.</p>
          </div>
        </div>

        <ObserverTracker ref={trackerRef} onAction={handleOverride} className="p-6 border border-dashed border-zinc-700 bg-zinc-950 rounded-2xl">
          <h2 className="text-sm font-semibold mb-4 text-zinc-300">Expert Action Required</h2>
          <div className="flex gap-4">
            <button
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition font-medium cursor-pointer"
            >
              Agree with AI (Reject)
            </button>
            <button
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm text-black font-semibold transition cursor-pointer disabled:opacity-50"
              disabled={status !== 'idle'}
              onClick={() => trackerRef.current?.capture()}
            >
              Override & Approve
            </button>
          </div>
        </ObserverTracker>

        {status === 'extracted' && telemetry && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 p-4 bg-green-950/20 border border-green-900/50 rounded-xl overflow-hidden">
            <h3 className="text-green-400 text-sm font-bold mb-2">Intent Captured & Codified ✓</h3>
            <div className="text-xs font-mono text-green-300/80 space-y-1 mb-3">
              <p>[SDK] Time Delta: {telemetry.timeToDecisionMs}ms</p>
              <p>[SDK] Distance Travelled: {telemetry.totalDistancePx} pixels</p>
              <p>[SDK] Avg Velocity: {telemetry.avgVelocityPxPerSec} px/sec</p>
              <p>[SDK] Erratic Indicator Score: {telemetry.erraticPathScore}</p>
            </div>
            <div className="text-xs font-mono text-zinc-400 space-y-1">
              <p>{`> Rule: IF base_risk=high AND guarantor_rating=A++ THEN approve=true`}</p>
              <p>{`> Status: Synced to SQLite Knowledge Graph`}</p>
            </div>
            <a href="/dashboard" className="block mt-4 text-xs font-medium text-orange-400 hover:underline">View Database Vectors →</a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
