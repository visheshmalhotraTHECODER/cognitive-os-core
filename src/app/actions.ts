'use server'; // Enforces that these functions ONLY run on the server

import { HeuristicNode, HeuristicNodeSchema } from '@/lib/schemas';
import { logIntent, logError } from '@/lib/telemetry';

/**
 * Mock Database for the Demonstration Shell
 * In a real production environment, this would hook into PostgreSQL (pgvector) or Neo4j.
 */
let MOCK_KNOWLEDGE_GRAPH: HeuristicNode[] = [
  {
    nodeId: 'bba32-4211-1234',
    context: {
      environmentId: 'env-prod-1',
      variables: { anomaly_detected: 'trading_spike_200%', user_risk_profile: 'low' },
      confidenceScore: 92,
    },
    override: {
      actionId: 'act-999',
      expertId: 'senior-underwriter-01',
      reasoningPayload: 'Ignored trading spike because institutional client pre-notified.',
      timestamp: new Date().toISOString(),
    },
    derivedRule: 'IF anomaly=trading_spike AND client_type=institutional THEN require_manual_review=false',
  }
];

/**
 * Server Action: Fetch the Graph
 * Proves that we fetch data securely on the server before sending to client.
 */
export async function getTacitKnowledgeGraph() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    data: MOCK_KNOWLEDGE_GRAPH,
  };
}

/**
 * Server Action: Submit a new Heuristic
 * Validates with Zod, logs intent, and updates the db.
 */
export async function submitHeuristicNode(formData: unknown) {
  try {
    // 1. Zod Validation (Zero-trust)
    const validNode = HeuristicNodeSchema.parse(formData);

    // 2. Telemetry extraction
    logIntent({
      message: 'New heuristic codified by expert',
      context: { expertId: validNode.override.expertId, rule: validNode.derivedRule }
    });

    // 3. Database mutation
    MOCK_KNOWLEDGE_GRAPH.push(validNode);

    return { success: true, node: validNode };

  } catch (error: any) {
    // Graceful degradation and logging
    logError({
      message: 'Failed to codify heuristic due to validation error',
      level: 'WARN',
      digest: 'ZOD_VALIDATION_ERROR'
    });
    
    return { success: false, error: error.message };
  }
}
