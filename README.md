# NestHub Monorepo

A full-stack monorepo using **NestJS** (API) and **Next.js** (Web), powered by **Turborepo** and **Bun**.

---

## Stack

- [Bun](https://bun.sh) — package manager & runtime
- [Turborepo](https://turbo.build) — monorepo build system
- [NestJS](https://nestjs.com) — backend API
- [Next.js](https://nextjs.org) — frontend
- [Prisma](https://prisma.io) — ORM & database client
- [Biome](https://biomejs.dev) — linter & formatter (replaces ESLint + Prettier)
- [TanStack Query](https://tanstack.com/query) — data fetching & caching
- [Orval](https://orval.dev) — auto-generates TanStack Query hooks from Swagger

---

## Getting Started

### Prerequisites

Make sure you have **Bun** installed:

```bash

``if u have windows:
powershell -c "irm bun.sh/install.ps1 | iex"

``if u have linux/mac:`
curl -fsSL https://bun.sh/install | bash

```

### Install dependencies

From the root of the monorepo:

```bash
bun install
```

### Environment variables

Copy the example env file in `apps/api` and fill in your database URL:

```bash
cp apps/api/.env.example apps/api/.env
```

```apps/api/env
DATABASE_URL="postgresql://user:password@localhost:5432/postgres"
```

```env
# ---- Database (PostgreSQL) ----
DB_USER=postgres
DB_PASS=corenest
DB_NAME=postgres
DB_PORT=5433

# ---- pgAdmin ----
PGADMIN_EMAIL=admin@nesthub.local
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050

# ---- API (NestJS) ----
API_PORT=8000

# ---- Web (Next.js) ----
WEB_PORT=3000
```

### Docker Run

```bash
bun run db:start:docker
```

### Database setup

```bash
bun prisma generate --schema apps/api/prisma/schema.prisma
bun prisma db push
```

---

## Development

Start both `api` and `web` in watch mode:

```bash
bun turbo start:dev --filter=api --filter=web
```

Or start them individually:

```bash
bun turbo start:dev --filter=api
bun turbo start:dev --filter=web
```

| App           | URL                        |
| ------------- | -------------------------- |
| API (NestJS)  | http://localhost:8000      |
| Web (Next.js) | http://localhost:3000      |
| Swagger docs  | http://localhost:8000/docs |

> **Every time you start the app**, `@repo/api-client` waits for the API to boot, then uses Orval to auto-generate fully typed TanStack Query hooks from the Swagger schema. Your frontend always has up-to-date hooks.

---

## API Client

Hooks are auto-generated from the NestJS Swagger spec into `packages/api-client/src/generated/` on every dev start using Orval.

### Adding a new endpoint

1. Add the controller method in `apps/api` with proper `@ApiTags` decorator
2. Restart the app with `bun turbo start:dev --filter=api --filter=web`
3. Hooks are regenerated automatically and instantly available in `@repo/api-client`

### NestJS controller example

```typescript
import { ApiTags } from '@nestjs/swagger'

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get()
  findAll() { ... }

  @Post()
  create(@Body() dto: CreateUserDto) { ... }
}
```

### Using generated hooks in Next.js

Orval generates hooks per Swagger tag — no need to write them manually:

```typescript
import { useGetUsers, useCreateUser } from "@repo/api-client";

// In your component
const { data } = useGetUsers();

const { mutate: createUser } = useCreateUser();
createUser({ name: "John", email: "john@example.com" });
```

---

## Linting & Formatting

This project uses **Biome** instead of ESLint and Prettier.

```bash
# Check and fix lint + format issues
bun biome check . --write

# Lint only
bun biome lint .

# Format only
bun biome format . --write
```

Biome config is located at `biome.json` in the root.

---

## Project Structure

```
nesthub-monorepo/
├── apps/
│   ├── api/                  # NestJS backend
│   └── web/                  # Next.js frontend
├── packages/
│   └── api-client/           # Auto-generated TanStack Query hooks
│       ├── scripts/
│       │   └── generate.ts   # Waits for API, then runs Orval
│       ├── orval.config.ts   # Orval config
│       └── src/
│           ├── generated/    # Auto-generated — do not edit manually
│           └── index.ts      # Re-exports all generated hooks
├── biome.json                # Biome config (lint + format)
├── turbo.json                # Turborepo config
└── package.json              # Root dependencies
```
