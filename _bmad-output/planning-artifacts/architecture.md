---
stepsCompleted: [step-01-init, step-02-context, step-03-starter, step-04-decisions, step-05-patterns, step-06-structure, step-07-validation, step-08-complete]
inputDocuments: ["_bmad-output/planning-artifacts/prd.md"]
visualReferences: ["docs/*.png (4张效果截图)"]
workflowType: 'architecture'
project_name: 'moody-blobs-login'
user_name: 'Mu'
date: '2026-02-26'
lastStep: 8
status: 'complete'
completedAt: '2026-02-26'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (28 FRs):**
- 视线追踪系统（FR1-5）：鼠标追踪 + 聚焦锁定 + 字符右移，双模式平滑切换
- 情绪状态机（FR6-12）：4 状态全局机，驱动所有角色视觉表现，状态切换 200-300ms 过渡
- 角色个性系统（FR13-18）：4 角色差异化参数，SVG Path 变形 + 身体旋转 + 瞳孔缩放
- 登录表单（FR19-25）：标准表单 UI，含密码显示切换
- 表单验证（FR26-28）：基础邮箱格式 + 非空校验，失败触发 typing 状态

**Non-Functional Requirements:**
- 性能：60fps，首次可交互 < 2s，动画仅用 transform/opacity
- 可维护性：状态机与渲染解耦，动画参数集中配置，角色组件独立
- 浏览器：Chrome/Firefox/Safari 最新版，桌面端优先

**Scale & Complexity:**
- Primary domain: Web SPA（纯前端，CSR）
- Complexity level: Low
- Estimated architectural components: ~8-10 个核心组件

### Technical Constraints & Dependencies

- 技术栈锁定：React + Framer Motion + Vite
- 无路由、无状态管理库、无后端
- SVG 内联于 React 组件（动态控制 Path 属性）
- 动画参数集中于单一配置文件

### Cross-Cutting Concerns Identified

1. **情绪状态机**：贯穿所有角色组件，是全局共享状态
2. **鼠标/光标位置**：全局事件监听，影响所有角色瞳孔
3. **动画性能**：每个组件都需遵守 transform-only 原则
4. **角色参数配置**：差异化权重需统一管理，避免散落各组件

## Starter Template Evaluation

### Primary Technology Domain

Web SPA（纯前端 CSR），无路由、无后端、无 SSR 需求

### Selected Starter: Vite + React

**Rationale:** PRD 明确指定 Vite + React + Framer Motion，项目为单页面纯前端，create-vite 是最轻量、最直接的选择，无多余依赖。

**Initialization Command:**

```bash
npm create vite@latest moody-blobs-login -- --template react-ts
cd moody-blobs-login
npm install
npm install framer-motion
```

**Architectural Decisions Provided by Starter:**

- Language & Runtime: TypeScript（类型安全对状态机和动画参数有帮助）
- Build Tooling: Vite（极速 HMR，开发体验优秀）
- Code Organization: src/ 目录，组件自由组织
- Development Experience: 热重载、TypeScript 支持

**Note:** 项目初始化为第一个实现 Story。

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- 情绪状态机：React Context + useReducer
- 样式方案：CSS Modules

**Important Decisions (Shape Architecture):**
- 部署：GitHub Pages（与 sudoku/PerlerPix 同一模式）

**Deferred Decisions (Post-MVP):**
- 移动端适配（Phase 2）
- 登录失败状态（Phase 2）

### Frontend Architecture

**State Management: React Context + useReducer**
- 全局 `EmotionContext` 提供情绪状态（idle/typing/password-visible/success）
- `useReducer` 管理状态转换，action 类型与 FR6-FR12 一一对应
- 鼠标位置通过独立 `MouseContext` 或自定义 Hook 共享
- 角色组件只消费 context，不持有状态，登录表单负责 dispatch

**Styling: CSS Modules**
- 每个组件对应 `.module.css` 文件，作用域隔离
- SVG 内联于 JSX，动态属性通过 Framer Motion 控制，不走 CSS
- 布局（左右分栏）用 CSS Modules，动画效果全部交给 Framer Motion

