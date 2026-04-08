'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ObserverTracker } from '@/components/telemetry/ObserverTracker';
import { submitHeuristicNode } from '@/app/actions';

export default function SimulatorPage() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'extracted'>('idle');
  const [telemetry, setTelemetry] = useState<any>(null);

  const handleOverride = async (trackingData: any) => {
    setStatus('processing');
    setTelemetry(trackingData);

    // Formulate the Heuristic Payload for Zod Validation
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
        reasoningPayload: `Ignored AI Reject. Hesitated for ${trackingData.timeToDecisionMs}ms. Guarantor has A++ rating.`,
        timestamp: new Date().toISOString(),
      },
      derivedRule: 'IF base_risk=high AND guarantor_rating=A++ THEN approve=true',
    };

    // Push to Server Action
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
            <h3 className="text-sm text-red-400 flex items-center gap-2">🤖 AI Initial Decision</h3>
            <p className="font-mono text-xs text-red-200">Recommendation: REJECT</p>
            <p className="font-mono text-[10px] text-zinc-500">Reason: Age profile high risk for $500k.</p>
          </div>
        </div>

        {/* Observer Restricted Zone */}
        <ObserverTracker onAction={handleOverride} className="p-6 border border-dashed border-zinc-700 bg-zinc-950 rounded-2xl relative">
          <h2 className="text-sm font-semibold mb-4 text-zinc-300">Expert Action Required</h2>
          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition font-medium">Agree with AI (Reject)</button>
            <button className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm text-black font-semibold transition" disabled={status !== 'idle'}>
              Override & Approve
            </button>
          </div>
        </ObserverTracker>

        {/* Real-time Extraction Feedback */}
        {status === 'extracted' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 p-4 bg-green-950/20 border border-green-900/50 rounded-xl">
            <h3 className="text-green-400 text-sm font-bold mb-2">Intent Captured & Codified</h3>
            <div className="text-xs font-mono text-zinc-400 space-y-1">
              <p>{`> Hesitation: ${telemetry.timeToDecisionMs}ms (Hovers: ${telemetry.hoverCount})`}</p>
              <p>{`> Extracted Rule: IF base_risk=high AND guarantor_rating=A++ THEN approve=true`}</p>
              <p>{`> Synced to Tacit Knowledge Graph.`}</p>
            </div>
            <a href="/dashboard" className="block mt-4 text-xs font-medium text-orange-400 hover:underline">View in Dashboard →</a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
