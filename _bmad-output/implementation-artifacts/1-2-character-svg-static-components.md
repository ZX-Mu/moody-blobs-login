# Story 1.2: Four Character SVG Static Components

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to create the four character SVG components with their idle visual appearance,
so that the characters are visually distinct and ready to receive animation in future stories.

## Acceptance Criteria

1. **Given** the project structure is ready (Story 1.1 complete) **When** the four character components are created **Then** `OrangeBlob.tsx`, `PurpleRect.tsx`, `BlackBar.tsx`, `YellowCylinder.tsx` exist in `src/components/characters/` and each has a corresponding `.module.css` file.

2. **Given** each character component is rendered **When** viewed in the browser **Then**:
   - OrangeBlob renders as an orange semicircle shape with eyes and idle mouth `M10,20 Q15,18 20,20` (flat)
   - PurpleRect renders as a purple rectangle with eyes and idle mouth `M10,20 Q15,18 20,20`
   - BlackBar renders as a narrow black bar with eyes and a straight line mouth
   - YellowCylinder renders as a yellow cylinder shape with eyes and a dot mouth

3. **Given** each character component is rendered **When** inspected **Then**:
   - SVG is inlined in JSX (no external SVG files)
   - All SVG Path strings are imported from `src/config/characters.ts`
   - No animation values are hardcoded in components

## Tasks / Subtasks

