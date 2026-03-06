# Story 3.1: EmotionContext 全局情绪状态机

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want a global emotion state machine using React Context and useReducer,
so that all character components can reactively respond to form interactions without coupling to the form.

## Acceptance Criteria

1. **Given** the app is running **When** `EmotionContext.tsx` is implemented **Then** it exposes `EmotionState` type: `'idle' | 'typing' | 'password-visible' | 'success'` **And** actions `SET_IDLE`, `SET_TYPING`, `SET_PASSWORD_VISIBLE`, `SET_SUCCESS` are defined.

2. **Given** `EmotionProvider` wraps the app **When** the page loads with no user interaction **Then** the initial emotion state is `'idle'` (FR7).

3. **Given** `EmotionContext` is available **When** any character component calls `useEmotionState()` **Then** it receives the current emotion state **And** character components do NOT accept emotion-related props (context-only consumption).

4. **Given** the LoginForm dispatches an action **When** `SET_TYPING` is dispatched **Then** all character components re-render with the new state **And** state transitions happen within 200-300ms (FR12).

5. **Given** the story is implemented **When** `npm run build` is run **Then** it completes with 0 TypeScript errors **And** `EmotionContext` is the sole, authoritative source for emotion state (no prop drilling, no local state duplicates).

## Tasks / Subtasks

