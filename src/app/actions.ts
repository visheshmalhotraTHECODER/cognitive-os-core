'use server'; // Enforces that these functions ONLY run on the server

import { HeuristicNodeSchema } from '@/lib/schemas';
import { logIntent, logError } from '@/lib/telemetry';
import { prisma } from '@/lib/prisma';

/**
 * Server Action: Fetch the Graph from Database
 * Returns actual persisted nodes in the required structure.
 */
export async function getTacitKnowledgeGraph() {
  try {
    const records = await prisma.heuristicNode.findMany();
    
    // Map SQLite flat records back to strict App Interface
    const data = records.map((r) => ({
      nodeId: r.nodeId,
      context: {
        environmentId: r.environmentId,
        variables: JSON.parse(r.variablesData),
        confidenceScore: r.confidenceScore,
      },
      override: {
        actionId: r.actionId,
        expertId: r.expertId,
        reasoningPayload: r.reasoning,
        timestamp: r.overrideTime,
      },
      derivedRule: r.derivedRule,
    }));

    return { success: true, data };
  } catch (err: any) {
    return { success: false, data: [] };
  }
}

/**
 * Server Action: Submit a new Heuristic to Database
 * Validates with Zod, logs intent, and writes to SQLite.
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

    // 3. Database mutation (Real Persistence)
    await prisma.heuristicNode.create({
      data: {
        nodeId: validNode.nodeId,
        environmentId: validNode.context.environmentId,
        variablesData: JSON.stringify(validNode.context.variables),
        confidenceScore: validNode.context.confidenceScore,
        actionId: validNode.override.actionId,
        expertId: validNode.override.expertId,
        reasoning: validNode.override.reasoningPayload,
        overrideTime: validNode.override.timestamp,
        derivedRule: validNode.derivedRule,
      }
    });

    return { success: true, node: validNode };

  } catch (error: any) {
    // Graceful degradation and logging
    logError({
      message: 'Failed to codify heuristic due to validation or DB error',
      level: 'WARN',
      digest: 'ZOD_DB_ERROR'
    });
    
    return { success: false, error: error.message };
  }
}
