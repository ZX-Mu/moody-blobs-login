---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories]
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
---

# moody-blobs-login - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for moody-blobs-login, decomposing the requirements from the PRD and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**视线追踪系统**
- FR1: 用户移动鼠标时，四个角色的瞳孔跟随鼠标位置偏移
- FR2: 各角色瞳孔移动幅度按权重差异化（橙色 1.2 > 黄色 1.0 > 黑色 0.9 > 紫色 0.8）
- FR3: 用户聚焦输入框时，角色瞳孔从鼠标追踪模式平滑切换至锁定输入框光标位置
- FR4: 用户在输入框中输入字符时，角色瞳孔随字符数量增加向右微移
- FR5: 用户失焦输入框时，角色瞳孔恢复鼠标追踪模式

**情绪状态系统**
- FR6: 系统维护全局情绪状态机，状态：idle / typing / password-visible / success
- FR7: 页面加载完成且无用户操作时，四个角色呈现 idle 状态
- FR8: 用户在任意输入框输入内容时，四个角色切换至 typing 状态
- FR9: 用户点击密码显示/隐藏按钮使密码变为明文时，四个角色切换至 password-visible 状态
- FR10: password-visible 状态下，角色呈现"背身偷看"肢体语言（身体背对密码框，眼睛偷瞟）
- FR11: 用户点击登录按钮且验证通过时，四个角色切换至 success 状态
- FR12: 各情绪状态之间的切换带有平滑过渡动画（200ms～300ms）

**角色个性系统**
- FR13: 橙色角色在所有情绪状态下反应幅度最大（最活泼）
- FR14: 紫色角色为情绪主导者，嘴型变化最丰富（4 种 SVG Path 状态）
- FR15: 黄色角色视线灵敏，反应适中
- FR16: 黑色角色反应最克制（最冷静）
- FR17: 各角色的嘴型通过 SVG Path 变形表达情绪
- FR18: 各角色的身体可发生倾斜/旋转以表达肢体语言

**登录表单**
- FR19: 用户可在邮箱输入框中输入邮箱地址
- FR20: 用户可在密码输入框中输入密码（默认隐藏为圆点）
- FR21: 用户可点击密码框右侧图标切换密码明文/密文显示
- FR22: 用户可勾选"记住 30 天"选项
- FR23: 用户可点击"忘记密码"链接
- FR24: 用户可点击登录按钮提交表单
- FR25: 用户可点击注册链接跳转注册

**表单交互与验证**
- FR26: 用户提交表单时，系统对邮箱格式进行基础验证
- FR27: 用户提交表单时，系统对密码非空进行验证
- FR28: 表单验证失败时，角色切换至 typing（担忧）状态

### NonFunctional Requirements

- NFR1: 桌面端动画帧率维持 60fps
- NFR2: 页面首次可交互时间 < 2s
- NFR3: 所有动画使用 transform / opacity，避免触发 layout reflow
- NFR4: 情绪状态机逻辑与渲染层解耦，状态变更不直接操作 DOM
- NFR5: 动画参数集中于单一配置文件，调参无需修改组件
- NFR6: 角色组件与登录表单组件互不依赖，可独立开发和测试
- NFR7: 目标浏览器：Chrome、Firefox、Safari 最新版
- NFR8: 桌面端优先，移动端为 Post-MVP

### Additional Requirements

**来自 Architecture（影响实现顺序）：**
- 使用 `npm create vite@latest moody-blobs-login -- --template react-ts` 初始化项目（Epic 1 Story 1 必须先执行）
- 安装 Framer Motion：`npm install framer-motion`
- 情绪状态机实现：React Context + useReducer（`EmotionContext`）
- 鼠标位置共享：独立 `MouseContext` + `useMouseTracker` Hook
- 样式方案：CSS Modules（布局/静态样式），Framer Motion（所有动画）
- 动画参数集中于 `src/config/animation.ts`，组件内禁止硬编码
- SVG Path 字符串定义在 `src/config/characters.ts`
- `vite.config.ts` 需配置 `base: '/moody-blobs-login/'`
- 部署：GitHub Pages + GitHub Actions 自动部署（push main 触发）

### FR Coverage Map