**Animation: Framer Motion**
- `motion.*` 组件包裹 SVG 元素
- `animate` prop 接收从状态机派生的动画目标值
- `transition` 配置集中于 `src/config/animation.ts`
- SVG Path 变形通过 `d` 属性 + Framer Motion 插值实现

### Infrastructure & Deployment

**Hosting: GitHub Pages（GitHub Actions 自动部署）**

`vite.config.ts`:
```ts
base: '/moody-blobs-login/',
server: { port: 3000, host: '0.0.0.0' },
resolve: { alias: { '@': path.resolve(__dirname, '.') } }
```

部署流程：push 到 main 分支 → GitHub Actions 自动 build → 部署到 GitHub Pages。
CI/CD 配置在 GitHub 仓库 Settings 中开启，无需本地手动操作。

### Decision Impact Analysis

**Implementation Sequence:**
1. 项目初始化（Vite + React-TS，复用 vite.config 模式）
2. 情绪状态机（EmotionContext + useReducer）
3. 鼠标追踪 Hook（MouseContext）
4. 角色 SVG 组件（静态造型 + CSS Modules）
5. 动画层接入（Framer Motion，参数集中配置）
6. 登录表单组件
7. 状态联动调试
8. GitHub Pages 部署

**Cross-Component Dependencies:**
- 所有角色组件依赖 EmotionContext + MouseContext
- 登录表单负责 dispatch action，不直接控制角色
- 动画参数统一从 `src/config/animation.ts` 读取

## Implementation Patterns & Consistency Rules

### Naming Patterns

**文件命名：**
- 组件文件：PascalCase，如 `OrangeBlob.tsx`、`LoginForm.tsx`
- 样式文件：与组件同名，如 `OrangeBlob.module.css`
- Hook 文件：camelCase，以 `use` 开头，如 `useMouseTracker.ts`
- 配置文件：camelCase，如 `animation.ts`、`characters.ts`

**组件命名：**
- React 组件：PascalCase
- 自定义 Hook：`use` 前缀 + PascalCase，如 `useEmotionState`
- Context：`XxxContext` + `XxxProvider` + `useXxx` 三件套

**TypeScript 类型命名：**
- 类型/接口：PascalCase，如 `EmotionState`、`CharacterConfig`
- Emotion 状态值：字符串字面量联合类型，如 `'idle' | 'typing' | 'password-visible' | 'success'`
- Action type：字符串常量，如 `'SET_TYPING'`、`'SET_SUCCESS'`

### Structure Patterns

**项目组织（按类型）：**

```
src/
├── components/
│   ├── characters/
│   │   ├── OrangeBlob.tsx
│   │   ├── PurpleRect.tsx
│   │   ├── BlackBar.tsx
│   │   └── YellowCylinder.tsx
│   ├── LoginForm.tsx
│   └── CharacterStage.tsx
├── context/
│   ├── EmotionContext.tsx
│   └── MouseContext.tsx
├── config/
│   ├── animation.ts
│   └── characters.ts
├── hooks/
│   └── useMouseTracker.ts
└── types/
    └── index.ts
```

### Communication Patterns

**EmotionContext Action 命名：**
- `SET_IDLE`、`SET_TYPING`、`SET_PASSWORD_VISIBLE`、`SET_SUCCESS`
- 登录表单负责 dispatch action，角色组件只读 state

**状态更新规则：**
- 所有状态更新通过 dispatch，禁止直接修改 state
- 角色组件通过 `useContext(EmotionContext)` 消费，不接受 emotion 相关 props

### Process Patterns

**动画参数规则：**
- 所有数值（duration、stiffness、damping、rotate 角度、scale 比例）定义在 `src/config/animation.ts`
- 组件内禁止硬编码动画数值
- SVG Path 字符串定义在 `src/config/characters.ts`

**SVG 动画规则：**
- 身体旋转：`motion.g` 包裹整个角色，`rotate` 属性
- 瞳孔移动：`motion.circle` 或 `motion.ellipse`，`x`/`y` 属性
- 嘴型变形：`motion.path`，`d` 属性插值

### Enforcement Guidelines

