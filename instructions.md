# Cognitive.OS - Factory Rules & Constraints

**This repository operates under STRICT "Software Factory" guidelines.**
All code committed here MUST pass the following architectural and security constraints. Zero deviations allowed.

## 1. Technical Stack & Integrity
- **Framework:** Next.js 14+ (App Router). Strict Server Components by default.
- **Language:** TypeScript exactly. `any` types or `@ts-ignore` will result in immediate rejection.
- **Styling:** Tailwind CSS + Vanilla CSS (for layout logic), Framer Motion (for fluid, hardware-accelerated animations), @21st-dev/magic components.
- **Data Mutations:** Next.js Server Actions only. No raw `fetch` exposed on the client.

## 2. Baseline Infrastructure Requirements
Feature development is blocked until the following primitives are verified:
- **Auth Layer:** Strict wrappers on all protected routes.
- **Error Boundaries:** Every module must be wrapped in an Error Boundary. A crash in the Sidebar cannot crash the Knowledge Graph view.
- **Logging/Telemetry:** All overrides and errors must ping a robust logging utility before rendering to the user.

## 3. Atomic Modularity (The 100-Line Rule)
- **Component Limitation:** No React Component file shall exceed 100 lines of functional code. If it does, abstract the logic to a pure function or split the UI.
- **Black-Box Architecture:** Components must not rely on deep contextual spaghetti. Pass explicit, typed props. 

## 4. Security & Schema Validation by Default
- All inputs, whether from the user or the mocked Observer SDK (simulated data streams), MUST be verified using strict `Zod` schemas. 
- Environment variables must be parsed and typed via Zod at startup.

## 5. UI/UX "Pro Max" Philosophy
- The interface must reflect "Enterprise Intelligence". Use dark modes, fluid micro-interactions, and glassmorphism sparingly but effectively.
- Animations must not block the main thread. Hardware-accelerated transforms only.

## 6. Zero-Tolerance for Fake Persistence (The DB Rule)
- RAM-based arrays (e.g. `let MOCK_DB = []`) are strictly banned for final feature merges. 
- Any persistent state must be mapped through Prisma/Drizzle to an actual SQL/Relational engine. Features without proper schema migrations will be rejected.

## 7. Physics-Based Intention (The Telemetry Rule)
- The Observer SDK must not use basic timestamp subtractions. It must calculate multi-vector intent (Cursor Velocity, Path irregularity, precise viewport boundaries). If an event isn't backed by raw physical metrics, it is not "intent", it is just a click.
