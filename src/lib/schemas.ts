import { z } from 'zod';

/**
 * Validations for the Tacit Knowledge Graph
 * 
 * Factory Rule #4: All inputs MUST be verified using strict Zod schemas. 
 * TypeScript alone is not enough; we enforce strict runtime schemas.
 */

// Schema mapping the context of the world at the time of an expert's decision.
export const DecisionContextSchema = z.object({
  environmentId: z.string().uuid(),
  variables: z.record(z.unknown()).describe("The exact data state visible to the user"),
  confidenceScore: z.number().min(0).max(100).optional(),
});

// Schema for when an expert overrides the AI recommendation.
export const OverrideActionSchema = z.object({
  actionId: z.string().uuid(),
  expertId: z.string(),
  reasoningPayload: z.string().min(10, "Heuristic reasoning must be at least 10 chars"),
  timestamp: z.string().datetime(),
});

// The final codified Knowledge Node that the AI queries later.
export const HeuristicNodeSchema = z.object({
  nodeId: z.string().uuid(),
  context: DecisionContextSchema,
  override: OverrideActionSchema,
  derivedRule: z.string().describe("The computable rule passed to AI downstream"),
});

// Types exported for typescript enforcement
export type DecisionContext = z.infer<typeof DecisionContextSchema>;
export type OverrideAction = z.infer<typeof OverrideActionSchema>;
export type HeuristicNode = z.infer<typeof HeuristicNodeSchema>;
