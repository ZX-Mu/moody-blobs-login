# Story 2.1: MouseContext 与 useMouseTracker Hook

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want a global mouse position context and hook,
so that all character components can consume normalized mouse coordinates without duplicating event listeners.

## Acceptance Criteria

1. **Given** the app is running **When** `MouseContext.tsx` and `useMouseTracker.ts` are implemented **Then** a single `mousemove` event listener is registered at the document level **And** mouse position is normalized to range `-1` to `1` relative to viewport center (x: left=-1, right=+1; y: top=-1, bottom=+1).

2. **Given** `MouseProvider` wraps the app **When** any character component calls `useMousePosition()` **Then** it receives the current normalized `{ x, y }` mouse coordinates **And** no additional event listeners are created per component.

3. **Given** the mouse is not moving **When** the page loads **Then** the default mouse position is `{ x: 0, y: 0 }` (center).

4. **Given** the context is implemented **When** inspected **Then** `MouseContext.tsx` is in `src/context/`, `useMouseTracker.ts` is in `src/hooks/` **And** `MouseProvider` wraps the app in `main.tsx` (outside `App`).

## Tasks / Subtasks

- [x] Task 1: Create `src/context/MouseContext.tsx` (AC: #1, #2, #3, #4)
  - [x] Define `MousePosition` type: `{ x: number; y: number }`
  - [x] Create `MouseContext` with `createContext<MousePosition>({ x: 0, y: 0 })`
  - [x] Implement `MouseProvider` component: registers ONE `mousemove` listener on `document`, normalizes to `-1..1`, stores via `useState`
  - [x] Remove `mousemove` listener on unmount (useEffect cleanup)
  - [x] Export `useMousePosition` hook: `() => useContext(MouseContext)`

- [x] Task 2: Create `src/hooks/useMouseTracker.ts` (AC: #2)
  - [x] Export `useMouseTracker` hook that returns the raw `MousePosition` from `MouseContext`
  - [x] This is a thin wrapper — all logic lives in `MouseProvider`, not this hook

- [x] Task 3: Wrap app with `MouseProvider` in `main.tsx` (AC: #2, #4)
  - [x] Import `MouseProvider` in `main.tsx`
  - [x] Wrap `<App />` with `<MouseProvider>` (no other changes to App.tsx)

- [x] Task 4: Verify and build (AC: #1–4)
  - [x] Run `npm run build` — 0 TypeScript errors
  - [x] Confirm `useMousePosition()` returns `{ x: 0, y: 0 }` on load

## Dev Notes

### Critical Architecture Constraints

- **Single event listener:** The `mousemove` listener lives ONLY in `MouseProvider`. No character component, no hook, no other component adds its own `mousemove` listener. This is the core contract of this story.
- **No props on character components:** Characters still accept NO props after this story. Mouse data is consumed via `useMousePosition()` context hook only. Do NOT add props to any existing character component.
- **Context-only consumption:** Character components call `useMousePosition()` to read coordinates. They NEVER receive `{ x, y }` as props.
- **`main.tsx` wrapping, not `App.tsx`:** `MouseProvider` wraps at the root level in `main.tsx`. `App.tsx` remains a pure layout component — do NOT add provider logic to App.tsx.
- **No animation in this story:** Story 2.2 adds pupil animation. This story only creates the data pipeline (context + hook). Adding Framer Motion animation to characters is OUT OF SCOPE here.
- **TypeScript strict:** No `any` types. All types explicitly defined.

### Normalization Formula

Mouse position normalization (viewport-center origin, -1 to +1 range):

```ts
const x = (e.clientX / window.innerWidth) * 2 - 1;   // -1 (left) to +1 (right)
const y = (e.clientY / window.innerHeight) * 2 - 1;  // -1 (top) to +1 (bottom)
```

This matches Story 2.2's pupil offset expectations. Story 2.2 will multiply by character-specific weight (1.2×, 1.0×, 0.9×, 0.8×) and a max-pixel clamp.

### Implementation Blueprint

**`src/context/MouseContext.tsx`:**

```tsx
import { createContext, useContext, useState, useEffect } from 'react';

type MousePosition = { x: number; y: number };

const MouseContext = createContext<MousePosition>({ x: 0, y: 0 });

export const MouseProvider = ({ children }: { children: React.ReactNode }) => {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    document.addEventListener('mousemove', handleMove);
    return () => document.removeEventListener('mousemove', handleMove);
  }, []);

  return <MouseContext.Provider value={pos}>{children}</MouseContext.Provider>;
};

export const useMousePosition = () => useContext(MouseContext);
```

**`src/hooks/useMouseTracker.ts`:**

```ts
import { useMousePosition } from '@/context/MouseContext';
export { useMousePosition as useMouseTracker };
```

**`src/main.tsx` changes:** Wrap `<App />` with `<MouseProvider>`:

```tsx
// main.tsx — only change: import MouseProvider and wrap App
import { MouseProvider } from '@/context/MouseContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MouseProvider>
      <App />
    </MouseProvider>
  </StrictMode>,
);
```

### File Structure

**Files to CREATE:**
```
src/
├── context/
│   └── MouseContext.tsx   ← NEW (MouseProvider + useMousePosition)
└── hooks/
    └── useMouseTracker.ts ← NEW (thin re-export of useMousePosition)
```

**Files to MODIFY:**
- `src/main.tsx` — add `MouseProvider` wrapper only

**Files to NOT touch:**
- `src/App.tsx` — layout only, no provider logic
- `src/components/characters/*.tsx` — no changes (animation in Story 2.2)
- `src/components/CharacterStage.tsx` — no changes
- `src/config/animation.ts` — populated in Story 2.2
- `src/context/EmotionContext.tsx` — does not exist yet (Story 3.1)

### Previous Story Intelligence (Stories 1.1–1.3)

**Key Learnings:**
- `@` alias resolves to `src/` — use `@/context/MouseContext` for imports
- `src/context/` and `src/hooks/` directories are EMPTY — this story creates them for the first time
- `main.tsx` currently wraps `<App />` with only `<StrictMode>` — add `<MouseProvider>` inside `<StrictMode>`
- `vite.config.ts` has `base: '/moody-blobs-login/'` — do NOT change
- Framer Motion `^12.4.7` is installed but NOT used in this story
- `npm run build` must pass with 0 TypeScript errors
- Component naming: PascalCase (`MouseProvider`); Hook naming: `use` prefix + PascalCase (`useMousePosition`, `useMouseTracker`)

**Established Patterns:**
- Context triple pattern: `XxxContext` + `XxxProvider` + `useXxx` (same as what EmotionContext will follow in Story 3.1)
- Import from `@/context/...` using `@` alias
- `useEffect` cleanup for event listeners is mandatory

### Architecture Compliance

- Single `mousemove` listener at document level [Source: epics.md § Story 2.1 AC #1]
- Normalized coordinates `-1 to +1` relative to viewport center [Source: epics.md § Story 2.1 AC #1]
- `MouseContext.tsx` in `src/context/`, `useMouseTracker.ts` in `src/hooks/` [Source: architecture.md § "Complete Project Directory Structure"]
- Hook naming: `use` prefix camelCase [Source: architecture.md § "Naming Patterns"]
- No emotion/mouse props on character components [Source: architecture.md § "Enforcement Guidelines"]
- TypeScript, no `any` [Source: architecture.md § "Naming Patterns"]

### References

- MouseContext architecture spec: [Source: architecture.md § "Frontend Architecture — State Management"]
- File location: [Source: architecture.md § "Complete Project Directory Structure"]
- Story AC: [Source: epics.md § Story 2.1]
- Pupil offset formula used in Story 2.2: [Source: epics.md § Story 2.2 AC — "1.2×, 1.0×, 0.9×, 0.8× multipliers"]
- Naming patterns: [Source: architecture.md § "Naming Patterns"]

### Project Structure Notes

**No conflicts detected:**
- `src/context/` and `src/hooks/` directories don't exist yet — no risk of overwriting
- Only `main.tsx` is modified — low-risk, minimal change
- Character components are untouched — no regression risk

**Future Story Dependencies:**
- Story 2.2 will import `useMousePosition()` from `@/context/MouseContext` to add pupil tracking to character components
- Story 3.1 (EmotionContext) will follow the same `XxxContext + XxxProvider + useXxx` pattern established here
- Story 5.1 (focus lock) will add a `FocusContext` or extend `MouseContext` to support locked/tracking modes

## Dev Agent Record

### Agent Model Used

gemini-2.5-pro (Antigravity)

### Debug Log References

No issues encountered. Build passed cleanly on first attempt with 0 TypeScript errors.

### Completion Notes List

- ✅ Task 1: Created `src/context/MouseContext.tsx` — `MousePosition` type, `MouseContext` with default `{ x: 0, y: 0 }`, `MouseProvider` with single `document.addEventListener('mousemove', ...)` in `useEffect` with cleanup, `useMousePosition` hook.
- ✅ Task 2: Created `src/hooks/useMouseTracker.ts` — thin re-export of `useMousePosition` as `useMouseTracker`. No logic here; all logic in `MouseProvider`.
- ✅ Task 3: Updated `src/main.tsx` — imported `MouseProvider` from `@/context/MouseContext` and wrapped `<App />` inside `<MouseProvider>` within `<StrictMode>`. `App.tsx` unchanged.
- ✅ Task 4: `npm run build` completed with 0 TypeScript errors, 39 modules transformed.

### File List

- src/context/MouseContext.tsx (NEW)
- src/context/MouseContext.test.tsx (NEW)
- src/hooks/useMouseTracker.ts (NEW — JSDoc added post-review)
- src/main.tsx (MODIFIED)
- vite.config.ts (MODIFIED — Vitest config added)
- tsconfig.app.json (MODIFIED — vitest/globals types added)
- package.json (MODIFIED — test/coverage scripts added)

### Change Log

- 2026-03-05: Implemented Story 2.1 — Created MouseContext (MouseProvider + useMousePosition hook) and useMouseTracker thin wrapper; wrapped App with MouseProvider in main.tsx. Build: 0 TS errors, 39 modules.
- 2026-03-05: Code review fixes — Installed Vitest + React Testing Library; wrote 6 tests covering default position, normalization at corners/center, single listener, and cleanup on unmount (all pass). Added JSDoc to useMouseTracker.ts clarifying dual hook API. Configured Vitest in vite.config.ts with jsdom environment.

## Senior Developer Review (AI)

**Review Date:** 2026-03-05
**Review Outcome:** Changes Requested (2 Medium, 3 Low)
**Action Items:** 5 total → 5 resolved ✅

### Action Items

- [x] [Med] M1: No test file — task 4 marked [x] but only `npm run build` was run, no assertions [src/context/MouseContext.tsx]
- [x] [Med] M2: Dual hook API ambiguity — `useMousePosition` and `useMouseTracker` both exist, no guidance on which to use [src/hooks/useMouseTracker.ts]
- [x] [Low] L1: No resize handler — `window.innerWidth/Height` read on each mousemove (acceptable), noted for Story 2.2 [src/context/MouseContext.tsx]
- [x] [Low] L2: `MouseContext` not exported — no downstream access via `useContext(MouseContext)` directly (accepted, no impact now)
- [x] [Low] L3: `window.innerWidth = 0` in test environment — handled by explicitly setting `window.innerWidth/Height` in tests