| FR | Epic | 说明 |
|----|------|------|
| FR1 | Epic 2 | 鼠标追踪瞳孔偏移 |
| FR2 | Epic 2 | 各角色权重差异化 |
| FR3 | Epic 5 | 聚焦切换至锁定模式 |
| FR4 | Epic 5 | 字符数量驱动右移 |
| FR5 | Epic 2/5 | 失焦恢复追踪 |
| FR6 | Epic 3 | 全局情绪状态机 |
| FR7 | Epic 1/3 | idle 初始状态 |
| FR8 | Epic 3 | typing 状态触发 |
| FR9 | Epic 3 | password-visible 触发 |
| FR10 | Epic 3 | 背身偷看肢体语言 |
| FR11 | Epic 3 | success 状态触发 |
| FR12 | Epic 3 | 200-300ms 平滑过渡 |
| FR13 | Epic 3 | 橙色最活泼（参数权重） |
| FR14 | Epic 3 | 紫色嘴型最丰富（4种Path） |
| FR15 | Epic 3 | 黄色视线灵敏（参数权重） |
| FR16 | Epic 3 | 黑色最克制（参数权重） |
| FR17 | Epic 3 | SVG Path 嘴型变形机制 |
| FR18 | Epic 3 | 身体倾斜/旋转机制 |
| FR19 | Epic 4 | 邮箱输入框 |
| FR20 | Epic 4 | 密码输入框 |
| FR21 | Epic 4 | 密码显示切换 |
| FR22 | Epic 4 | 记住 30 天 |
| FR23 | Epic 4 | 忘记密码链接 |
| FR24 | Epic 4 | 登录按钮 |
| FR25 | Epic 4 | 注册链接 |
| FR26 | Epic 4 | 邮箱格式验证 |
| FR27 | Epic 4 | 密码非空验证 |
| FR28 | Epic 4 | 验证失败触发 typing |

## Epic List

### Epic 1: 项目基础与静态角色舞台
用户打开页面，能看到四个几何角色静静站在左侧，登录表单在右侧，页面布局完整，视觉完成度达到作品集标准。
**FRs covered:** FR7（idle 静态呈现），架构附加需求（项目初始化、目录结构、CSS Modules 布局）

### Epic 2: 鼠标视线追踪系统
用户移动鼠标时，四个角色的眼睛跟着转，且各角色灵敏度不同——橙色最活泼，紫色最克制。
**FRs covered:** FR1, FR2, FR5

### Epic 3: 情绪状态机与角色个性动画
用户与表单交互时，角色产生完整的情绪反应：输入时担忧、密码可见时背身偷看、登录成功时开心，且四个角色各有个性。
**FRs covered:** FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18

### Epic 4: 登录表单与验证联动
用户可完整操作登录表单，表单验证失败时角色也有对应反应。
**FRs covered:** FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28

### Epic 5: 聚焦锁定与字符追踪
用户点击输入框时，角色视线从鼠标追踪模式切换为锁定光标，随着字符输入瞳孔缓缓右移。
**FRs covered:** FR3, FR4, FR5

### Epic 6: 部署与发布
项目构建并部署到 GitHub Pages，可通过 URL 分享给他人查看。
**FRs covered:** 架构附加需求（GitHub Pages + GitHub Actions）

---

## Epic 1: 项目基础与静态角色舞台

用户打开页面，能看到四个几何角色静静站在左侧，登录表单在右侧，页面布局完整，视觉完成度达到作品集标准。

### Story 1.1: 项目初始化与基础配置

As a developer,
I want to initialize the project with Vite + React-TS and configure the build setup,
So that the development environment is ready and the project structure matches the architecture spec.

**Acceptance Criteria:**

**Given** a clean working directory
**When** the initialization commands are run
**Then** the project is created with `npm create vite@latest moody-blobs-login -- --template react-ts`
**And** `framer-motion` is installed as a dependency

**Given** the project is initialized
**When** `vite.config.ts` is configured
**Then** `base` is set to `'/moody-blobs-login/'`, `server.port` is `3000`, and `@` alias resolves to project root

**Given** the project is initialized
**When** the directory structure is set up
**Then** the following folders exist: `src/components/characters/`, `src/context/`, `src/config/`, `src/hooks/`, `src/types/`

**Given** the project is initialized
**When** `npm run dev` is executed
**Then** the app starts on port 3000 without errors

### Story 1.2: 四个角色 SVG 静态造型组件

As a developer,
I want to create the four character SVG components with their idle visual appearance,
So that the characters are visually distinct and ready to receive animation in future stories.

**Acceptance Criteria:**

