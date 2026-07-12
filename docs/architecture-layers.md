# CLAT-FE architecture layers

> Phase 3 structure reference. Non-negotiables: `claude-code-guide.md`.

```
app/ (routes, layouts, page-local _components)
  ↓ calls
hooks/ (optional orchestration)
  ↓ calls
services/ (HTTP only via axiosInstance / publicAxios)
  ↓
lib/api/ (interceptors, cookies/tokens)
```

| Layer | May import | Must not |
|-------|------------|----------|
| `app/**` | components, hooks, services, stores, styles, types | raw `axios`, other pages' internals across domains |
| `components/**` | ui primitives, styles, types | `services` preferred via page/hook (shared components stay presentational when possible) |
| `hooks/**` | services, stores, types | page JSX |
| `services/**` | `lib/api/*`, types | React, Zustand, CSS |
| `stores/**` | types | services (avoid cycles); tokens owned by axios interceptors |
| `styles/**` | tokens only | business logic |

## Domain services (current)

| File | Domain |
|------|--------|
| `auth.ts` | login / refresh / signup |
| `class.ts` | classes |
| `student.ts` | students |
| `template.ts` | lesson templates |
| `lesson.ts` | lesson records |
| `attendance.ts` | attendance sessions |
| `alimtalk.ts` | settings / send / history |
| `aiSettings.ts` | teacher AI settings |
| `studentDashboard.ts` | student dashboard (+ separate AI analysis) |
| `parentDashboard.ts` | public parent token views |

When adding a domain, add a **service file first**, then the route. Product FE keeps **server as source of truth** via `services/*`.

## Server state (React Query)

- `QueryClientProvider` wraps the app via `components/providers/AppProviders`.
- Prefer `useQuery` / `useMutation` + `queryKeys` for **new or split** domains; do not mass-migrate existing pages.
- Invalidate with `queryKeys` helpers (e.g. `invalidateLessonLists`) instead of ad-hoc session flags.
