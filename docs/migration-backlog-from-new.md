# Migration backlog: `prototypes/new` → `fe-v2/CLAT-FE`

> Phase 3. Product FE 정본은 **이 저장소(`fe-v2/CLAT-FE`)**.  
> 프로토 경로: 모노레포 `prototypes/new/` (Vite + Tailwind + seed).  
> 저장소 맵: 루트 `CANONICAL-MAP.md`.

## Rules

- Port **UX / flows / components**, not seed Zustand (`appStore`) or fake `authStore`.
- Keep Next.js + vanilla-extract + `services/*` + `axiosInstance` (see `claude-code-guide.md`).
- Do **not** mix Tailwind from the prototype into product FE; reimplement with tokens.
- Student-dashboard AI tone stays **separate** from `AiSetting` (v2-open-decisions).
- Lesson message preview stays **FE-assembled** (backend preview not required in v2).

## Priority

### P0 — Auth / home / lesson

| Prototype | Product target | Notes |
|-----------|----------------|-------|
| `/login` | `(auth)/login` | Polish only; API live |
| `/signup` | `(auth)/signup` | Same |
| `/home` | `(main)/home` | Today-task / workflow widgets from `HomePage` + `lib/workflow` |
| `/today` | **new** `(main)/today` | Primary gap (`TodayPage`) |
| `/lesson` | `(main)/lesson` | List/calendar UX deltas |
| `/lesson/new` | `(main)/lesson/new` | |
| `/lesson/:id` | `(main)/lesson/[id]` | `WorkflowStepper` / `LessonWorkflowCard` |
| `/template*` | `(main)/template*` | Keep dnd-kit + API |
| `/management*` | `(main)/management*` | Tracking CTAs |
| `/me` | `(main)/me` | Profile parity |

### P1 — Attendance

| Prototype | Product target | Notes |
|-----------|----------------|-------|
| `/check/:sessionId` | `/check/[sessionId]` | Public check UX |
| Lesson attendance UI | existing `components` + `services/attendance` | Floating bar / start-end |
| `/check` dev entry | keep as harness | Not a migrate target |

### P2 — Alimtalk

| Prototype | Product target | Notes |
|-----------|----------------|-------|
| `/alimtalk` | `(main)/alimtalk` | Settings/preview UX |
| `/alimtalk/history` | `(main)/alimtalk/history` | Batch list/filters |
| Ready-to-send from `/today` | lesson detail + history | FE preview assembly |

### P3 — AI hub

| Prototype | Product target | Notes |
|-----------|----------------|-------|
| `/ai` hub | expand `(main)/ai` beyond settings | `AiHubPage` |
| `/ai/briefing` … `/ai/chat` (~15 tools) | `(main)/ai/...` | UI shells; wire BE as endpoints land |
| `/ai/settings` | existing AI settings | `services/aiSettings`; no shared tone with student AI |

### P4 — Dashboards / tracking / reports

| Prototype | Product target | Notes |
|-----------|----------------|-------|
| `/students/:id` | `(main)/students/[id]` | Tabs on `studentDashboard` service |
| `/parent/:token` | `/parent/[token]` | Layout on `parentDashboard` service |
| `/tracking` | **new** `(main)/tracking` | Incomplete / remedial / unsent |
| `/reports` | **new** `(main)/reports` | Weekly stats; AI text only when BE exists |
| Command palette | shared layout (optional) | Not a route |

## Explicit non-goals

- Full rewrite of CLAT-FE onto Vite
- Migrating `lib/aiEngine*` as production LLM (use BE)
- Migrating seed persistence / demo auth

## Suggested PR slices

1. Docs-only / this backlog (done in Phase 3 setup)
2. `(main)/today` shell + home widgets (no AI)
3. Lesson workflow stepper UX
4. Attendance UX parity
5. Alimtalk history filters
6. AI hub index + one tool page as template
7. Tracking / reports routes