**Given** the project structure is ready (Story 1.1 complete)
**When** the four character components are created
**Then** `OrangeBlob.tsx`, `PurpleRect.tsx`, `BlackBar.tsx`, `YellowCylinder.tsx` exist in `src/components/characters/`
**And** each has a corresponding `.module.css` file

**Given** each character component is rendered
**When** viewed in the browser
**Then** OrangeBlob renders as an orange semicircle shape with eyes and idle mouth `M10,20 Q15,18 20,20` (flat)
**And** PurpleRect renders as a purple rectangle with eyes and idle mouth `M10,20 Q15,18 20,20`
**And** BlackBar renders as a narrow black bar with eyes and a straight line mouth
**And** YellowCylinder renders as a yellow cylinder shape with eyes and a dot mouth

**Given** each character component is rendered
**When** inspected
**Then** SVG is inlined in JSX (no external SVG files)
**And** all SVG Path strings are imported from `src/config/characters.ts`
**And** no animation values are hardcoded in components

### Story 1.3: 页面整体布局

As a visitor,
I want to see a complete page layout with characters on the left and login form on the right,
So that the page feels polished and ready for interaction.

**Acceptance Criteria:**

**Given** the app is opened in a desktop browser
**When** the page loads
**Then** the layout is split: character stage occupies the left half, login form area occupies the right half
**And** the layout uses CSS Modules (no inline styles for layout)

**Given** `CharacterStage.tsx` is rendered
**When** viewed
**Then** all four characters are displayed in a visually balanced arrangement
**And** `CharacterStage` holds no state and accepts no emotion/mouse props

**Given** `LoginForm.tsx` placeholder is rendered
**When** viewed
**Then** a placeholder login form area is visible on the right side (full form UI comes in Epic 4)

**Given** the page is viewed at desktop width (≥1024px)
**When** rendered
**Then** no horizontal scrollbar appears and the layout fills the viewport

***Implementation Note:*** *The layout utilizes absolute positioning with mathematically calculated negative `bottom` margins to counteract SVG internal padding, enforcing a strict zero-line baseline. Characters are grouped in a staggered overlap (Purple > Yellow > Black > Orange) and meticulously scaled (1.1 to 0.85) to prevent any facial occlusion.*

---

## Epic 2: 鼠标视线追踪系统

用户移动鼠标时，四个角色的眼睛跟着转，且各角色灵敏度不同——橙色最活泼，紫色最克制。

### Story 2.1: MouseContext 与 useMouseTracker Hook

As a developer,
I want a global mouse position context and hook,
So that all character components can consume normalized mouse coordinates without duplicating event listeners.

**Acceptance Criteria:**

**Given** the app is running
**When** `MouseContext.tsx` and `useMouseTracker.ts` are implemented
**Then** a single `mousemove` event listener is registered at the document level
**And** mouse position is normalized to a range suitable for pupil offset calculation (e.g., -1 to 1 relative to viewport center)

**Given** `MouseProvider` wraps the app
**When** any character component calls `useMousePosition()`
**Then** it receives the current normalized `{ x, y }` mouse coordinates
**And** no additional event listeners are created per component

**Given** the mouse is not moving
**When** the page loads
**Then** the default mouse position is `{ x: 0, y: 0 }` (center)

### Story 2.2: 角色瞳孔差异化鼠标追踪

As a visitor,
I want the characters' pupils to follow my mouse with different sensitivities,
So that each character feels distinct and alive even before any form interaction.

**Acceptance Criteria:**

**Given** `MouseContext` is available (Story 2.1 complete)
**When** the user moves the mouse
**Then** all four characters' pupils offset in the direction of the mouse
**And** OrangeBlob pupil offset multiplier is 1.2×, YellowCylinder 1.0×, BlackBar 0.9×, PurpleRect 0.8×

**Given** the user moves the mouse to the far edge of the screen
**When** pupils are rendered
**Then** pupils stay within the character's eye boundary (clamped, no overflow)

**Given** the pupil is moving
**When** the mouse changes position
**Then** the movement uses Framer Motion spring animation (stiffness: 200, damping: 20) for smooth follow
**And** all spring/damping values are read from `src/config/animation.ts`, not hardcoded in components

**Given** no input is focused (idle state)
**When** the mouse moves anywhere on the page
**Then** all four characters track the mouse (default tracking mode, FR5 default behavior)

---

## Epic 3: 情绪状态机与角色个性动画

用户与表单交互时，角色产生完整的情绪反应：输入时担忧、密码可见时背身偷看、登录成功时开心，且四个角色各有个性。