**All AI Agents MUST:**
- 动画参数从 `src/config/animation.ts` 读取，不硬编码
- 情绪状态只通过 `EmotionContext` 共享，不通过 props 传递
- SVG 内联于组件 JSX，不使用外部 SVG 文件
- CSS Modules 用于布局和静态样式，Framer Motion 用于所有动画

## Project Structure & Boundaries

### Complete Project Directory Structure

```
moody-blobs-login/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .gitignore
├── public/
│   └── favicon.ico
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.module.css
    ├── index.css
    ├── types/
    │   └── index.ts
    ├── config/
    │   ├── animation.ts
    │   └── characters.ts
    ├── context/
    │   ├── EmotionContext.tsx
    │   └── MouseContext.tsx
    ├── hooks/
    │   └── useMouseTracker.ts
    └── components/
        ├── CharacterStage.tsx
        ├── CharacterStage.module.css
        ├── LoginForm.tsx
        ├── LoginForm.module.css
        └── characters/
            ├── OrangeBlob.tsx
            ├── OrangeBlob.module.css
            ├── PurpleRect.tsx
            ├── PurpleRect.module.css
            ├── BlackBar.tsx
            ├── BlackBar.module.css
            ├── YellowCylinder.tsx
            └── YellowCylinder.module.css
```

### Architectural Boundaries

**Component Boundaries:**
- `LoginForm` → dispatch action → `EmotionContext` → 角色组件消费
- 角色组件只读 context，不接受 emotion/mouse 相关 props
- `CharacterStage` 负责布局，不持有任何状态

**Data Flow:**
```
用户交互（鼠标/键盘）
    ↓
LoginForm dispatch / MouseContext 更新
    ↓
EmotionContext state 变更
    ↓
四个角色组件重渲染
    ↓
Framer Motion 动画执行（参数来自 config/animation.ts）
```

### Requirements to Structure Mapping

| FR 分组 | 实现位置 |
|---------|---------|
| 视线追踪（FR1-5） | `MouseContext.tsx` + `hooks/useMouseTracker.ts` + 各角色组件 |
| 情绪状态机（FR6-12） | `context/EmotionContext.tsx` |
| 角色个性（FR13-18） | `config/characters.ts` + 各角色组件 |
| 登录表单（FR19-25） | `components/LoginForm.tsx` |
| 表单验证（FR26-28） | `components/LoginForm.tsx` |

### Development Workflow

**开发：** `npm run dev`（port 3000）
**构建：** `npm run build`
**部署：** push main → GitHub Actions 自动部署到 GitHub Pages

## Architecture Validation Results

### Coherence Validation ✅

所有技术选型兼容，无版本冲突。CSS Modules + Framer Motion 职责分离清晰，
Context + useReducer 天然适配状态机模式，SVG 内联方案与 React 组件化一致。

### Requirements Coverage Validation ✅

28 个 FR 全部有明确的架构支撑，NFR（60fps、解耦、可维护性）均通过
transform-only 原则、集中配置、Context 模式覆盖。

### Implementation Readiness Validation ✅

- 决策完整：技术栈、状态管理、样式、动画、部署全部明确
- 结构完整：每个文件都有明确职责，无歧义
- 模式完整：命名、通信、动画参数规则覆盖所有潜在冲突点

### Gap Analysis Results

无 Critical Gap。`MouseContext` 与 `EmotionContext` 分离设计已确认，符合单一职责原则。

### Architecture Completeness Checklist

- [x] 项目上下文分析完成
- [x] 技术栈决策完整（React + TS + Vite + Framer Motion）
- [x] 状态管理方案确定（Context + useReducer）
- [x] 样式方案确定（CSS Modules）
- [x] 动画参数集中配置规则明确
- [x] 命名规范全面覆盖
- [x] 项目目录结构完整
- [x] 需求到文件的映射完成
- [x] 部署方案确定（GitHub Pages + GitHub Actions）

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Key Strengths:**
- 状态机与渲染层严格解耦，角色组件纯消费者
- 动画参数集中配置，调参无需改组件
- 项目结构简单清晰，~15 个核心文件

**First Implementation Priority:**

```bash
npm create vite@latest moody-blobs-login -- --template react-ts
cd moody-blobs-login
npm install
npm install framer-motion
```
