# NextFlow — Visual LLM Workflow Builder

> **Trial Task Submission** | Candidate: **Saurav Kumar** | Role: Full-Stack Developer | Company: **Galaxy.ai**

---

## 1. Company Brief

**Galaxy.ai** is the #1 All-in-One AI Platform, giving 2M+ active users access to 5,000+ AI tools under a single $15/month subscription. The platform integrates leading models — GPT 5.2, Claude, Gemini, Perplexity, DALL-E, Midjourney, Sora 2, and more — into a unified interface spanning chat, image generation, video creation, audio processing, and workflow automation.

**Mission:** Democratize access to artificial intelligence by removing the complexity of managing multiple AI subscriptions, APIs, and tools.

**Core Product Areas:**
- **Chat Arena** — side-by-side model comparison across GPT, Claude, Gemini, and others
- **Workflow Generator** — visual pipelines that chain AI operations together
- **Image / Video / Audio Tools** — creative generation powered by Midjourney, DALL-E, Sora 2
- **AI Tool Marketplace** — curated catalog of 5,000+ tools accessible from one dashboard

**Tech Stack:** Next.js, React, TypeScript, TailwindCSS, PostgreSQL

---

## 2. Trial Task Assignment

### Assignment Brief

**Position:** Full-Stack Developer (Next.js / React / AI Infrastructure)

**Context:** Galaxy.ai's Workflow Generator is a core product feature that allows users to visually compose multi-step AI pipelines — chaining text, image, video, and LLM operations into executable directed acyclic graphs (DAGs). We need to assess your ability to build production-grade, visually polished workflow tooling from scratch.

