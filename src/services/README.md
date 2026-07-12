# services/

Domain HTTP clients for CLAT-FE.

- Import **only** `@/lib/api/axiosInstance` or `@/lib/api/publicAxios` (never raw `axios` for calls).
- No React / Zustand / CSS in this folder.
- One file per domain; see `docs/architecture-layers.md`.
- New screens call these (or new service files); no client seed stores as source of truth.
