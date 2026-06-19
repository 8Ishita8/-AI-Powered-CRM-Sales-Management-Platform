# AI-CRM Frontend Design Specifications

This document defines the layout design and user interface architecture for the platform.

## Color System
* **Primary Background**: `#0b0f19` (Slate Dark)
* **Accent Primary**: `#4f46e5` (Indigo-600) / Hover: `#6366f1` (Indigo-500)
* **Surfaces**: `#0f172a` (Slate-900)
* **Borders**: `#1e293b` (Slate-800)
* **Text Main**: `#f3f4f6` (Slate-100)
* **Text Secondary**: `#94a3b8` (Slate-400)

## Component Specifications

### 1. Global Shell
* **Sidebar**: Sticky left panel showing brand, interactive user role switcher, and RBAC filtered navigation routes.
* **Navbar**: Search input, active AI engine status, global notifications alert icon, and user summary badge.

### 2. Interactive Kanban Board
* Columns mapping to sales stages: `'new_lead'`, `'qualified'`, `'proposal'`, `'negotiation'`, `'won'`, `'lost'`.
* Cards with drag-and-drop mechanics, rendering lead details and converted AI score.

### 3. AI Insights Widget
* Circular conversion score gauge utilizing SVG stroke progress ring.
* narrative narrative summary block and next-best-action bullet list.

### 4. Grouped Agenda list
* Grouped tasks filtered by `Today`, `Tomorrow`, and `Next Week`.
* Inline state checkbox rendering completion line-through strike.