**Assignment:** Build a visual LLM workflow builder inspired by [Krea.ai](https://www.krea.ai/)'s workflow interface. The application should demonstrate:

1. Your ability to ship a pixel-perfect, professional-quality dark UI
2. Competence with modern Next.js (App Router), TypeScript, and state management
3. Understanding of graph-based execution models (DAG validation, topological sorting, parallel execution)
4. Integration of real AI models (LLM API calls with multimodal support)
5. Full-stack capability: authentication, database persistence, REST APIs, background task execution

**Deadline:** 1 week from assignment date

**Deliverable:** A deployed or locally-runnable application with source code on GitHub.

---

## 3. Requirements

### Functional Requirements

| # | Requirement | Priority |
|---|-------------|----------|
| F1 | Visual drag-and-drop canvas for composing node-based workflows | Must Have |
| F2 | Minimum 5 distinct node types covering text, media, and AI operations | Must Have |
| F3 | Directed connections between nodes with visual edge rendering | Must Have |
| F4 | DAG validation — prevent cycles and invalid connections | Must Have |
| F5 | Workflow execution engine that respects dependency ordering | Must Have |
| F6 | Real LLM integration (not mocked) with at least one AI model | Must Have |
| F7 | User authentication with protected routes | Must Have |
| F8 | Persistent storage of workflows and execution history | Must Have |
| F9 | Multimodal LLM support (text + image input) | Should Have |
| F10 | Media processing capabilities (image crop, video frame extraction) | Should Have |
| F11 | Parallel execution of independent branches | Should Have |
| F12 | Undo/redo for canvas operations | Should Have |
| F13 | Workflow import/export (JSON) | Nice to Have |
| F14 | Pre-built sample workflow demonstrating the system | Nice to Have |
| F15 | Professional landing page | Nice to Have |

### Technical Requirements

| # | Requirement | Priority |
|---|-------------|----------|
| T1 | Next.js (App Router) with TypeScript (strict mode) | Must Have |
| T2 | TailwindCSS for styling | Must Have |
| T3 | PostgreSQL for data persistence | Must Have |
| T4 | ORM for type-safe database access | Must Have |
| T5 | Runtime schema validation (Zod or equivalent) | Must Have |
| T6 | Client-side state management (Zustand, Jotai, or equivalent) | Should Have |
| T7 | Non-blocking execution (background tasks or async API pattern) | Should Have |
| T8 | File upload support for images and video | Should Have |
| T9 | Clean project structure with separation of concerns | Must Have |
| T10 | Responsive, polished UI matching professional SaaS standards | Must Have |

---

## 4. Deliverables Checklist

- [x] **Visual Canvas** — React Flow-based drag-and-drop workflow editor
- [x] **6 Node Types** — Text, Upload Image, Upload Video, Run LLM, Crop Image, Extract Frame
- [x] **Edge System** — Animated, type-safe connections with handle compatibility validation
- [x] **DAG Validation** — DFS-based cycle detection preventing circular dependencies
- [x] **Topological Sort Execution** — Kahn's algorithm producing parallel execution levels
- [x] **Google Gemini Integration** — Real multimodal LLM calls (text + image input)
- [x] **Image Processing** — Sharp-based image cropping with percentage coordinates
- [x] **Video Processing** — FFmpeg frame extraction at arbitrary timestamps
- [x] **Clerk Authentication** — Sign-up/sign-in with user-scoped data isolation
- [x] **PostgreSQL + Prisma** — Workflow, WorkflowRun, and NodeRun persistence
- [x] **REST API** — CRUD for workflows, execution endpoint, history endpoint
- [x] **Execution History** — Right sidebar with per-node run details, status, timing
- [x] **Undo/Redo** — 30-level history stack for canvas operations
- [x] **JSON Import/Export** — Portable workflow serialization
- [x] **Sample Workflow** — Product Marketing Kit Generator (parallel branches)
- [x] **Landing Page** — Professional dark-theme page with hero, features, node types, CTA
- [x] **Non-blocking Execution** — Next.js `after()` for background workflow processing
- [x] **File Upload** — Transloadit integration for image/video hosting
- [x] **Zod Validation** — Runtime schema validation on all API inputs

---

## 5. Implementation Plan

### Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **React Flow** for canvas | Battle-tested node/edge rendering with pan/zoom, minimap, and snap-to-grid out of the box — focus on business logic, not canvas plumbing |
| **Zustand** over Redux/Context | Minimal hook-based store with zero boilerplate. Manages nodes, edges, sidebar state, and 30-entry undo/redo in a single file with no providers |
| **Kahn's algorithm** for execution | Topological sort naturally produces "levels" — groups of nodes whose dependencies are all satisfied. Each level executes in parallel via `Promise.allSettled` |
| **DFS** for cycle detection | Before adding any edge, DFS checks if target can reach source through existing edges. Runs in O(V+E) on every connection attempt |
| **Next.js `after()`** for background execution | Workflows take 30-60s (LLM + media processing). `after()` returns a `runId` immediately while execution continues in the background |
| **Type-safe handles** | Each node declares output type (`text`, `image`, `video`) and input accepts. `isValidConnection` enforces compatibility at connection time |

### Development Phases

1. **Scaffolding** — Next.js 16 setup, Clerk auth, Prisma schema, Neon database
2. **Canvas Core** — React Flow, BaseNode system, 6 node types, left sidebar palette
3. **Graph Logic** — DAG validator (cycle detection + topological sort), type-safe connections
4. **Execution Engine** — Level-based parallel execution, Gemini API, Sharp cropping, FFmpeg extraction
5. **Persistence & API** — REST routes, execution with `after()`, history endpoint with SWR polling
6. **Polish** — Undo/redo, JSON import/export, sample workflow, Krea.ai dark theme, landing page

---

## 6. What Was Built

### Canvas & Node System

React Flow canvas with dark dot-grid background, animated indigo edges, snap-to-grid (16px), minimap, and zoom controls. A left sidebar provides a searchable node palette — users drag nodes onto the canvas.

Six node types with consistent `BaseNode` wrapper (color-coded header, status indicator, ambient glow):

| Node | Purpose | Inputs | Output |
|------|---------|--------|--------|
| **Text** | Free-form text/prompt input | — | `text` |
| **Upload Image** | Image file upload (JPG, PNG, WEBP, GIF) | — | `image` |
| **Upload Video** | Video file upload (MP4, MOV, WEBM) | — | `video` |
| **Run LLM** | Execute Gemini model | `system_prompt` (text), `user_message` (text), `images` (image) | `text` |
| **Crop Image** | Percentage-based image cropping | `image_url` (image), x/y/width/height percent (text) | `image` |
| **Extract Frame** | Pull frame from video at timestamp | `video_url` (video), `timestamp` (text) | `image` |

### Graph Validation & Execution

- **Cycle detection** via DFS: `wouldCreateCycle()` runs before every edge addition
- **Type compatibility**: `isValidConnection()` checks output/input data types at connection time
- **Topological sort**: `topologicalSort()` using Kahn's algorithm returns levels for simultaneous execution
- **Parallel execution**: Each level dispatched via `Promise.allSettled` — independent branches run concurrently
- **Partial execution**: Run the full workflow, a subset of nodes, or a single node

### Execution Engine

The executor resolves connected inputs dynamically — if a handle has an incoming edge, the upstream node's output is used; otherwise, the node's own configured value applies. Results persist at three levels:

- **WorkflowRun** — overall status (RUNNING/SUCCESS/FAILED/PARTIAL), scope, duration
- **NodeRun** — per-node status, inputs, outputs, error messages, duration
- **Real-time history** — right sidebar polls via SWR with expandable run details

### Authentication & Persistence

- **Clerk** handles sign-up, sign-in, and session management
- **Middleware** protects all `/workflows` routes
- All workflows and runs scoped to `userId` — users only see their own data
- **Prisma ORM** with indexed queries on `userId` and `workflowId`

### UI / Design

Pixel-perfect clone of Krea.ai's premium dark aesthetic:

| Element | Value |
|---------|-------|
| Background | `#0d0d0d` with `#2a2a2a` dot grid |
| Cards/Nodes | `#0e0e0e` with `#1e1e1e` borders |
| Accent | Violet/Indigo (`#7c3aed`, `#4f46e5`, `#6366f1`) |
| Effects | Animated edges, ambient glow, pulsing status indicators |
| Layout | Collapsible left + right sidebars |
| Landing | Hero section, feature cards, how-it-works, node showcase, CTA |

---

## 7. Tech Stack & Architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 16 (App Router) | Server/client rendering, API routes, `after()` background execution |
| **Language** | TypeScript (strict) | End-to-end type safety |
| **Styling** | TailwindCSS 4 | Utility-first dark theme |
| **Auth** | Clerk | User management, session handling, protected routes |
| **Database** | PostgreSQL (Neon) | Serverless Postgres for workflows, runs, node runs |
| **ORM** | Prisma 5 | Type-safe database queries, migrations |
| **Canvas** | React Flow 11 | Node/edge graph editor, minimap, controls |
| **State** | Zustand 5 | Client-side store with undo/redo history |
| **Validation** | Zod 4 | Runtime schema validation for API inputs |
| **LLM** | Google Gemini API | Multimodal AI (text + image) via `@google/generative-ai` |
| **Image Processing** | Sharp | Server-side image cropping |
| **Video Processing** | FFmpeg | Frame extraction at arbitrary timestamps |
| **File Hosting** | Transloadit | Managed file upload and CDN delivery |
| **Data Fetching** | SWR | Client-side polling for execution history |
| **UI Components** | Radix UI | Accessible dialog, dropdown, tooltip, toast primitives |
| **Icons** | Lucide React | Consistent icon system |

### Architecture Diagram

```
Client (React 19)                          Server (Next.js 16)
─────────────────                          ─────────────────────

[Landing Page]                             [API Routes]
       │                                      │
[Clerk Auth] ──sign-in/up──►  [Middleware] ──► /api/workflows (CRUD)
       │                                      /api/execute   (POST)
[Dashboard]                                   /api/history   (GET)
       │                                         │
[Workflow Editor]                          [Workflow Executor]
  │          │         │                      │         │
[Left      [React    [Right                [Gemini   [Sharp/
Sidebar]    Flow     Sidebar]               API]     FFmpeg]
             │                                │         │
        [Zustand Store]                  [Transloadit Upload]
        (nodes, edges,                        │
         undo/redo)                    [PostgreSQL (Neon)]
                                       via Prisma ORM
```

---

## 8. Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx    # Clerk sign-in
│   │   └── sign-up/[[...sign-up]]/page.tsx    # Clerk sign-up
│   ├── (dashboard)/
│   │   ├── layout.tsx                          # Authenticated shell
│   │   ├── workflows/page.tsx                  # Workflow list
│   │   └── workflows/[id]/page.tsx             # Workflow editor
│   ├── api/
│   │   ├── workflows/route.ts                  # GET (list) + POST (create)
│   │   ├── workflows/[id]/route.ts             # GET + PUT + DELETE
│   │   ├── execute/route.ts                    # POST (run workflow)
│   │   ├── history/[workflowId]/route.ts       # GET (run history)
│   │   └── seed/route.ts                       # POST (seed sample data)
│   ├── layout.tsx                              # Root layout + Clerk provider
│   └── page.tsx                                # Landing page
├── components/
│   ├── canvas/
│   │   ├── WorkflowCanvas.tsx                  # React Flow canvas + drop handler
│   │   └── CanvasToolbar.tsx                   # Save, run, import/export, undo/redo
│   ├── nodes/
│   │   ├── BaseNode.tsx                        # Shared node wrapper + input components
│   │   ├── TextNode.tsx                        # Text input node
│   │   ├── UploadImageNode.tsx                 # Image upload node
│   │   ├── UploadVideoNode.tsx                 # Video upload node
│   │   ├── LLMNode.tsx                         # Gemini LLM node
│   │   ├── CropImageNode.tsx                   # Image crop node
│   │   └── ExtractFrameNode.tsx                # Video frame extraction node
│   └── sidebar/
│       ├── LeftSidebar.tsx                     # Searchable node palette (drag source)
│       └── RightSidebar.tsx                    # Execution history panel
├── lib/
│   ├── dag-validator.ts                        # Cycle detection + topological sort
│   ├── workflow-executor.ts                    # Parallel execution engine
│   ├── sample-workflow.ts                      # Product Marketing Kit Generator
│   ├── types.ts                                # Zod schemas + TypeScript types
│   ├── db.ts                                   # Prisma client singleton
│   └── utils.ts                                # cn() utility
├── store/
│   └── workflow-store.ts                       # Zustand store (nodes, edges, undo/redo)
├── middleware.ts                                # Clerk auth middleware
└── trigger/
    ├── llm-task.ts                             # Gemini API direct calls
    ├── crop-image-task.ts                      # Image crop processing
    └── extract-frame-task.ts                   # Frame extraction processing

prisma/
└── schema.prisma                               # Workflow, WorkflowRun, NodeRun models
```

---

## 9. Setup & Run Instructions

### Prerequisites

- Node.js 18+
- npm or pnpm
- FFmpeg installed locally (for video frame extraction)

### 1. Clone and install

```bash
git clone https://github.com/gaurav620/NextFlow--A-Galaxy-Project.git
cd NextFlow--A-Galaxy-Project
npm install
```

### 2. Configure environment variables

Create `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# PostgreSQL (Neon)
DATABASE_URL=postgresql://...

# Google Gemini AI
GOOGLE_AI_API_KEY=AIza...

# Transloadit (file uploads)
TRANSLOADIT_KEY=...
TRANSLOADIT_SECRET=...
```

**Required accounts (all have free tiers):**

| Service | Sign Up | Purpose |
|---------|---------|---------|
| Clerk | [clerk.com](https://clerk.com/) | Authentication |
| Neon | [neon.tech](https://neon.tech/) | Serverless PostgreSQL |
| Google AI Studio | [aistudio.google.com](https://aistudio.google.com/) | Gemini API key |
| Transloadit | [transloadit.com](https://transloadit.com/) | File upload & hosting |

### 3. Push database schema

```bash
npm run db:push
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. (Optional) Seed the sample workflow

After signing in, hit the seed endpoint to load the Product Marketing Kit Generator:

```
POST /api/seed
```

---

## 10. Demo: Product Marketing Kit Generator

The pre-built sample workflow demonstrates parallel branch execution:

```
  Branch A (Text Pipeline)              Branch B (Image Pipeline)
  ─────────────────────────             ────────────────────────

  ┌─────────────────────┐              ┌──────────────────────┐
  │     Text Node        │              │   Upload Image       │
  │ "Our product is a    │              │   (product photo)    │
  │  next-gen AI-powered │              │                      │
  │  workflow builder..." │              └──────────┬───────────┘
  └──────────┬───────────┘                         │
             │                                     │
             ▼                                     ▼
  ┌─────────────────────┐              ┌──────────────────────┐
  │     Run LLM          │              │    Crop Image        │
  │ model: gemini-2.0-   │              │    x:10% y:10%       │
  │        flash         │              │    w:80% h:80%       │
  │ "Generate punchy     │              │                      │
  │  product taglines"   │              └──────────┬───────────┘
  └──────────┬───────────┘                         │
             │                                     │
             └──────────────┬──────────────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      Run LLM        │
                 │ model: gemini-1.5-  │
                 │        pro          │
                 │ "Create a complete  │
                 │  marketing kit:     │
                 │  headline, benefits,│
                 │  CTA..."            │
                 └─────────────────────┘
```

**Execution flow:**

1. Branch A and Branch B start **in parallel** (topological sort level 0)
2. Text Node outputs the product description; Upload Image outputs the image URL
3. **Level 1:** Tagline LLM and Crop Image execute **in parallel**
4. **Level 2:** Final LLM waits for both upstream outputs, then generates the complete marketing kit with the tagline + cropped product image

---

## 11. Future Enhancements

Enhancements directly aligned with Galaxy.ai's product roadmap:

### Multi-Model LLM Support
Galaxy.ai supports GPT 5.2, Claude, Gemini, and Perplexity. Add a model selector dropdown to the Run LLM node with provider abstraction — enabling workflows that use Claude for analysis, GPT for creative writing, and Gemini for vision tasks in a single pipeline.

### Model Comparison Nodes
Aligned with Galaxy.ai's **Chat Arena**: a "Compare Models" node that sends the same prompt to 2-3 models in parallel and outputs a structured comparison for evaluation workflows.

### Galaxy.ai Tool Marketplace Integration
Connect to Galaxy.ai's 5,000+ tool catalog. Nodes could represent any marketplace tool (background removal, upscaling, translation, TTS), with dynamic input/output handles generated from tool schemas.

### Image & Video Generation Nodes
Add nodes for DALL-E, Midjourney, and Sora 2 — the generative models Galaxy.ai already offers. Unlock creative automation pipelines with "Generate Image" and "Generate Video" nodes.

### Collaborative Workflows
Multi-user editing with real-time cursor presence (Figma-style). Share workflows within teams with role-based permissions for viewing, editing, and executing.

### Workflow Templates Marketplace
Curated library of pre-built templates: "Blog Post Generator", "Product Photo Suite", "Video Highlight Reel", "Customer Support Triage". One-click import and customize.

### Conditional / Branching Logic
If/Else and Switch nodes that route data based on conditions (e.g., "if LLM confidence > 0.8, proceed; else, retry with a different model"). Enables error handling and adaptive pipelines.

### Webhook & Scheduling Triggers
Trigger workflows by external events (webhook POST) or on a schedule (cron). Turns NextFlow from an interactive tool into a full automation platform.

### Execution Cost Estimation
Before running a workflow, estimate total API cost based on node types, model selection, and input sizes. Display a cost breakdown for pipeline optimization.

### Version Control for Workflows
Git-like versioning: commit workflow snapshots, diff between versions, rollback to previous states. Essential for production workflows that evolve over time.

---

*Built by **Saurav Kumar** as a trial task for **Galaxy.ai** — democratizing AI, one workflow at a time.*