- [x] Task 1: Create `src/context/EmotionContext.tsx` (AC: #1, #2, #3, #4, #5)
  - [x] Import `EmotionState` and `EmotionAction` types from `@/types` (types already exist — see Dev Notes)
  - [x] Implement reducer function: `emotionReducer(state: EmotionState, action: EmotionAction): EmotionState`
    - [x] `SET_IDLE` → `'idle'`; `SET_TYPING` → `'typing'`; `SET_PASSWORD_VISIBLE` → `'password-visible'`; `SET_SUCCESS` → `'success'`
    - [x] Add exhaustive default case that returns current state (no unknown actions throw)
  - [x] Create `EmotionStateContext` (value: `EmotionState`) with initial value `'idle'`
  - [x] Create `EmotionDispatchContext` (value: `React.Dispatch<EmotionAction>`) with no-op default
  - [x] Export `EmotionProvider` component: wraps children with both contexts, initial state `'idle'`
  - [x] Export `useEmotionState()` hook: returns `EmotionState` from `EmotionStateContext`
  - [x] Export `useEmotionDispatch()` hook: returns `Dispatch<EmotionAction>` from `EmotionDispatchContext`
  - [x] Add error guards: both hooks throw if used outside `EmotionProvider`

- [x] Task 2: Integrate `EmotionProvider` into `src/main.tsx` (AC: #2, #3)
  - [x] Import `EmotionProvider` from `@/context/EmotionContext`
  - [x] Wrap `<MouseProvider>` (or its children) with `<EmotionProvider>` — order: `EmotionProvider` wraps `MouseProvider` wraps `App`
  - [x] Confirm no changes to `App.tsx` or `CharacterStage.tsx` are needed (they pass no state down)

- [x] Task 3: Write unit tests for `EmotionContext` (AC: #1, #2, #3, #4)
  - [x] Create `src/context/EmotionContext.test.tsx`
  - [x] Test: initial state is `'idle'`
  - [x] Test: `SET_TYPING` dispatch → state becomes `'typing'`
  - [x] Test: `SET_PASSWORD_VISIBLE` dispatch → state becomes `'password-visible'`
  - [x] Test: `SET_SUCCESS` dispatch → state becomes `'success'`
  - [x] Test: `SET_IDLE` dispatch → state returns to `'idle'` from other states
  - [x] Test: `useEmotionState()` used outside provider throws descriptive error
  - [x] Minimum 6 tests

- [x] Task 4: Verify build and run-time (AC: #5)
  - [x] Run `npm run build` — 0 TypeScript errors
  - [x] Run `npm test` — all existing tests pass, new tests pass
  - [x] Manually confirm dev server starts and mouse tracking still works (no regression)

## Dev Notes

### 🚨 Critical: Types Already Exist — Do NOT Redefine

`EmotionState` and `EmotionAction` types are **already defined** in `src/types/index.ts`:

```ts
// src/types/index.ts (ALREADY EXISTS — do not modify unless explicitly needed)
export type EmotionState = 'idle' | 'typing' | 'password-visible' | 'success';

export type EmotionAction =
  | { type: 'SET_IDLE' }
  | { type: 'SET_TYPING' }
  | { type: 'SET_PASSWORD_VISIBLE' }
  | { type: 'SET_SUCCESS' };
```

`EmotionContext.tsx` must **import** from `@/types`, not redefine these types locally.

### Architecture: Two-Context Pattern (Split State + Dispatch)

Use the **split context** pattern (separate contexts for state and dispatch) to prevent unnecessary re-renders. Components that only dispatch should not re-render on state changes.

```ts
// Two separate contexts — REQUIRED PATTERN
const EmotionStateContext = createContext<EmotionState>('idle');
const EmotionDispatchContext = createContext<Dispatch<EmotionAction>>(() => {});
```

This mirrors the pattern used in `MouseContext.tsx` where a single context provides position. Here we split because dispatch consumers (LoginForm) should not re-render when state changes.

### Complete Implementation Blueprint

**`src/context/EmotionContext.tsx`:**

```tsx
import { createContext, useContext, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { EmotionState, EmotionAction } from '@/types';

// Split context pattern: prevents unnecessary re-renders in dispatch-only consumers
const EmotionStateContext = createContext<EmotionState | null>(null);
const EmotionDispatchContext = createContext<Dispatch<EmotionAction> | null>(null);

function emotionReducer(state: EmotionState, action: EmotionAction): EmotionState {
  switch (action.type) {
    case 'SET_IDLE':            return 'idle';
    case 'SET_TYPING':          return 'typing';
    case 'SET_PASSWORD_VISIBLE': return 'password-visible';
    case 'SET_SUCCESS':         return 'success';
    default:                    return state;
  }
}

export const EmotionProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(emotionReducer, 'idle');
  return (
    <EmotionStateContext.Provider value={state}>
      <EmotionDispatchContext.Provider value={dispatch}>
        {children}
      </EmotionDispatchContext.Provider>
    </EmotionStateContext.Provider>
  );
};

/**
 * Returns the current emotion state. Must be used inside EmotionProvider.
 * Used by character components to read current emotion and render accordingly.
 */
export const useEmotionState = (): EmotionState => {
  const ctx = useContext(EmotionStateContext);
  if (ctx === null) throw new Error('useEmotionState must be used inside EmotionProvider');
  return ctx;
};

/**
 * Returns the dispatch function. Must be used inside EmotionProvider.
 * Used by LoginForm (and future input components) to trigger emotion changes.
 */
export const useEmotionDispatch = (): Dispatch<EmotionAction> => {
  const ctx = useContext(EmotionDispatchContext);
  if (ctx === null) throw new Error('useEmotionDispatch must be used inside EmotionProvider');
  return ctx;
};
```

**`src/main.tsx` — updated provider order:**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { MouseProvider } from '@/context/MouseContext';
import { EmotionProvider } from '@/context/EmotionContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EmotionProvider>
      <MouseProvider>
        <App />
      </MouseProvider>
    </EmotionProvider>
  </StrictMode>,
);
```

> **Provider order reasoning:** `EmotionProvider` is outermost because LoginForm (in Epic 4) dispatches from inside `App`. `MouseProvider` stays inner since it only provides mouse coordinates. Neither depends on the other.

### 🚨 What This Story Does NOT Do

This story creates the **infrastructure only** — the plumbing. Character components will still render identically in all emotion states after this story. The visual animations are wired up in Stories 3.2, 3.3, and 3.4. Do NOT add any animation code or consume `useEmotionState()` in character components in this story.

Similarly, `LoginForm.tsx` does not dispatch any actions in this story. Story 4.1 wires up the dispatch.

### Characters.ts TODO — Paths for Story 3.x

The `src/config/characters.ts` file has a `TODO` comment listing all the emotion paths needed for Stories 3.2–3.4. Story 3.1 does NOT add these — they belong to their respective stories.

### `@` Alias Resolution

The `@` alias resolves to the **project root** (not `src/`), via `vite.config.ts`:
```ts
resolve: { alias: { '@': path.resolve(__dirname, '.') } }
```
So `@/types` resolves to `/path/to/moody-blobs-login/types/` — but `src/types/index.ts` is under `src/`. Use `@/src/types` if needed, or verify the alias resolves. **Check the existing MouseContext import pattern** (`@/context/MouseContext` used in character components) to confirm the correct alias path before writing imports.

> **Correction note:** Looking at existing files, `main.tsx` imports `@/context/MouseContext` and character components import `@/context/MouseContext` and `@/config/animation`. Given `vite.config.ts` sets `'@': path.resolve(__dirname, '.')` (project root, not `src/`), the existing pattern implies `src/` is the actual root of the `@` alias OR `__dirname` is `src/`. Verify by checking what the existing `@/context/MouseContext` maps to (it maps to `src/context/MouseContext.tsx`). So `@/types` maps to `src/types/index.ts`. ✅

### Animation Timing Requirement

FR12 specifies 200-300ms transition. This story only sets up the state machine — no animation code here. The 200-300ms timing will be enforced in Stories 3.2–3.4 via Framer Motion `transition.duration`. However, the `animationConfig` object in `src/config/animation.ts` should have an `emotionTransition` section added for upcoming stories. **Optional but recommended:** Add a placeholder comment in `animation.ts` for Story 3.2's use:

```ts
// TODO Story 3.2 — add emotionTransition config:
// emotionTransition: { duration: 0.25, ease: 'easeInOut' }  // FR12: 200-300ms
```

### Testing Pattern — Follow MouseContext.test.tsx

The existing `src/context/MouseContext.test.tsx` (6 tests, all passing) establishes the test pattern with `@testing-library/react`. Follow the same pattern:
- Use `renderHook` with a custom wrapper providing `EmotionProvider`
- Use `act()` to trigger dispatch
- Verify state changes via `result.current`

### Previous Story Intelligence (Stories 2.1 & 2.2)

**Established patterns to follow:**
- `@` alias path convention: `@/context/...`, `@/config/...`, `@/types`
- TypeScript strict: no `any` types, all types explicitly defined
- JSDoc comments on exported hooks are expected (code reviewers noted this positively)
- Test file colocation: `src/context/EmotionContext.test.tsx` (alongside the context file)
- Build must pass 0 TS errors before story is complete
- `main.tsx` currently only wraps with `<MouseProvider>` — this story adds `<EmotionProvider>`

**Key learnings from 2.2 code review:**
- JSDoc + comment blocks on hooks are valued
- Test coverage is expected — reviewers flagged lack of tests in 2.1 as medium severity
- This story MUST have tests from the start

### Git Intelligence (Recent Commits)

- `bf93c9b (HEAD)` — feat: 初步形象设计交互（bmad epic2-2）: Added Framer Motion pupil tracking to all 4 character components. Populated `animation.ts` config.
- `895d6d0` — refactor(layout): fix code review issues in CharacterStage

The current codebase state:
- `src/context/MouseContext.tsx` — complete ✅
- `src/context/EmotionContext.tsx` — **DOES NOT EXIST** (this story creates it)
- `src/types/index.ts` — complete ✅ (EmotionState and EmotionAction already defined)
- `src/config/animation.ts` — has pupilTracking, characterWeights, pupilMaxOffset
- `src/config/characters.ts` — has only `idle` paths (emotion paths in 3.x)
- All 4 character components — have Framer Motion pupil tracking via `motion.circle`

### Architecture Compliance

- Context + useReducer for emotion state machine [Source: architecture.md § "State Management: React Context + useReducer"]
- Emotion state: `'idle' | 'typing' | 'password-visible' | 'success'` [Source: architecture.md § "Frontend Architecture"]  
- Actions: `SET_IDLE`, `SET_TYPING`, `SET_PASSWORD_VISIBLE`, `SET_SUCCESS` [Source: architecture.md § "EmotionContext Action 命名"]
- Character components consume via context only, no emotion props [Source: architecture.md § "Communication Patterns"]
- `EmotionContext.tsx` in `src/context/` [Source: architecture.md § "Complete Project Directory Structure"]
- `useEmotionState` hook exported (hook naming: `use` prefix + PascalCase) [Source: architecture.md § "Naming Patterns"]

### Project Structure Notes

**Files to CREATE:**
```
src/
└── context/
    ├── EmotionContext.tsx        ← NEW: EmotionProvider + useEmotionState + useEmotionDispatch
    └── EmotionContext.test.tsx   ← NEW: ≥6 tests
```

**Files to MODIFY:**
```
src/
└── main.tsx                     ← MODIFY: wrap with EmotionProvider (outermost)
```

**Files NOT to touch:**
- `src/types/index.ts` — types already correctly defined, do not redefine
- `src/config/animation.ts` — no emotion animation values yet (that's Stories 3.2-3.4)
- `src/config/characters.ts` — no new paths (Stories 3.2-3.4)
- All 4 character components — do NOT consume `useEmotionState()` yet (Stories 3.2-3.4)
- `src/App.tsx` — no changes
- `src/components/CharacterStage.tsx` — no changes
- `src/components/LoginForm.tsx` — no dispatch yet (Story 4.1)

**No conflicts detected:**
- `EmotionContext.tsx` is a new file, purely additive
- `main.tsx` change is a safe provider wrapping (adds one JSX wrapper, no logic changes)
- No existing components need to change in this story

### References

- EmotionState + EmotionAction types: [Source: src/types/index.ts — already defined]
- State machine architecture: [Source: architecture.md § "Frontend Architecture" — "React Context + useReducer"]
- Action naming convention: [Source: architecture.md § "Communication Patterns"]
- Context placement in directory: [Source: architecture.md § "Complete Project Directory Structure"]
- Naming conventions for hooks/context: [Source: architecture.md § "Naming Patterns"]
- FR6-FR12: [Source: epics.md § "Story 3.1 Acceptance Criteria"]
- 200-300ms transition: [Source: epics.md § Story 3.1 AC #4 — FR12]
- No props rule: [Source: architecture.md § "Enforcement Guidelines"]
- Mouse alias pattern: [Source: src/main.tsx — `@/context/MouseContext`]
- Test pattern: [Source: src/context/MouseContext.test.tsx — 6 tests, renderHook pattern]

## Dev Agent Record

### Agent Model Used

gemini-2.5-pro (Antigravity)

### Debug Log References

### Completion Notes List

- Created `EmotionContext` with state and dispatch split for optimal re-rendering.
- Implemented `useEmotionState` and `useEmotionDispatch` hooks with safety bounds.
- Added comprehensive unit tests for context creation and dispatch behaviors (7 tests).
- Successfully verified 0 TS errors and passing tests locally (25 tests total passed).
- Wrapped App inside `EmotionProvider` in `src/main.tsx`.

### File List

- src/context/EmotionContext.tsx
- src/context/EmotionContext.test.tsx
- src/main.tsx
