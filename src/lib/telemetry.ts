/**
 * Observer SDK Telemetry Module (Mock)
 * Simulates intent-tracking and error capturing as required by Software Factory Rule #2.
 */

type LogLevel = 'INFO' | 'WARN' | 'CRITICAL' | 'INTENT_OVERRIDE';

interface LogPayload {
  message: string;
  context?: Record<string, unknown>;
  timestamp?: string;
  level: LogLevel;
  digest?: string;
}

export const logError = (payload: Omit<LogPayload, 'timestamp'>) => {
  const log: LogPayload = {
    ...payload,
    timestamp: new Date().toISOString(),
  };
  
  // In a real environment, this dispatches to Datadog/Axiom or similar.
  console.error('[COGNITIVE_OS::TELEMETRY]', JSON.stringify(log, null, 2));
};

export const logIntent = (payload: Omit<LogPayload, 'timestamp' | 'level'>) => {
  const log: LogPayload = {
    ...payload,
    level: 'INTENT_OVERRIDE',
    timestamp: new Date().toISOString(),
  };

  // The Observer SDK logging the human override.
  console.log('[COGNITIVE_OS::INTENT_CAPTURED]', JSON.stringify(log, null, 2));
};
