<div align="center">

# 🛒 NestHub

### Simplified E-commerce Platform

A full-stack e-commerce web application inspired by platforms like Rozetka — with reduced complexity and a focus on core functionality. Built as a Turborepo monorepo with **NestJS**, **Next.js**, **Prisma** and **Bun**.

<br/>

![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)

![Version](https://img.shields.io/badge/version-1.0.0-2E75B6?style=flat-square)
![Status](https://img.shields.io/badge/status-MVP%20complete-2E7D32?style=flat-square)
![License](https://img.shields.io/badge/license-Academic-lightgrey?style=flat-square)

</div>

---

## 📑 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Hub & Links](#-project-hub--links)
- [Getting Started](#-getting-started)
  - [System Requirements](#system-requirements)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Clone](#2-clone)
  - [3. Install dependencies](#3-install-dependencies)
  - [4. Environment variables](#4-environment-variables)
  - [5. Start the database](#5-start-the-database-docker)
  - [6. Database setup](#6-database-setup)
  - [7. Run the apps](#7-run-the-apps)
- [Test Accounts](#-test-accounts)
- [API Client (Orval)](#-api-client-orval)
- [Testing](#-testing)
- [Linting & Formatting](#-linting--formatting)
- [Scripts Reference](#-scripts-reference)
- [Project Structure](#-project-structure)
- [Team](#-team)
- [License](#-license)

---

## 📖 About

**NestHub** is a learning full-stack project that demonstrates the complete product development cycle — from requirements analysis to a deployable MVP. It represents an online store where users can browse, search and purchase products, with a minimalist and fast UX focused on essential features.

The system follows a **Swagger-first** workflow: the NestJS API exposes an OpenAPI schema, and a fully typed TanStack Query client is auto-generated for the frontend via **Orval** — keeping backend and frontend always in sync.

---

## ✨ Features

| Domain | Capabilities |
| ------ | ------------ |
| 🔐 **Authentication & Profile** | Email/password registration, JWT login, view & edit profile, role-based access (user / admin) |
| 🗂️ **Product Catalog** | Paginated catalog, category filtering, keyword search, product detail pages, stock indicator |
| 🛒 **Shopping Cart** | Add / update / remove items, quantity & stock validation, live total recalculation |
| 📦 **Checkout & Orders** | Order creation from cart (transactional), stock deduction, order history & details |
| 🛠️ **Admin Panel** | Create / edit products & categories, manage orders and statuses (admin only) |

---

## 📸 Screenshots

> Screenshots live in [`docs/screenshots/`](docs/screenshots/) — see the [guide there](docs/screenshots/README.md) for the exact file names and what each shot should show.

<div align="center">

| Catalog | Product Page |
| :-----: | :----------: |
| ![Catalog](docs/screenshots/catalog.png) | ![Product](docs/screenshots/product.png) |

| Cart | Checkout |
| :--: | :------: |
| ![Cart](docs/screenshots/cart.png) | ![Checkout](docs/screenshots/checkout.png) |

</div>

---

## 🧰 Tech Stack

- [Bun](https://bun.sh) — package manager & runtime
- [Turborepo](https://turbo.build) — monorepo build system
- [NestJS](https://nestjs.com) — backend API
- [Next.js](https://nextjs.org) — frontend (App Router)
- [Prisma](https://prisma.io) — ORM & database client
- [PostgreSQL](https://www.postgresql.org) — relational database
- [TanStack Query](https://tanstack.com/query) — data fetching & caching
- [Orval](https://orval.dev) — auto-generates TanStack Query hooks from Swagger
- [Biome](https://biomejs.dev) — linter & formatter (replaces ESLint + Prettier)

---

## 🏗️ Architecture

**Modular Monolith** (macro) · **Layered architecture** — Controller → Service → Prisma (micro) · **App Router + TanStack Query** (frontend).

```mermaid
flowchart LR
    U[👤 Browser] --> WEB[Next.js · Web :3000]
    WEB -->|typed hooks| AC["@repo/api-client<br/>(Orval-generated)"]
    AC -->|REST / JSON| API[NestJS · API :8000]
    API -->|Prisma| DB[(PostgreSQL :5433)]
    API -.->|OpenAPI schema| AC
```

The API client is regenerated from the live Swagger schema on every dev start, so the frontend always consumes an up-to-date, fully typed contract.

---

## 🔗 Project Hub & Links

> ℹ️ **Swagger is not a hosted link** — it is served locally by the API. After you run the project, open `http://localhost:8000/docs`. The static contract is also committed at `docs/openapi.json`.

| Resource | Link |
| -------- | ---- |
| 📦 Repository | [github.com/CoreNest-chnu/nesthub-monorepo](https://github.com/CoreNest-chnu/nesthub-monorepo) |
| 🗒️ Task Board (GitHub Projects) | _[https://github.com/orgs/CoreNest-chnu/projects/1]_ |
| 🧠 Project Hub (Notion) | _[https://app.notion.com/p/NestHub-33e321913bcb80cd8591f24cf5d75c18]_ |
| 🎨 UI Prototypes (Figma) | _[https://www.figma.com/design/2ELKLGyUynEiB1fLZRPmVQ/CoreNest-%E2%80%94-Low-Fi-Wireframes?node-id=0-1&p=f&t=o8wdZVdseNPCCmIM-0]_ |
| 🧩 User Flow (FigJam) | _[https://www.figma.com/board/RS55t5oy2aixwTqsJAovk5/CoreNest-%E2%80%94-User-Flow-Map?node-id=0-1&p=f&t=i5vUBF6P5iCpVaco-0]_ |
| 📚 API Docs (Swagger UI) | `http://localhost:8000/docs` _(local, after start)_ |
| 📄 OpenAPI Schema (JSON) | `http://localhost:8000/docs-json` · `docs/openapi.json` |

---

## 🚀 Getting Started

### System Requirements

| Tool | Version | Notes |
| ---- | ------- | ----- |
| **Docker** | ≥ 24 | full stack runs in containers |
| **Docker Compose** | ≥ 2.20 | bundled with Docker Desktop |
| **Bun** | ≥ 1.3 | only for the local (non-Docker) workflow |
| **OS** | Windows / macOS / Linux | line endings normalized via `.gitattributes` |
| **RAM** | ≥ 4 GB free | recommended |
| **CPU** | 2+ cores | recommended |

---

### ⚡ Quick Start (Docker — recommended)

Bring up **the entire stack** (PostgreSQL, pgAdmin, API and Web) with a single command. The API container automatically runs `prisma migrate deploy` on boot.

```bash
git clone https://github.com/CoreNest-chnu/nesthub-monorepo.git
cd nesthub-monorepo
cp .env.example .env
cp apps/api/.env.example apps/api/.env   # then fill JWT_SECRET & STATIC_SALT (see step 4)
cp apps/web/.env.example apps/web/.env
docker compose up --build
```

Once the containers are healthy, **seed demo data & test accounts** (one-time):

```bash
docker compose exec api bun run seed
```

| App           | URL                          |
| ------------- | ---------------------------- |
| Web (Next.js) | http://localhost:3000        |
| API (NestJS)  | http://localhost:8000        |
| Swagger docs  | http://localhost:8000/docs   |
| pgAdmin       | http://localhost:5050        |

> Prefer running the apps natively (hot reload outside Docker)? Follow the manual steps below.

---

### 🛠️ Manual Setup (local apps + Dockerized DB)

### 1. Prerequisites

Install **Bun**:

**Windows (PowerShell):**

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Linux / macOS:**

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Clone

```bash
git clone https://github.com/CoreNest-chnu/nesthub-monorepo.git
cd nesthub-monorepo
```

### 3. Install dependencies

From the root of the monorepo:

```bash
bun install
```

### 4. Environment variables

**a) Root `.env`** — used by Docker Compose (database, pgAdmin, ports). Copy the example and adjust if needed:

```bash
cp .env.example .env
```

```env
# ---- Database (PostgreSQL) ----
DB_USER=postgres
DB_PASS=corenest
DB_NAME=postgres
DB_PORT=5433

# ---- pgAdmin ----
PGADMIN_EMAIL=admin@nesthub.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050

# ---- API (NestJS) ----
API_PORT=8000

# ---- Web (Next.js) ----
WEB_PORT=3000
```

**b) API `.env`** — used by Prisma / NestJS. Copy the example and fill in the values (note the port matches `DB_PORT` above):

```bash
cp apps/api/.env.example apps/api/.env
```

```env
DATABASE_URL="postgresql://postgres:corenest@localhost:5433/postgres"
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="86400"          # 24 hours in seconds
STATIC_SALT="change-me-too"     # pepper added to passwords before hashing
```

> ⚠️ `STATIC_SALT` must stay constant — it is mixed into every password hash, so changing it invalidates all existing logins (including the seeded test accounts).

**c) Web `.env`** — used by Next.js auth. Copy the example:

```bash
cp apps/web/.env.example apps/web/.env
```

```env
AUTH_SECRET="change-me"
```

> ⚠️ Real `.env` files are git-ignored. Never commit secrets — only `.env.example` files belong in the repo.

### 5. Start the database (Docker)

```bash
bun run db:start:docker
```

This spins up **PostgreSQL** (`localhost:5433`) and **pgAdmin** (`http://localhost:5050`).

### 6. Database setup

Run these from the API workspace (where the Prisma schema & migrations live):

```bash
bun run --filter=api generate        # generate the Prisma client
cd apps/api && bunx prisma migrate deploy && cd ../..   # apply migrations
bun run --filter=api seed            # seed categories, products, promo codes & test accounts
```

> The seed is idempotent for users and promo codes (upsert), so re-running it refreshes the test accounts without duplicates.

### 7. Run the apps

Start both `api` and `web` in watch mode:

```bash
bun turbo start:dev --filter=api --filter=web
```

Or individually:

```bash
bun turbo start:dev --filter=api
bun turbo start:dev --filter=web
```

| App           | URL                          |
| ------------- | ---------------------------- |
| Web (Next.js) | http://localhost:3000        |
| API (NestJS)  | http://localhost:8000        |
| Swagger docs  | http://localhost:8000/docs   |
| pgAdmin       | http://localhost:5050        |

> **On every start**, `@repo/api-client` waits for the API to boot, then runs Orval to auto-generate fully typed TanStack Query hooks from the Swagger schema — so your frontend always has up-to-date hooks.

---

## 🔑 Test Accounts

Created by the seed script (`bun run --filter=api seed`). Use these to explore the app:

| Role  | Email             | Password    |
| ----- | ----------------- | ----------- |
| Admin | `admin@gmail.com` | `PASSWORD1` |
| User  | `user@gmail.com`  | `PASSWORD1` |

> These credentials are demo-only and assume the default `STATIC_SALT`. You can also register your own account from the UI.

**Seeded promo codes** (apply at checkout):

| Code         | Discount    |
| ------------ | ----------- |
| `SAVE10`     | −10%        |
| `SAVE20`     | −20%        |
| `WELCOME100` | −100 ₴      |

---

## 🧬 API Client (Orval)

Hooks are auto-generated from the NestJS Swagger spec into `packages/api-client/src/generated/` on every dev start using Orval.

### Adding a new endpoint

1. Add the controller method in `apps/api` with the proper `@ApiTags` decorator.
2. Restart with `bun turbo start:dev --filter=api --filter=web`.
3. Hooks are regenerated automatically and instantly available in `@repo/api-client`.

### NestJS controller example

```typescript
import { ApiTags } from '@nestjs/swagger'

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get()
  findAll() { /* ... */ }

  @Post()
  create(@Body() dto: CreateUserDto) { /* ... */ }
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

## 🧪 Testing

```bash
# Run unit tests
bun turbo test

# Run API tests only
bun turbo test --filter=api

# End-to-end / coverage (if configured)
bun turbo test:e2e
```

Final MVP test status and known issues are documented in the **Test Summary Report** (see [Project Hub](#-project-hub--links)).

---

## 🎨 Linting & Formatting

This project uses **Biome** instead of ESLint and Prettier.

```bash
# Check and fix lint + format issues
bun biome check . --write

# Lint only
bun biome lint .

# Format only
bun biome format . --write
```

Biome config lives at `biome.json` in the root.

---

## 📜 Scripts Reference

| Command | Description |
| ------- | ----------- |
| `docker compose up --build` | Build & run the full stack (DB, pgAdmin, API, Web) |
| `docker compose exec api bun run seed` | Seed demo data inside the running API container |
| `bun install` | Install all monorepo dependencies |
| `bun run db:start:docker` | Start PostgreSQL + pgAdmin via Docker |
| `bun run --filter=api generate` | Generate the Prisma client |
| `bunx prisma migrate deploy` | Apply migrations (run inside `apps/api`) |
| `bun run --filter=api seed` | Seed demo data & test accounts |
| `bun turbo start:dev --filter=api --filter=web` | Run API + Web in watch mode |
| `bun turbo build` | Production build of all apps |
| `bun biome check . --write` | Lint + format the whole repo |

---

## 📁 Project Structure

```
nesthub-monorepo/
├── apps/
│   ├── api/                  # NestJS backend
│   │   ├── prisma/           # Prisma schema, migrations & seed
│   │   └── src/              # Modules: auth, products, cart, orders, admin
│   └── web/                  # Next.js frontend (App Router)
├── packages/
│   ├── api-client/           # Auto-generated TanStack Query hooks
│   │   ├── scripts/
│   │   │   └── generate.ts   # Waits for API, then runs Orval
│   │   ├── orval.config.ts   # Orval config
│   │   └── src/
│   │       ├── generated/    # Auto-generated — do not edit manually
│   │       └── index.ts      # Re-exports all generated hooks
│   ├── ui/                   # Shared UI components
│   ├── eslint-config/        # Shared lint config
│   └── typescript-config/    # Shared TS config
├── docs/
│   ├── openapi.json          # Committed OpenAPI contract
│   └── screenshots/          # README screenshots
├── biome.json                # Biome config (lint + format)
├── turbo.json                # Turborepo config
├── .env.example              # Root env template (DB, pgAdmin, ports)
└── package.json              # Root dependencies
```

---

## 👥 Team

| Role | Member |
| ---- | ------ |
| Mentor | Красовський С.В. |
| Project Manager | Куруляк Е.О. |
| Backend Developer | Оробець О.О. |
| Frontend Developer | Голюк О.В. |
| Database Engineer | Кіореско І.М. |
| QA Engineer | Яковенко А.В. |

---

## 📄 License

This project was developed as an academic full-stack practicum and is intended for educational purposes.

<div align="center">

**NestHub** · v1.0.0 · Made by the CoreNest team 🪺

</div>