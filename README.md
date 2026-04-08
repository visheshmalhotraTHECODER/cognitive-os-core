# Cognitive.OS (Core Architecture)

> **WARNING to All Contributors:** This is a zero-trust, God-Tier Enterprise SaaS demonstration shell. We do not tolerate spaghetti code, "any" types, or unvalidated client mutations. Read `instructions.md` before committing.

## What is Cognitive.OS?

Every organization runs on two operating systems:
1. **The Official OS:** Documentation, SOPs, traditional algorithms.
2. **The Real OS:** The cognitive intuition, heuristics, and overrides that senior experts execute when the "Official" process fails.

Cognitive.OS captures **The Real OS**. It is a 3-layer architecture:
- **Layer 1 (Observer SDK):** Physics-based intent telemetry (capturing hesitation, velocity, erratic paths).
- **Layer 2 (Telemetry Extraction Engine):** Context isolation and Zod-verified heuristic generation.
- **Layer 3 (Tacit Knowledge Graph):** Vectorized embedding of "intent rules" queryable by downstream AI Agents via Graph RAG.

## Technical Primitives
- Next.js 14 (Strict App Router / Server Components)
- `zod` for zero-trust data payloads
- `@xyflow/react` for complex rule orchestration
- `framer-motion` for hardware-accelerated UI/UX
- Prisma / PostgreSQL (pgvector compliant)

## Onboarding
```bash
npm install
npm run dev
```

Any code pushed mapping to `submitHeuristicNode` MUST pass through strict telemetry channels. Proceed with caution.
