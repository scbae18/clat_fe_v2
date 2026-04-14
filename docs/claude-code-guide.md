# CLAT-FE — Agent / Claude Code guide

> Read this **before** writing code in this repo. Non-negotiable rules and patterns for CLAT-FE.

---

## 1. Product overview

CLAT is a SaaS for **visiting instructors**: student management plus **Kakao Alimtalk** automation.

Core domains:

- **Lesson**: lessons by date, lesson entry (shared + per-student fields), attendance
- **Management**: classes (create/edit), student CRUD
- **Template**: lesson item configuration, Alimtalk copy settings
- **Completion tracking**: incomplete items (homework, makeup, etc.), mark complete

---

## 2. Stack

- Next.js 16 (App Router), React 19, TypeScript 5
- Styling: **vanilla-extract** (type-safe CSS-in-JS)
- Global state: **Zustand 5** (user, toasts only)
- Server state: **`useState` + service calls** (React Query is installed; OK to adopt on new features)
- HTTP: **axios only via `axiosInstance`** — do **not** `import axios` directly
- Package manager: **pnpm**

---

## 3. Non-negotiable rules

### Code

- **No** direct `axios` import — use `@/lib/api/axiosInstance`
- **No** direct `localStorage` for tokens — interceptors own token handling
- **No** `any` — use `unknown` + type guards when inference is insufficient
- **No** committed `console.log`
- **No** client hooks in Server Components without **`'use client'`**

### Git

- **No** commits directly on `main`
- Branch: `feature/<name>` → PR → `develop` → `main`
- Commit prefixes: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`

### Styling

- **No** inline `style` — use a **`.css.ts`** file
- **No** hard-coded colors — use **`@/styles/theme.css`** tokens
- **No** Tailwind, CSS Modules, or styled-components

---

## 4. Where files live

```
src/
├── app/
│   ├── (auth)/          # Unauthenticated routes (e.g. login)
│   └── (main)/          # Authenticated (Sidebar layout)
│       ├── home/
│       ├── lesson/
│       │   └── _components/
│       ├── management/
│       │   └── _components/
│       └── template/
│           ├── _components/
│           └── _types/
├── components/common/   # Shared UI
├── hooks/
├── services/            # API functions per domain
├── stores/              # Zustand
├── styles/
│   └── tokens/
├── types/
└── lib/                 # axiosInstance, utilities
```

---

## 5. Naming

| Kind | Rule | Example |
|------|------|---------|
| Component | PascalCase `.tsx` | `LessonCard.tsx` |
| Component styles | Same name `.css.ts` | `LessonCard.css.ts` |
| Page styles | `[routeName].css.ts` | `lesson.css.ts` |
| Hook | camelCase, `use` prefix | `useLessonDetail.ts` |
| Service | domain name | `lesson.ts`, `class.ts` |
| Store | camelCase + `Store` | `userStore.ts` |
| Route-local folders | `_` prefix | `_components/`, `_types/` |
| Component folder | PascalCase | `LessonCard/` |

---

## 6. Component pattern

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.css.ts
└── index.ts            # optional re-export
```

**Styles (`ComponentName.css.ts`):**

```typescript
import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { color } from '@/styles/theme.css';

export const container = style({
  padding: '16px',
  backgroundColor: color.primary[50],
});

export const buttonRecipe = recipe({
  base: { /* ... */ },
  variants: {
    variant: {
      primary: { backgroundColor: color.primary[500] },
      secondary: { /* ... */ },
    },
    size: { sm: { /* ... */ }, md: { /* ... */ } },
  },
});
```

**Component (`ComponentName.tsx`):**

```typescript
'use client'; // when using client hooks

import * as styles from './ComponentName.css';

interface ComponentNameProps {
  // ...
}

export function ComponentName(props: ComponentNameProps) {
  return <div className={styles.container}>...</div>;
}
```

---

## 7. Shared components (reuse — do not duplicate)

| Component | Import | Notes |
|-----------|--------|--------|
| `Button` | `@/components/common/Button` | primary, secondary, ghost, outlined, danger |
| `Text` | `@/components/common/Text` | display, headingLg/Md/Sm, titleMd/Sm, bodyLg/Md, labelSm |
| `Modal` | `@/components/common/Modal` | sm, md |
| `Input` | `@/components/common/Input` | |
| `Textarea` | `@/components/common/Textarea` | |
| `Dropdown` | `@/components/common/Dropdown` | |
| `Toggle` | `@/components/common/Toggle` | |
| `Chip` | `@/components/common/Chip` | |
| `ConfirmModal` | `@/components/common/ConfirmModal` | |
| `AddCard` | `@/components/common/AddCard` | |
| `Sidebar` | `@/components/common/Sidebar` | used in `(main)` layout |

**Hooks:** `useDisclosure`, `useToast`, `useToggleArray`

---

## 8. State

- **Global:** Zustand — user + toasts only
- **Server data:** fetch in page or custom hook via `services/*` (pattern below). React Query allowed for new work.

```typescript
const [data, setData] = useState<Type | null>(null);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  const run = async () => {
    setIsLoading(true);
    try {
      const res = await getLesson(id);
      setData(res);
    } catch {
      error('Failed to load');
    } finally {
      setIsLoading(false);
    }
  };
  run();
}, [id]);
```

---

## 9. API pattern (`services/*.ts`)

```typescript
import { axiosInstance } from '@/lib/api/axiosInstance';

export async function getLesson(id: number): Promise<LessonDetail> {
  const { data } = await axiosInstance.get(`/lessons/${id}`);
  return data;
}

export async function updateLesson(id: number, dto: UpdateLessonDto): Promise<void> {
  await axiosInstance.patch(`/lessons/${id}`, dto);
}
```

- Base URL: `${NEXT_PUBLIC_API_URL}/api/v1` (configured on the instance)
- 401 refresh: handled in interceptors
- New domain → new file under `src/services/`

---

## 10. Domain types (check before adding)

- `src/types/student.ts` — `Student`, `StudentDetail`, `IncompleteItem`
- `src/types/lessonStudent.ts` — `LessonStudent`, `LessonStudentItem`, `Attendance`
- `src/app/(main)/template/_types/template.ts` — `TemplateItem`, `ItemType`, `ItemCategory`

**ItemType:** `'TEXT' | 'NUMBER' | 'SELECT' | 'COMPLETE' | 'ATTENDANCE'`  
**Attendance:** `'present' | 'absent' | 'late' | 'leave_early'`

---

## 11. Design tokens

```typescript
import { color } from '@/styles/theme.css';

color.primary[500];
color.gray[200];
color.semantic.success[50];
color.semantic.error[600];
```

Typography scale (prefer `Text` variants):  
`display > headingLg > headingMd > headingSm > titleMd > titleSm > bodyLg > bodyMd > labelSm`

---

## 12. SVG icons

```typescript
import ArrowRightIcon from '@/assets/icons/arrow-right.svg';

<ArrowRightIcon width={20} height={20} />
```

Many icons already exist under `src/assets/icons/`.

---

## 13. Feature checklist

1. Types in `src/types/` or route `_types/`
2. API functions in `src/services/`
3. Optional hook in `src/hooks/`
4. Reuse shared components
5. Styles in `.css.ts` (no inline styles)
6. User feedback via toasts (`useToast`)

---

*Last updated: 2026-04-07 (aligned with team Korean brief; this English file is the repo canonical copy.)*
