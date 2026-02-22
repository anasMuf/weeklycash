# AGENT.md — Coding Standards & Guidelines

## Project Overview

This is a **pnpm monorepo** starterkit with a Hono backend and TanStack Start (React) frontend.

### Monorepo Structure

```
monorepo_starterkit/
├── apps/
│   ├── api/          # Backend — Hono + Prisma + Zod
│   └── platform/     # Frontend — TanStack Start + React + Tailwind v4 + shadcn/ui
├── packages/         # Shared packages (e.g., @repo/db, @repo/validators)
├── biome.json        # Linter & formatter config (root-level, applies to all)
├── pnpm-workspace.yaml
└── docker-compose.dev.yml
```

### Tech Stack

| Layer         | Technology                                        |
|---------------|---------------------------------------------------|
| Package Mgr   | pnpm workspaces                                   |
| Backend       | Hono (Node.js server via `@hono/node-server`)     |
| Frontend      | TanStack Start (React 19, file-based routing)     |
| Styling       | Tailwind CSS v4 (via `@tailwindcss/vite` plugin)  |
| UI Components | shadcn/ui (new-york style, neutral base color)    |
| Database      | PostgreSQL 16 (Docker) + Prisma ORM               |
| Validation    | Zod                                               |
| API Client    | Hono RPC (`hc<AppType>`)                          |
| State/Data    | TanStack Query                                    |
| Linter        | Biome 2.4.4                                       |
| Git Hooks     | Husky (pre-commit runs `pnpm lint`)               |

---

## Formatting & Linting

All formatting and linting is handled by **Biome** (not ESLint/Prettier). Configuration lives in the root `biome.json`.

### Key Rules

- **Indentation**: Tabs (not spaces)
- **Quotes**: Double quotes (`"`) for JavaScript/TypeScript
- **Semicolons**: Always (Biome default)
- **Imports**: Auto-organized by Biome assist (`organizeImports: "on"`)
- **Tailwind**: `css.parser.tailwindDirectives` enabled, `linter.domains.tailwind` set to `"recommended"`

### Commands

```bash
pnpm lint          # Check for lint errors (does not modify files)
pnpm lint:fix      # Auto-fix lint errors and format code
```

### Pre-commit Hook

Husky runs `pnpm lint` before every commit. All code must pass lint checks to be committed.

### Auto-generated Files

Files matching `**/*.gen.ts` (e.g., `routeTree.gen.ts`) are **excluded** from linting. Never edit these files manually.

---

## Frontend (`apps/platform`)

### Framework: TanStack Start

This is a **TanStack Start** app (full-stack React framework) using **file-based routing**.

- Routes live in `src/routes/`
- The root route is `src/routes/__root.tsx`
- Route tree is auto-generated at `src/routeTree.gen.ts` — **do not edit manually**

### Path Aliases

Use `@/` to reference files relative to `src/`:

```typescript
// ✅ Good
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ❌ Bad — avoid deep relative imports
import { Button } from "../../../components/ui/button";
```

Configured in `tsconfig.json` as `"@/*": ["./src/*"]`.

### UI Components (shadcn/ui)

shadcn/ui is installed in `apps/platform` with the **new-york** style.

- UI components live in `src/components/ui/`
- Utility `cn()` function is in `src/lib/utils.ts`
- Icon library: **lucide-react**
- Adding new components:
  ```bash
  cd apps/platform
  pnpm dlx shadcn@latest add <component-name>
  ```

### Component Conventions

- Use **function declarations** (not arrow functions) for components:
  ```typescript
  // ✅ Good
  function MyComponent({ title }: Props) {
    return <div>{title}</div>;
  }

  // ❌ Bad
  const MyComponent = ({ title }: Props) => {
    return <div>{title}</div>;
  };
  ```
- Use `React.ComponentProps<"element">` for extending HTML element props
- All `<button>` elements must have an explicit `type` attribute (`"button"`, `"submit"`, or `"reset"`)
- Export components as **named exports** (not default exports), except for route components

### Styling

- Use **Tailwind CSS v4** utility classes. No separate CSS files per component.
- Use the `cn()` utility for conditional/merged class names:
  ```typescript
  <div className={cn("base-class", isActive && "active-class")} />
  ```
- Global styles and CSS variables are in `src/styles.css`
- Tailwind directives (`@apply`, `@theme`, `@layer`) are fully supported via Biome's `tailwindDirectives` parser

### Data Fetching

- Use **TanStack Query** for all server state
- API client uses **Hono RPC** for end-to-end type safety:
  ```typescript
  import { api } from "@/utils/api";
  // 'api' is a typed client derived from the backend's AppType
  ```

### Testing

- Test runner: **Vitest** with **jsdom** environment
- Test utilities: `@testing-library/react` and `@testing-library/dom`
- Run tests:
  ```bash
  cd apps/platform
  pnpm test
  ```

---

## Backend (`apps/api`)

### Framework: Hono

- Entry point: `src/index.ts`
- Runs on `http://localhost:8000`
- Uses `@hono/node-server` for Node.js runtime
- Dev server: `tsx watch` for hot-reloading

### API Pattern

- Export the app type for frontend type safety:
  ```typescript
  const app = new Hono()
    .use(cors())
    .get("/endpoint", (c) => c.json({ data: "value" }));

  export type AppType = typeof app;
  ```
- Use method chaining on the Hono app instance so TypeScript can infer the full route type
- Validate request bodies with `@hono/zod-validator`

### Database

- ORM: **Prisma** with PostgreSQL
- Prisma commands are scoped to `apps/api`:
  ```bash
  cd apps/api
  pnpm db:migrate     # Run migrations
  pnpm db:generate    # Generate Prisma client
  pnpm db:studio      # Open Prisma Studio
  ```
- Generated Prisma client lives in `src/generated/` (gitignored)

---

## Shared Packages (`packages/`)

Shared packages live under `packages/` and are referenced in the workspace.

### Creating a New Package

1. Create a directory: `packages/<name>/`
2. Use scope `@repo/<name>` in its `package.json`
3. Set `"type": "module"` and export via `"exports": { ".": "./src/index.ts" }`
4. Reference from apps: `"@repo/<name>": "workspace:*"`

---

## Environment Variables

- All env vars are defined in the root `.env` file
- Apps load them via `dotenv-cli` (see `with-env` scripts)
- Frontend-accessible env vars must be prefixed with `VITE_`
- Required variables (see `.env.example`):
  ```env
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
  VITE_API_BASE_URL="http://localhost:8000"
  ```

---

## Development Commands

```bash
# Start all apps (api + platform) in parallel
pnpm dev

# Start individual apps
pnpm api:dev
pnpm platform:dev

# Build
pnpm build

# Database (from apps/api)
pnpm db:migrate
pnpm db:generate
pnpm db:studio

# Docker (PostgreSQL)
docker compose -f docker-compose.dev.yml up -d
```

---

## TypeScript Conventions

- **Strict mode** is enabled
- Use `type` imports where possible: `import type { Foo } from "bar"`
- `verbatimModuleSyntax` is enabled — always use explicit `type` keyword for type-only imports
- Target: **ES2022**
- Module resolution: **Bundler**
- All modules use **ESM** (`"type": "module"` in package.json)