### Story 3.1: EmotionContext 全局情绪状态机

As a developer,
I want a global emotion state machine with React Context and useReducer,
So that all character components can reactively respond to form interactions without coupling to the form.

**Acceptance Criteria:**

**Given** the app is running
**When** `EmotionContext.tsx` is implemented
**Then** it exposes `EmotionState` type: `'idle' | 'typing' | 'password-visible' | 'success'`
**And** actions `SET_IDLE`, `SET_TYPING`, `SET_PASSWORD_VISIBLE`, `SET_SUCCESS` are defined

**Given** `EmotionProvider` wraps the app
**When** the page loads with no user interaction
**Then** the initial emotion state is `'idle'` (FR7)

**Given** `EmotionContext` is available
**When** any character component calls `useEmotionState()`
**Then** it receives the current emotion state
**And** character components do NOT accept emotion-related props (context-only consumption)

**Given** the LoginForm dispatches an action
**When** `SET_TYPING` is dispatched
**Then** all character components re-render with the new state
**And** state transitions happen within 200-300ms (FR12)

### Story 3.2: typing 状态角色担忧动画

As a visitor,
I want the characters to look worried when I'm typing,
So that the page feels alive and emotionally responsive to my input.

**Acceptance Criteria:**

**Given** the emotion state changes to `'typing'`
**When** characters re-render
**Then** OrangeBlob mouth path transitions to a downward curve (worried expression), body rotation increases (most exaggerated, FR13)
**And** PurpleRect mouth transitions to `M10,20 Q15,25 20,20` (down curve), body leans forward slightly (FR14)
**And** BlackBar pupil scales to ×1.2, minimal mouth change (FR16 — most restrained)
**And** YellowCylinder mouth straightens, eyes lock forward (FR15 — moderate)

**Given** any character is animating to typing state
**When** the transition occurs
**Then** all animations use Framer Motion `animate` prop with values from `src/config/animation.ts`
**And** mouth SVG Path morphing uses 250ms easeInOut transition (FR17)
**And** body rotation uses spring (stiffness: 150, damping: 15) (FR18)

### Story 3.3: password-visible 状态背身偷看动画

As a visitor,
I want the characters to turn away but peek when I reveal my password,
So that the interaction feels playful and memorable.

**Acceptance Criteria:**

**Given** the emotion state changes to `'password-visible'`
**When** characters re-render
**Then** OrangeBlob body rotates -8°, pupils scale to ×0.85, eyes offset toward password field (FR10, FR13)
**And** PurpleRect body rotates -10°, mouth transitions to wave path `M10,20 Q12,18 15,20 Q18,22 20,20`, pupils ×0.85 (FR14)
**And** BlackBar body rotates -5°, eyes peek toward password field, pupils ×0.85 (FR16)
**And** YellowCylinder body rotates -8°, mouth wave, pupils ×0.85 (FR15)

**Given** the "peek" eye offset is applied
**When** rendered
**Then** the eye offset direction points toward the password input field
**And** the offset magnitude is ~60% of the maximum tracking range (per PRD spec)

**Given** the user hides the password again
**When** emotion state returns to `'typing'`
**Then** all characters smoothly rotate back and resume typing expressions (FR12)

### Story 3.4: success 状态开心动画

As a visitor,
I want the characters to celebrate when I successfully log in,
So that the completion of the flow feels rewarding and satisfying.

**Acceptance Criteria:**

**Given** the emotion state changes to `'success'`
**When** characters re-render
**Then** OrangeBlob mouth transitions to a large smile, eyes curve (most exaggerated, FR13)
**And** PurpleRect mouth transitions to `M8,18 Q15,25 22,18` (big upward curve), body straightens upright (FR14)
**And** BlackBar mouth curves up slightly (restrained celebration, FR16)
**And** YellowCylinder mouth curves up, eyes curve (moderate, FR15)

**Given** any state transitions to success
**When** the animation plays
**Then** all transitions complete within 200-300ms (FR12)
**And** all animation values are sourced from `src/config/animation.ts`

---

## Epic 4: 登录表单与验证联动

用户可完整操作登录表单（输入邮箱/密码、切换密码显示、勾选记住、提交），表单验证失败时角色也有对应反应。

### Story 4.1: 登录表单 UI 与密码切换

As a visitor,
I want a complete login form with all standard fields and password visibility toggle,
So that I can interact with the form and trigger character emotional responses.

