# Story 1.3: 页面整体布局

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to see a complete page layout with characters on the left and login form on the right,
so that the page feels polished and ready for interaction.

## Acceptance Criteria

1. **Given** the app is opened in a desktop browser **When** the page loads **Then** the layout is split: character stage occupies the left half, login form area occupies the right half **And** the layout uses CSS Modules (no inline styles for layout).

2. **Given** `CharacterStage.tsx` is rendered **When** viewed **Then** all four characters are displayed in a visually balanced arrangement **And** `CharacterStage` holds no state and accepts no emotion/mouse props.

3. **Given** `LoginForm.tsx` placeholder is rendered **When** viewed **Then** a placeholder login form area is visible on the right side (full form UI comes in Epic 4).

4. **Given** the page is viewed at desktop width (≥1024px) **When** rendered **Then** no horizontal scrollbar appears and the layout fills the viewport.

## Tasks / Subtasks

- [x] Task 1: Create `CharacterStage.tsx` + `CharacterStage.module.css` (AC: #2)
  - [x] Import all four character components (OrangeBlob, PurpleRect, BlackBar, YellowCylinder)
  - [x] Arrange characters in a visually balanced layout using CSS Grid or Flexbox
  - [x] Component accepts no props (stateless container)
  - [x] Use CSS Module for all layout styling

- [x] Task 2: Create `LoginForm.tsx` + `LoginForm.module.css` placeholder (AC: #3)
  - [x] Create minimal placeholder component with "Login Form" heading
  - [x] Add placeholder text indicating full form comes in Epic 4
  - [x] Use CSS Module for styling
  - [x] Component structure ready for Epic 4 expansion

- [x] Task 3: Update `App.tsx` + `App.module.css` for split layout (AC: #1, #4)
  - [x] Remove temporary 4-character render from Story 1.2
  - [x] Create left-right split layout container
  - [x] Import and render CharacterStage on left
  - [x] Import and render LoginForm on right
  - [x] Ensure layout fills viewport and is responsive at ≥1024px

- [x] Task 4: Verify build and visual layout (AC: #1-4)
  - [x] Run `npm run build` — confirm 0 TypeScript errors
  - [x] Visual check: left-right split visible, characters balanced, no scrollbar
  - [x] Confirm no inline styles used for layout

## Dev Notes

### Critical Architecture Constraints

- **CSS Modules only for layout:** ALL layout styling (flexbox, grid, positioning, sizing) MUST use CSS Modules (`.module.css` files). NO inline `style={{}}` for layout — inline styles violate NFR6 (maintainability) and architecture enforcement rules.
- **No state in CharacterStage:** `CharacterStage.tsx` is a pure presentational container — it holds NO state, accepts NO props (especially no emotion/mouse props). All state management happens via Context in future stories (Epic 2, 3).
- **No emotion/mouse props on character components:** Character components (OrangeBlob, PurpleRect, etc.) consume state ONLY via Context (added in Stories 2.1, 3.1). They NEVER accept emotion or mouse position as props — this is a critical architectural boundary.
- **Placeholder LoginForm only:** This story creates a minimal placeholder. Full form UI (inputs, buttons, validation) comes in Epic 4. Do NOT implement form fields yet.
- **Desktop-first layout:** Target ≥1024px viewport width. Mobile responsive design is Post-MVP (Phase 2). Fixed-width layout is acceptable for MVP.
- **TypeScript strict:** No `any` types. Use `React.FC` or explicit return type `JSX.Element`.

### Layout Requirements (from PRD + Architecture)

**Split Layout Specification:**
- Left half: Character stage (50% width or flexible)
- Right half: Login form area (50% width or flexible)
- Full viewport height: `height: 100vh` or equivalent
- No horizontal scrollbar at ≥1024px
- Centered content, visually balanced

**CharacterStage Layout:**
- Display all 4 characters: OrangeBlob, PurpleRect, BlackBar, YellowCylinder
- Layered/stacked artistic arrangement (not grid) - characters overlap with depth
- Characters positioned like standing on a stage with front-to-back depth
- OrangeBlob: bottom-left, partially visible (only top half showing)
- PurpleRect: back-left, tallest character
- BlackBar: center position, middle depth
- YellowCylinder: right side, front depth
- Spacing creates visual depth and stage-like composition

**LoginForm Placeholder:**
- Heading: "Login Form"
- Subtext: "Full form UI coming in Epic 4"
- Centered in right half
- Minimal styling (just enough to show it's a placeholder)

### Component Boundaries & Data Flow

**Architectural Boundaries (from architecture.md § "Architectural Boundaries"):**

```
App.tsx (layout container)
  ├── CharacterStage.tsx (left half, stateless)
  │     ├── OrangeBlob.tsx (no props)
  │     ├── PurpleRect.tsx (no props)
  │     ├── BlackBar.tsx (no props)
  │     └── YellowCylinder.tsx (no props)
  └── LoginForm.tsx (right half, placeholder)
```

**Critical Rules:**
- `App.tsx` handles ONLY layout — no business logic, no state (yet)
- `CharacterStage` is a dumb container — imports and renders 4 characters, nothing more
- Character components remain unchanged from Story 1.2 — no modifications needed
- `LoginForm` is a placeholder stub — no form logic, no state, no event handlers

### Previous Story Intelligence (Stories 1.1 & 1.2)

**Key Learnings from Story 1.1:**
- `@` alias resolves to `src/` (not project root) — use `@/components/...` for imports
- `App.tsx` currently has temporary 4-character render with `styles.tempStage` — this MUST be replaced
- `App.module.css` has `.tempStage` class — this can be replaced or removed
- `vite.config.ts` has `base: '/moody-blobs-login/'` — do NOT change this (required for GitHub Pages)
- Build must pass with 0 TypeScript errors

**Key Learnings from Story 1.2:**
- All 4 character components exist and are working: `OrangeBlob.tsx`, `PurpleRect.tsx`, `BlackBar.tsx`, `YellowCylinder.tsx`
- Each character has a corresponding `.module.css` file
- Characters are self-contained — they import their own styles and config
- Characters accept NO props — they're pure static components (animation comes in Epic 2/3)
- SVG is inline in JSX, paths come from `@/config/characters.ts`
- Current `App.tsx` imports all 4 characters directly — Story 1.3 should move these imports to `CharacterStage.tsx`

**Code Patterns Established:**
- Component file naming: PascalCase (e.g., `CharacterStage.tsx`)
- CSS Module naming: same as component (e.g., `CharacterStage.module.css`)
- Import pattern: `import styles from './ComponentName.module.css'`
- CSS class usage: `className={styles.className}`

### File Structure Requirements

**Files to CREATE in this story:**

```
src/
├── components/
│   ├── CharacterStage.tsx          ← CREATE (imports 4 characters)
│   ├── CharacterStage.module.css   ← CREATE (character layout)
│   ├── LoginForm.tsx               ← CREATE (placeholder only)
│   └── LoginForm.module.css        ← CREATE (placeholder styling)
└── App.module.css                  ← MODIFY (replace .tempStage with split layout)
```

**Files to MODIFY:**
- `src/App.tsx` — replace temporary 4-character render with CharacterStage + LoginForm split layout
- `src/App.module.css` — replace `.tempStage` with proper split layout classes

**Files to NOT touch:**
- `src/components/characters/*.tsx` — character components remain unchanged
- `src/config/*` — no changes needed
- `src/context/*` — empty, used in Stories 2.1, 3.1
- `src/hooks/*` — empty, used in Story 2.1

### Architecture Compliance Checklist

- [x] CSS Modules for all layout styling [Source: architecture.md § "Styling: CSS Modules"]
- [x] No inline styles for layout [Source: architecture.md § "Enforcement Guidelines"]
- [x] CharacterStage holds no state [Source: epics.md § Story 1.3 AC #2]
- [x] Character components accept no emotion/mouse props [Source: architecture.md § "Architectural Boundaries"]
- [x] TypeScript only, no `.js`/`.jsx` files [Source: story 1.1 Dev Notes]
- [x] Component naming: PascalCase [Source: architecture.md § "Naming Patterns"]
- [x] Import using `@` alias [Source: story 1.1 Dev Notes]

### Library & Framework Requirements

- **React:** `^18.x` (already installed)
- **TypeScript:** strict mode, no `any` types
- **CSS Modules:** Vite handles `.module.css` automatically
- **Framer Motion:** `^12.4.7` installed but NOT used in this story — animation comes in Epic 2/3
- **No additional dependencies needed** for this story

### Testing Requirements

**Manual Verification (no automated tests configured):**

1. **Visual Layout Check:**
   - Open `http://localhost:3000` in browser (≥1024px width)
   - Confirm left-right split is visible
   - Confirm all 4 characters appear on left side in balanced arrangement
   - Confirm "Login Form" placeholder appears on right side
   - Confirm no horizontal scrollbar

2. **Code Inspection:**
   - Verify `CharacterStage.tsx` imports all 4 characters
   - Verify `CharacterStage` component has no props, no state
   - Verify `App.tsx` uses CSS Module classes (no inline styles)
   - Verify all layout styling is in `.module.css` files

3. **Build Verification:**
   - Run `npm run build` — confirm 0 TypeScript errors
   - Confirm build succeeds

### Implementation Strategy

**Recommended Order:**

1. **Create CharacterStage component first:**
   - Import all 4 character components
   - Create simple container with CSS Grid or Flexbox layout
   - Test that all 4 characters render

2. **Create LoginForm placeholder:**
   - Minimal component with heading and subtext
   - Center content in container

3. **Update App.tsx:**
   - Remove temporary 4-character imports
   - Import CharacterStage and LoginForm
   - Create split layout container

4. **Style with CSS Modules:**
   - `App.module.css`: split layout (left-right 50/50 or flexible)
   - `CharacterStage.module.css`: character arrangement (grid or flex)
   - `LoginForm.module.css`: placeholder centering

5. **Verify and test:**
   - Visual check in browser
   - Build check
   - Code review for inline styles

### Layout Implementation Hints

**Option 1: Flexbox Split (Recommended for simplicity):**

```css
/* App.module.css */
.container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.leftHalf {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rightHalf {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Option 2: CSS Grid Split:**

```css
/* App.module.css */
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  width: 100%;
}
```

**CharacterStage Layout (Layered/Stacked Artistic Arrangement):**

```css
/* CharacterStage.module.css */
.stage {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 400px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

/* Characters positioned with absolute positioning for layered effect */
/* OrangeBlob - bottom-left, z-index: 1 */
/* PurpleRect - back-left, z-index: 2 */
/* BlackBar - center, z-index: 3 */
/* YellowCylinder - right, z-index: 4 */
```

> **Note:** The layered arrangement creates depth and makes characters feel like they're standing on a stage together, matching the reference design in `docs/*.png`. This is NOT a grid layout - it's an artistic composition with overlapping elements.

### References

- Split layout requirement: [Source: epics.md § Story 1.3 AC #1]
- CharacterStage stateless rule: [Source: epics.md § Story 1.3 AC #2]
- LoginForm placeholder: [Source: epics.md § Story 1.3 AC #3]
- No horizontal scrollbar: [Source: epics.md § Story 1.3 AC #4]
- CSS Modules enforcement: [Source: architecture.md § "Styling: CSS Modules"]
- Component boundaries: [Source: architecture.md § "Architectural Boundaries"]
- No emotion/mouse props: [Source: architecture.md § "Communication Patterns"]
- File naming conventions: [Source: architecture.md § "Naming Patterns"]
- Project structure: [Source: architecture.md § "Complete Project Directory Structure"]

### Project Structure Notes

**Alignment with Unified Project Structure:**

This story creates the main layout container structure that will remain stable through all future stories:

```
src/
├── App.tsx                         ← Layout orchestrator (split left-right)
├── App.module.css                  ← Split layout styles
├── components/
│   ├── CharacterStage.tsx          ← Left half container (NEW in this story)
│   ├── CharacterStage.module.css   ← Character arrangement (NEW)
│   ├── LoginForm.tsx               ← Right half placeholder (NEW)
│   ├── LoginForm.module.css        ← Placeholder styles (NEW)
│   └── characters/
│       ├── OrangeBlob.tsx          ← Unchanged from Story 1.2
│       ├── PurpleRect.tsx          ← Unchanged
│       ├── BlackBar.tsx            ← Unchanged
│       └── YellowCylinder.tsx      ← Unchanged
```

**Future Story Dependencies:**
- Epic 2 (Stories 2.1-2.2): Will add MouseContext, character components will consume it
- Epic 3 (Stories 3.1-3.4): Will add EmotionContext, character components will consume it
- Epic 4 (Stories 4.1-4.2): Will expand LoginForm from placeholder to full form UI
- Epic 5 (Stories 5.1-5.2): Will add focus tracking logic to LoginForm

**No Conflicts Detected:**
- This story creates new files only (CharacterStage, LoginForm) — no conflicts with existing components
- Character components remain untouched — no risk of breaking Story 1.2 work
- App.tsx modification is straightforward replacement — low risk

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- `npm run build`: ✓ built in 372ms, 0 TypeScript errors
- All components created successfully with proper TypeScript types
- CSS Modules properly imported and applied

### Completion Notes List

- ✅ Created `CharacterStage.tsx` with layered/stacked artistic layout importing all 4 character components (OrangeBlob, PurpleRect, BlackBar, YellowCylinder)
- ✅ Created `CharacterStage.module.css` with absolute positioning for layered stage effect (characters overlap with depth, matching reference design in docs/)
- ✅ Layout creates front-to-back depth: OrangeBlob (left-bottom, z:1), PurpleRect (back-left, z:2), BlackBar (center, z:3), YellowCylinder (right, z:4)
- ✅ Created `LoginForm.tsx` placeholder component with heading "Login Form" and subtext "Full form UI coming in Epic 4"
- ✅ Created `LoginForm.module.css` with flexbox centering for placeholder content
- ✅ Updated `App.tsx` to replace temporary 4-character render with split layout using CharacterStage (left) and LoginForm (right)
- ✅ Updated `App.module.css` to implement flexbox split layout (50/50, 100vh height, no inline styles)
- ✅ CharacterStage component is stateless, accepts no props (architectural boundary maintained)
- ✅ All layout styling uses CSS Modules only (no inline styles)
- ✅ Build verification passed: 0 TypeScript errors, clean build
- ✅ Layout matches reference design in docs/ - layered artistic composition with stage-like depth
- ✅ All 4 acceptance criteria satisfied:
  - AC #1: Split layout with CSS Modules ✓
  - AC #2: CharacterStage displays all 4 characters in layered arrangement, stateless, no props ✓
  - AC #3: LoginForm placeholder visible ✓
  - AC #4: Layout fills viewport, no horizontal scrollbar at ≥1024px ✓

### File List

- `src/components/CharacterStage.tsx` (new)
- `src/components/CharacterStage.module.css` (new)
- `src/components/LoginForm.tsx` (new)
- `src/components/LoginForm.module.css` (new)
- `src/App.tsx` (modified - replaced temporary render with split layout)
- `src/App.module.css` (modified - replaced .tempStage with split layout classes)

