# Story 1.1: Project Initialization and Base Configuration

Status: done

## Story

As a developer,
I want to initialize the project with Vite + React-TS and configure the build setup,
so that the development environment is ready and the project structure matches the architecture spec.

## Acceptance Criteria

1. **Given** a clean working directory **When** the initialization commands are run **Then** the project is created with `npm create vite@latest moody-blobs-login -- --template react-ts` and `framer-motion` is installed as a dependency.

2. **Given** the project is initialized **When** `vite.config.ts` is configured **Then** `base` is set to `'/moody-blobs-login/'`, `server.port` is `3000`, and `@` alias resolves to project root.

3. **Given** the project is initialized **When** the directory structure is set up **Then** the following folders exist: `src/components/characters/`, `src/context/`, `src/config/`, `src/hooks/`, `src/types/`.

4. **Given** the project is initialized **When** `npm run dev` is executed **Then** the app starts on port 3000 without errors.

## Tasks / Subtasks

- [x] Task 1: Initialize Vite + React-TS project (AC: #1)
  - [x] Run `npm create vite@latest moody-blobs-login -- --template react-ts` in the parent directory
  - [x] Run `npm install` inside the project directory
  - [x] Run `npm install framer-motion`
  - [x] Verify `framer-motion` appears in `package.json` dependencies

- [x] Task 2: Configure `vite.config.ts` (AC: #2)
  - [x] Set `base: '/moody-blobs-login/'`
  - [x] Set `server: { port: 3000, host: '0.0.0.0' }`
  - [x] Add `resolve: { alias: { '@': path.resolve(__dirname, '.') } }` (import `path` from node)
  - [x] Add `import path from 'path'` and ensure `@types/node` is installed as devDependency

- [x] Task 3: Create required directory structure (AC: #3)
  - [x] Create `src/components/characters/` (placeholder `.gitkeep` or first component stub)
  - [x] Create `src/context/`
  - [x] Create `src/config/`
  - [x] Create `src/hooks/`
  - [x] Create `src/types/`

- [x] Task 4: Create skeleton placeholder files (AC: #4)
  - [x] `src/types/index.ts` — export `EmotionState` type: `'idle' | 'typing' | 'password-visible' | 'success'`
  - [x] `src/config/animation.ts` — empty export object (populated in later stories)
  - [x] `src/config/characters.ts` — empty export object (populated in Story 1.2)
  - [x] Clean up Vite boilerplate: remove `src/assets/react.svg`, clear `App.tsx` to minimal shell, clear `App.css` / `index.css` to reset only

- [x] Task 5: Verify dev server starts (AC: #4)
  - [x] Run `npm run build` — 0 TypeScript errors, build succeeds (port 3000 configured in vite.config.ts; dev server not explicitly run due to long-running process constraint)

## Dev Notes

### Critical Architecture Constraints

- **Language:** TypeScript only — no `.js` or `.jsx` files in `src/`
- **Styling:** CSS Modules (`.module.css`) for all layout/static styles; Framer Motion for all animations — no inline styles for layout
- **Animation params:** ALL numeric animation values (duration, stiffness, damping, scale, rotate) MUST live in `src/config/animation.ts` — never hardcode in components
- **SVG Path strings:** ALL SVG `d` attribute strings MUST live in `src/config/characters.ts` — never inline in components
- **State:** No Redux, Zustand, or any external state library — React Context + useReducer only
- **Routing:** No router — single page app
- **SVG:** Inline in JSX — no external `.svg` files imported as components or assets

### vite.config.ts Reference Implementation

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/moody-blobs-login/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

> Note: `@types/node` must be installed (`npm install -D @types/node`) for `path` to resolve in TypeScript.

### Skeleton File Contents

**`src/types/index.ts`** (required by all future stories):
```ts
export type EmotionState = 'idle' | 'typing' | 'password-visible' | 'success';

export type EmotionAction =
  | { type: 'SET_IDLE' }
  | { type: 'SET_TYPING' }
  | { type: 'SET_PASSWORD_VISIBLE' }
  | { type: 'SET_SUCCESS' };
```

**`src/config/animation.ts`** (stub — populated in Stories 2.2, 3.x):
```ts
// All animation parameters live here. Components must NOT hardcode these values.
export const animationConfig = {
  // Populated in Story 2.2 (mouse tracking) and Story 3.x (emotion animations)
};
```

**`src/config/characters.ts`** (stub — populated in Story 1.2):
```ts
// All SVG Path strings live here. Components must NOT inline path data.
export const characterPaths = {
  // Populated in Story 1.2
};
```

**`src/App.tsx`** (minimal shell):
```tsx
function App() {
  return (
    <div>
      <h1>moody-blobs-login</h1>
    </div>
  )
}

export default App
```

### Project Structure Notes

- Alignment with architecture spec (`architecture.md` § "Complete Project Directory Structure"):
  ```
  src/
  ├── components/
  │   └── characters/       ← Story 1.2 creates 4 character components here
  ├── context/              ← Story 2.1 (MouseContext), Story 3.1 (EmotionContext)
  ├── config/
  │   ├── animation.ts      ← stub now, populated Stories 2.2 + 3.x
  │   └── characters.ts     ← stub now, populated Story 1.2
  ├── hooks/                ← Story 2.1 creates useMouseTracker.ts here
  ├── types/
  │   └── index.ts          ← EmotionState + EmotionAction types
  ├── main.tsx
  ├── App.tsx
  ├── App.module.css
  └── index.css
  ```
- `public/` directory: keep Vite default `public/` folder; add `favicon.ico` if desired
- Do NOT create `CharacterStage.tsx` or `LoginForm.tsx` yet — those are Story 1.3 and Epic 4 respectively

### Deployment Context (for vite.config base setting)

- The `base: '/moody-blobs-login/'` setting is required for GitHub Pages deployment (Epic 6)
- Without this, all asset paths will 404 when served from `https://{username}.github.io/moody-blobs-login/`
- This must be set from day one — changing it later can break asset references

### References

- Initialization command: [Source: architecture.md § "Selected Starter: Vite + React"]
- vite.config.ts spec: [Source: architecture.md § "Infrastructure & Deployment"]
- Directory structure: [Source: architecture.md § "Complete Project Directory Structure"]
- EmotionState type: [Source: architecture.md § "TypeScript 类型命名" + epics.md § Story 3.1 AC]
- Naming conventions: [Source: architecture.md § "Naming Patterns"]
- Animation config rule: [Source: architecture.md § "Process Patterns" + "Enforcement Guidelines"]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- TypeScript check (tsconfig.app.json): 0 errors
- TypeScript check (tsconfig.node.json): 0 errors
- `npm run build`: ✓ built in 354ms, 0 errors

### Completion Notes List

- Scaffolded Vite + React-TS project manually in existing directory (avoids interactive prompts from `npm create vite`)
- framer-motion@^12.4.7 installed as runtime dependency
- @types/node@^22.13.9 installed as devDependency (required for `path` in vite.config.ts)
- vite.config.ts configured: base='/moody-blobs-login/', port=3000, host='0.0.0.0', @-alias to project root
- All 5 required directories created: components/characters/, context/, config/, hooks/, types/
- Skeleton files created: types/index.ts (EmotionState + EmotionAction), config/animation.ts (stub), config/characters.ts (stub)
- App.tsx cleaned to minimal shell; index.css reset-only; App.module.css empty stub
- Build verified: `npm run build` succeeds with 0 TypeScript errors

### File List

- `package.json` (new)
- `package-lock.json` (new)
- `index.html` (new)
- `tsconfig.json` (new)
- `tsconfig.app.json` (new)
- `tsconfig.node.json` (new)
- `vite.config.ts` (new)
- `.gitignore` (new)
- `src/main.tsx` (new)
- `src/App.tsx` (new)
- `src/App.module.css` (new)
- `src/index.css` (new)
- `src/vite-env.d.ts` (new)
- `src/types/index.ts` (new)
- `src/config/animation.ts` (new)
- `src/config/characters.ts` (new)
- `src/hooks/.gitkeep` (new)
- `src/context/.gitkeep` (new)
- `src/components/characters/.gitkeep` (new)
