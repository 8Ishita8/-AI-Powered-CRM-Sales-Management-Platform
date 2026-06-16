# Project Structure & Module Design

This document describes the recommended folder structure and module breakdown for the **AI-Powered CRM & Sales Management Platform**. The project is split into a decoupled client-server architecture:
1. `client/` - React Single Page Application (SPA).
2. `server/` - Node.js backend using TypeScript, Express, and PostgreSQL.

---

## 1. Directory Tree Layout

```text
ai-powered-crm/
├── client/                     # Frontend Application (React/TS/Vite)
│   ├── public/                 # Static assets (favicon, etc.)
│   └── src/
│       ├── assets/             # Global visual assets
│       ├── components/         # Reusable presentation UI elements
│       │   ├── ui/             # Core UI atoms (Button, Input, Badge, Dialog)
│       │   └── layout/         # Shared structure (Sidebar, Navbar, Container)
│       ├── context/            # React Contexts (AuthContext, SocketContext)
│       ├── features/           # Domain-Specific Feature Modules
│       │   ├── auth/           # Login form, session validation
│       │   ├── dashboard/      # Lead count charts, team activity graphs
│       │   ├── leads/          # Lead lists, details, logs, AI scoring card
│       │   ├── pipeline/       # Drag-and-drop Kanban Board
│       │   ├── followups/      # Calendar panel, task scheduler
│       │   └── campaigns/      # Email template builder, campaign scheduler
│       ├── hooks/              # Custom global hooks (useDebounce, useAuth)
│       ├── services/           # Direct API client wrappers (Axios instance)
│       ├── utils/              # Data parsing, date formatters
│       ├── App.tsx             # Main router configuration & layout mounting
│       ├── index.css           # Global custom styles (Tailwind / Vanilla CSS)
│       └── main.tsx            # React entry mounting point
│
├── server/                     # Backend API & Workers (Node.js/TS)
│   ├── src/
│   │   ├── config/             # Config files (db, redis, mailer, ai_client)
│   │   ├── controllers/        # Request handlers (processes inputs/outputs)
│   │   │   ├── auth.controller.ts
│   │   │   ├── lead.controller.ts
│   │   │   ├── followup.controller.ts
│   │   │   ├── campaign.controller.ts
│   │   │   └── ai.controller.ts
│   │   ├── middlewares/        # Express interceptors
│   │   │   ├── auth.middleware.ts       # RBAC & token check
│   │   │   ├── error.middleware.ts      # Global exception handler
│   │   │   └── validate.middleware.ts   # Request body schema validators (Zod)
│   │   ├── models/             # Database models & raw SQL execution
│   │   │   ├── schema.sql               # Database DDL initialization script
│   │   │   ├── lead.model.ts
│   │   │   ├── followup.model.ts
│   │   │   └── user.model.ts
│   │   ├── routes/             # API Router mappings
│   │   │   ├── auth.routes.ts
│   │   │   ├── lead.routes.ts
│   │   │   ├── followup.routes.ts
│   │   │   └── campaign.routes.ts
│   │   ├── services/           # Reusable Business Logic
│   │   │   ├── ai.service.ts            # Dynamic scoring & email generation
│   │   │   ├── lead.service.ts          # Lead updates & assignment logic
│   │   │   └── email.service.ts         # SMTP & templates dispatcher
│   │   ├── workers/            # Queue task processors
│   │   │   ├── email.worker.ts          # Dispatches scheduled campaigns
│   │   │   └── scoring.worker.ts        # Background AI evaluator
│   │   ├── app.ts              # Configures middleware and routes
│   │   └── server.ts           # Binds port and boots services
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

---

## 2. Module Boundaries & Responsibilities

### 2.1 Backend Modules

#### 1. Authentication & Security Module (`controllers/auth.controller.ts`, `middlewares/auth.middleware.ts`)
* **Purpose**: Identifies users and checks permissions.
* **Responsibilities**:
  * Decodes and validates JSON Web Tokens (JWT).
  * Validates user roles (`admin`, `manager`, `executive`) against endpoints to enforce Role-Based Access Control (RBAC).

#### 2. Lead & Pipeline Module (`controllers/lead.controller.ts`, `services/lead.service.ts`)
* **Purpose**: Manages leads and tracks their status changes.
* **Responsibilities**:
  * Provides CRUD operations on leads (Managers/Admins see all; Executives see only assigned leads).
  * Records pipeline movements into the `pipeline_history` table to generate velocity metrics for Analytics.
  * Auto-assigns/manually assigns leads to team members.

#### 3. Follow-Up & Call Logging Module (`controllers/followup.controller.ts`, `models/followup.model.ts`)
* **Purpose**: Tracks tasks, calendar appointments, and phone call summaries.
* **Responsibilities**:
  * Schedules task timings.
  * Logs the outcomes of executive calls (`durations`, `summaries`).
  * Triggers push or email reminders when deadlines approach.

#### 4. Email Campaign Module (`controllers/campaign.controller.ts`, `workers/email.worker.ts`)
* **Purpose**: Dispatches automated email batches to leads.
* **Responsibilities**:
  * Parses variables into dynamic templates (e.g., replacement of `{{lead_name}}`).
  * Pushes scheduled campaign tasks into a Redis queue.
  * Background worker processes outgoing emails page-by-page to comply with email provider speed limits.

#### 5. AI Sales Engine Module (`services/ai.service.ts`, `workers/scoring.worker.ts`)
* **Purpose**: Interfaces with the Large Language Model to score and analyze leads.
* **Responsibilities**:
  * Background job handles lead scoring based on event triggers (e.g., visit histories, phone logs).
  * Calls external AI SDKs securely using strictly-defined prompt schemas.
  * Formulates contextual draft emails (follow-up, proposals) based on target lead properties.

---

## 3. Frontend Modules

#### 1. Kanban Pipeline Feature (`features/pipeline/`)
* **Purpose**: Provides a drag-and-drop board displaying leads by their active sales stage.
* **Responsibilities**:
  * Render columns representing each stage (Qualified, Proposal, etc.).
  * Dispatches API updates dynamically when cards are moved between columns.

#### 2. Calendar Scheduler Feature (`features/followups/`)
* **Purpose**: Renders scheduled tasks and callbacks in a clean, visual agenda grid.
* **Responsibilities**:
  * Groups appointments by date.
  * Allows executives to toggle tasks between "Completed" and "Pending".

#### 3. AI Insights Widget (`features/leads/components/AIInsights.tsx`)
* **Purpose**: Visualizes the AI scoring results and custom analysis directly on the lead profile page.
* **Responsibilities**:
  * Displays the conversion probability gauge (0-100%).
  * Renders suggested "next actions" and dynamic draft templates created by the AI.

#### 4. Management Analytics Dashboard (`features/dashboard/`)
* **Purpose**: Interactive charts summarizing pipelines and team performance.
* **Responsibilities**:
  * Displays conversion rate percentages, stage trends, and active lead distributions.
  * Limits view to Admins and Managers.