**Acceptance Criteria:**

**Given** the app is running
**When** the login form is rendered
**Then** the following elements are present: email input, password input, "记住 30 天" checkbox, "忘记密码" link, login button, registration link (FR19-FR25)

**Given** the password input is rendered
**When** the user clicks the eye icon on the right
**Then** the password toggles between masked (●●●) and plaintext display (FR21)
**And** `SET_PASSWORD_VISIBLE` is dispatched to EmotionContext when password becomes visible
**And** `SET_TYPING` is dispatched when password is hidden again

**Given** the email or password input is focused
**When** the user types any character
**Then** `SET_TYPING` is dispatched to EmotionContext (FR8)

**Given** the form is rendered
**When** inspected
**Then** `LoginForm` component does not import or directly reference any character component
**And** all emotion state changes go through EmotionContext dispatch only (NFR6)

### Story 4.2: 表单验证与情绪联动

As a visitor,
I want the form to validate my input and show character reactions on failure,
So that errors feel expressive rather than cold.

**Acceptance Criteria:**

**Given** the user clicks the login button
**When** the email field is empty or has invalid format
**Then** an inline error message is shown below the email field (FR26)
**And** `SET_TYPING` is dispatched so characters show worried expression (FR28)

**Given** the user clicks the login button
**When** the password field is empty
**Then** an inline error message is shown below the password field (FR27)
**And** `SET_TYPING` is dispatched (FR28)

**Given** both email and password pass validation
**When** the user clicks the login button
**Then** `SET_SUCCESS` is dispatched and characters show success expressions (FR11)

**Given** a validation error is shown
**When** the user starts correcting the input
**Then** the error message clears on next input change

---

## Epic 5: 聚焦锁定与字符追踪

用户点击输入框时，角色视线从鼠标追踪模式切换为锁定光标，随着字符输入瞳孔缓缓右移，失焦后恢复鼠标追踪。

### Story 5.1: 输入框聚焦锁定与失焦恢复

As a visitor,
I want the characters' eyes to lock onto the input cursor when I click a field and return to tracking my mouse when I leave,
So that the characters feel attentive to what I'm doing.

**Acceptance Criteria:**

**Given** the user clicks on the email or password input
**When** the input receives focus
**Then** all four characters' pupils smoothly transition from mouse-tracking mode to locking onto the input field position (FR3)
**And** the transition is smooth (Framer Motion spring, values from `src/config/animation.ts`)

**Given** an input is focused
**When** the user moves the mouse
**Then** the pupils do NOT follow the mouse (locked mode overrides tracking)

**Given** an input is focused
**When** the user clicks outside or tabs away
**Then** all four characters' pupils smoothly return to following the mouse position (FR5)
**And** the return transition uses the same spring animation as the lock transition

### Story 5.2: 字符输入瞳孔右移

As a visitor,
I want the characters' pupils to drift right as I type more characters,
So that it looks like they're reading along with what I'm typing.

**Acceptance Criteria:**

**Given** an input field is focused
**When** the user types characters
**Then** all four characters' pupils offset progressively to the right as character count increases (FR4)
**And** the offset is proportional to character count (more characters = further right drift)
**And** the drift is clamped so pupils never leave the eye boundary

**Given** the user deletes characters
**When** character count decreases
**Then** pupils drift back left proportionally

**Given** the user clears the input entirely
**When** character count reaches 0
**Then** pupils return to the locked-center position (no right offset)

---

## Epic 6: 部署与发布

项目构建并部署到 GitHub Pages，可通过 URL 分享给他人查看。

### Story 6.1: GitHub Pages 自动部署配置

As a developer,
I want the project to automatically deploy to GitHub Pages on every push to main,
So that the live demo is always up to date and shareable via URL.

**Acceptance Criteria:**

**Given** the repository is pushed to GitHub
**When** a GitHub Actions workflow file is added at `.github/workflows/deploy.yml`
**Then** the workflow triggers on push to `main` branch
**And** it runs `npm run build` and deploys the `dist/` folder to GitHub Pages

**Given** the workflow runs successfully
**When** deployment completes
**Then** the app is accessible at `https://{username}.github.io/moody-blobs-login/`
**And** all assets load correctly (no 404s due to base path)

**Given** `vite.config.ts` has `base: '/moody-blobs-login/'`
**When** the built app is served from GitHub Pages
**Then** all JS, CSS, and asset paths resolve correctly
