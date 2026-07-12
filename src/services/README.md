# services/

Domain HTTP clients for CLAT-FE.

- Import **only** `@/lib/api/axiosInstance` or `@/lib/api/publicAxios` (never raw `axios` for calls).
- No React / Zustand / CSS in this folder.
- One file per domain; see `docs/architecture-layers.md`.
- New screens from `prototypes/new` must call these (or new service files), not seed stores.