- [x] Task 1: Populate `src/config/characters.ts` with all idle SVG Path strings (AC: #2, #3)
  - [x] Define `orangeBlob` paths: idle mouth `M10,20 Q15,18 20,20`
  - [x] Define `purpleRect` paths: idle mouth `M10,20 Q15,18 20,20`
  - [x] Define `blackBar` paths: straight line mouth
  - [x] Define `yellowCylinder` paths: dot mouth
  - [x] Export typed `characterPaths` object replacing the stub

- [x] Task 2: Create `OrangeBlob.tsx` + `OrangeBlob.module.css` (AC: #1, #2, #3)
  - [x] Inline SVG: orange semicircle body shape
  - [x] Two eyes (circles/ellipses) with pupils
  - [x] Mouth path imported from `characterPaths.orangeBlob.idle`
  - [x] CSS Module for static sizing/positioning

- [x] Task 3: Create `PurpleRect.tsx` + `PurpleRect.module.css` (AC: #1, #2, #3)
  - [x] Inline SVG: purple rectangle body shape
  - [x] Two eyes with pupils
  - [x] Mouth path imported from `characterPaths.purpleRect.idle`

- [x] Task 4: Create `BlackBar.tsx` + `BlackBar.module.css` (AC: #1, #2, #3)
  - [x] Inline SVG: narrow black bar body shape
  - [x] Two eyes with pupils
  - [x] Straight line mouth imported from `characterPaths.blackBar.idle`

- [x] Task 5: Create `YellowCylinder.tsx` + `YellowCylinder.module.css` (AC: #1, #2, #3)
  - [x] Inline SVG: yellow cylinder body shape
  - [x] Two eyes with pupils
  - [x] Dot mouth imported from `characterPaths.yellowCylinder.idle`

- [x] Task 6: Verify build passes with 0 TypeScript errors
  - [x] Run `npm run build` — confirm 0 errors

## Dev Notes

### Critical Architecture Constraints

- **SVG inline only:** All SVG markup lives inside JSX — no `.svg` files, no `<img src="...svg">`, no `ReactComponent` imports
- **Path strings in config:** Every SVG `d` attribute value MUST be imported from `src/config/characters.ts` — never write path strings inline in components
- **No animation values hardcoded:** This story creates static components; do NOT add Framer Motion `animate` props yet — those come in Stories 2.x and 3.x. You may wrap elements with `motion.*` as a forward-compatible stub, but leave `animate` prop empty/undefined
- **CSS Modules only:** Use `.module.css` for sizing, colors, and positioning. No inline `style={{}}` for layout
- **TypeScript strict:** No `any` types. Use `React.FC` or explicit return type `JSX.Element`

### `src/config/characters.ts` — Required Structure

Replace the stub with a fully typed export. All future stories (3.x emotion animations) will add more path keys to this same object:

```ts
// All SVG Path strings live here. Components must NOT inline path data.
// Future stories will add: typing, passwordVisible, success mouth paths

export const characterPaths = {
  orangeBlob: {
    idle: 'M10,20 Q15,18 20,20',       // flat/slight smile
    // typing, passwordVisible, success added in Story 3.x
  },
  purpleRect: {
    idle: 'M10,20 Q15,18 20,20',       // flat
    // typing: 'M10,20 Q15,25 20,20'   (down curve — added Story 3.2)
    // passwordVisible: 'M10,20 Q12,18 15,20 Q18,22 20,20' (wave — Story 3.3)
    // success: 'M8,18 Q15,25 22,18'   (big smile — Story 3.4)
  },
  blackBar: {
    idle: 'M8,20 L22,20',              // straight line
  },
  yellowCylinder: {
    idle: 'M15,20 m-1,0 a1,1 0 1,0 2,0 a1,1 0 1,0 -2,0', // dot (small circle path)
  },
} as const;

export type CharacterName = keyof typeof characterPaths;
```

> **Note:** The `as const` assertion enables TypeScript to infer literal types for path strings, preventing accidental mutation.

### SVG Component Structure Pattern

Each character follows this exact pattern. Use `OrangeBlob` as the reference:

```tsx
// src/components/characters/OrangeBlob.tsx
import { characterPaths } from '@/config/characters';
import styles from './OrangeBlob.module.css';

const OrangeBlob = () => {
  return (
    <div className={styles.container}>
      <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
        {/* Body: orange semicircle */}
        <ellipse cx="30" cy="55" rx="25" ry="20" fill="#FF8C42" />
        {/* Left eye white */}
        <circle cx="20" cy="35" r="8" fill="white" />
        {/* Left pupil */}
        <circle cx="20" cy="35" r="4" fill="#1a1a1a" />
        {/* Right eye white */}
        <circle cx="40" cy="35" r="8" fill="white" />
        {/* Right pupil */}
        <circle cx="40" cy="35" r="4" fill="#1a1a1a" />
        {/* Mouth — path from config */}
        <path
          d={characterPaths.orangeBlob.idle}
          stroke="#1a1a1a"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default OrangeBlob;
```

> **Important:** The exact SVG coordinates (cx, cy, r values) are yours to design — the above is a starting reference. What MUST be followed: path `d` attribute comes from `characterPaths`, no inline styles for layout, CSS Module for container sizing.

### Character Visual Specs

| Character | Body Shape | Color | Mouth (idle) | Personality |
|-----------|-----------|-------|--------------|-------------|
| OrangeBlob | Semicircle / rounded blob | `#FF8C42` (orange) | `M10,20 Q15,18 20,20` flat | Most expressive (FR13) |
| PurpleRect | Rectangle / tall box | `#7B5EA7` (purple) | `M10,20 Q15,18 20,20` flat | Emotion leader, 4 mouth states (FR14) |
| BlackBar | Narrow vertical bar | `#2D2D2D` (near-black) | `M8,20 L22,20` straight line | Most restrained (FR16) |
| YellowCylinder | Cylinder / oval | `#F5C842` (yellow) | dot (small circle path) | Moderate sensitivity (FR15) |

> Colors are suggestions — adjust to match the visual reference in `docs/*.png` if available.

### Eye/Pupil Structure (Important for Future Stories)

Stories 2.x will add mouse-tracking to pupils. To make that easy, structure eyes as:
- **Eye white:** static `<circle>` or `<ellipse>`
- **Pupil:** separate `<circle>` — this will become `<motion.circle>` in Story 2.2

Keep pupils as distinct elements now so Story 2.2 can simply wrap them with `motion.circle` and add `animate={{ x, y }}`.

### Architecture Compliance

- [x] SVG inline in JSX — no external SVG files [Source: architecture.md § "Enforcement Guidelines"]
- [x] Path strings from `src/config/characters.ts` — no inline `d` values [Source: architecture.md § "Process Patterns"]
- [x] CSS Modules for static styles — no inline `style={{}}` for layout [Source: architecture.md § "Styling: CSS Modules"]
- [x] No Framer Motion `animate` props in this story — animation comes in Stories 2.x/3.x [Source: architecture.md § "Decision Impact Analysis"]
- [x] TypeScript only — no `.js`/`.jsx` files [Source: story 1.1 Dev Notes]
- [x] Components accept no `emotion` or `mouse` props — context-only in future stories [Source: architecture.md § "Architectural Boundaries"]

### Library & Framework Requirements

- **React:** `^18.x` (already installed via Story 1.1)
- **framer-motion:** `^12.4.7` (already installed) — do NOT use `animate` prop yet; may use `motion.*` as wrapper stubs
- **TypeScript:** strict mode — no `any`, use `as const` for config objects
- **CSS Modules:** `.module.css` files — Vite handles module resolution automatically
- **`@` alias:** resolves to project root (configured in `vite.config.ts`) — use `@/config/characters` not relative paths

### File Structure Requirements

Files to CREATE in this story:

```
src/
├── config/
│   └── characters.ts          ← MODIFY: replace stub with full characterPaths export
└── components/
    └── characters/
        ├── OrangeBlob.tsx      ← CREATE
        ├── OrangeBlob.module.css ← CREATE
        ├── PurpleRect.tsx      ← CREATE
        ├── PurpleRect.module.css ← CREATE
        ├── BlackBar.tsx        ← CREATE
        ├── BlackBar.module.css ← CREATE
        ├── YellowCylinder.tsx  ← CREATE
        └── YellowCylinder.module.css ← CREATE
```

Do NOT create or modify:
- `src/components/CharacterStage.tsx` — Story 1.3
- `src/context/` files — Stories 2.1, 3.1
- `src/config/animation.ts` — Stories 2.2, 3.x
- `src/App.tsx` — Story 1.3 will update this

### Testing Requirements

No automated test framework is configured. Manual verification:

1. Import each character component into `App.tsx` temporarily and render all four side by side
2. Open browser at `http://localhost:3000` — confirm all four characters are visible with distinct shapes
3. Inspect DOM — confirm SVG is inline (not `<img>` or `<use>`)
4. Inspect `src/config/characters.ts` — confirm no path strings exist in component files
5. Run `npm run build` — confirm 0 TypeScript errors, build succeeds

### Previous Story Intelligence (Story 1.1)

Key learnings from Story 1.1 that directly impact this story:

- **`src/config/characters.ts` is a stub** — currently exports `export const characterPaths = {}`. Replace the entire file content with the typed structure above.
- **`src/config/animation.ts` is a stub** — do NOT touch it in this story.
- **`src/types/index.ts` has `EmotionState` + `EmotionAction`** — import from here if needed, but this story doesn't need them yet.
- **`@` alias works** — `import { characterPaths } from '@/config/characters'` resolves correctly.
- **`framer-motion@^12.4.7` is installed** — API uses `motion.*` components and `animate` prop. For this story, you may use `motion.g` or `motion.circle` as forward-compatible wrappers but leave `animate` undefined.
- **Build verified clean** — `npm run build` must still pass 0 errors after this story.
- **`.gitkeep` files exist** in `src/components/characters/`, `src/context/`, `src/hooks/` — safe to add files alongside them.

### Project Context Reference

- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- PRD character specs table: `_bmad-output/planning-artifacts/prd.md` § "角色表情规格"
- Epics: `_bmad-output/planning-artifacts/epics.md` § "Story 1.2"
- Visual references: `docs/*.png` (4 screenshots of intended design)

### References

- SVG inline rule: [Source: architecture.md § "Enforcement Guidelines"]
- Path strings in config: [Source: architecture.md § "Process Patterns" — "SVG Path 字符串定义在 src/config/characters.ts"]
- Character mouth paths: [Source: prd.md § "角色表情规格" — idle row]
- CSS Modules rule: [Source: architecture.md § "Styling: CSS Modules"]
- File naming (PascalCase): [Source: architecture.md § "Naming Patterns"]
- No emotion props on character components: [Source: architecture.md § "Architectural Boundaries"]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- `@` alias bug: tsconfig.app.json had `"@/*": ["./*"]` (project root) but files are in `src/`. Fixed to `"@/*": ["src/*"]` and updated vite.config.ts alias to `path.resolve(__dirname, 'src')`.
- `npm run build`: ✓ built in 357ms, 0 TypeScript errors after alias fix.

### Completion Notes List

- `src/config/characters.ts` stub replaced with fully typed `characterPaths` object (`as const`), covering all 4 characters with idle mouth paths. Comments mark where Story 3.x will add typing/passwordVisible/success paths.
- 4 character SVG components created: OrangeBlob, PurpleRect, BlackBar, YellowCylinder — all inline SVG, all mouth paths from config, all CSS Modules for sizing.
- Pupils structured as separate `<circle>` elements (not combined with eye whites) to enable easy `motion.circle` upgrade in Story 2.2.
- `src/App.tsx` temporarily updated to render all 4 characters side-by-side for visual verification (Story 1.3 will replace with proper layout).
- Fixed `@` alias: tsconfig `paths` corrected from `./*` to `src/*`; vite alias updated to `src/` accordingly.
- **Code Review fixes:** Removed inline style from App.tsx (moved to App.module.css .tempStage); unified yellowCylinder idle path to spec; removed hardcoded scale(1.2) from OrangeBlob mouth transform; adjusted BlackBar mouth Y position; added aria-hidden="true" to all 4 SVGs; cleaned up characters.ts TODO comments.

### File List

- `src/config/characters.ts` (modified — stub replaced with full typed export; TODO comments cleaned up)
- `src/components/characters/OrangeBlob.tsx` (new)
- `src/components/characters/OrangeBlob.module.css` (new)
- `src/components/characters/PurpleRect.tsx` (new)
- `src/components/characters/PurpleRect.module.css` (new)
- `src/components/characters/BlackBar.tsx` (new)
- `src/components/characters/BlackBar.module.css` (new)
- `src/components/characters/YellowCylinder.tsx` (new)
- `src/components/characters/YellowCylinder.module.css` (new)
- `src/App.tsx` (modified — temporary 4-character render using CSS Module class)
- `src/App.module.css` (modified — added .tempStage class)
- `tsconfig.app.json` (modified — fixed `@` alias paths from `./*` to `src/*`)
- `vite.config.ts` (modified — updated alias from project root to `src/`)

