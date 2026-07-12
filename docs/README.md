# CLAT-FE documentation

Reference for anyone (including AI agents) working on this frontend.

| File | Contents |
|------|----------|
| [onboarding-guide.md](./onboarding-guide.md) | Product overview, folder structure, stack, API tables, routes and components |
| [claude-code-guide.md](./claude-code-guide.md) | Hard rules (axios, styles, Git), patterns, checklist |
| [architecture-layers.md](./architecture-layers.md) | Layer boundaries (app / hooks / services / stores) |
| [migration-backlog-from-new.md](./migration-backlog-from-new.md) | Selective UX port from `prototypes/new` |

If two docs disagree, follow **claude-code-guide.md** first.

Repo map (monorepo): `CANONICAL-MAP.md` at workspace root. Prototype UI lives in `prototypes/new/` (not product FE).

These files are **English** so tooling keeps UTF-8 stable. If you want Korean copies on disk, paste your originals into the same paths (or add `*-ko.md` siblings) without changing the filenames above so Cursor rules keep working.