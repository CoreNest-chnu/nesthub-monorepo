# Epic 5 — Admin Tasks

Implementation-ready task descriptions split by competence area. Each backend task should be paired with its corresponding frontend task (they form vertical slices of the same user story).

## Backend (apps/api)

| # | Task | US | Estimate |
|---|------|----|----|
| 5.1-BE-1 | [Create POST /admin/products endpoint](./backend/5.1-be-1-create-product-endpoint.md) | 5.1 | 2h |
| 5.1-BE-2 | [Implement RolesGuard and @Roles decorator](./backend/5.1-be-2-roles-guard.md) | 5.1 | 1h |
| 5.2-BE-1 | [Create PATCH /admin/products/:id endpoint](./backend/5.2-be-1-update-product-endpoint.md) | 5.2 | 2h |
| 5.3-BE-1 | [Create CRUD endpoints for /admin/categories](./backend/5.3-be-1-categories-crud.md) | 5.3 | 2h |
| 5.4-BE-1 | [Create admin order endpoints with status transitions](./backend/5.4-be-1-orders-endpoints.md) | 5.4 | 3h |

## Frontend (apps/web)

| # | Task | US | Estimate |
|---|------|----|----|
| 5.1-FE-1 | [Build product creation form at /admin/products/new](./frontend/5.1-fe-1-create-product-form.md) | 5.1 | 3h |
| 5.1-FE-2 | [Wire create-product form to API with redirect](./frontend/5.1-fe-2-create-product-submit.md) | 5.1 | 1h |
| 5.2-FE-1 | [Build product edit form at /admin/products/:id/edit](./frontend/5.2-fe-1-edit-product-form.md) | 5.2 | 3h |
| 5.2-FE-2 | [Wire edit-product form save flow](./frontend/5.2-fe-2-edit-product-submit.md) | 5.2 | 1h |
| 5.3-FE-1 | [Build category management page /admin/categories](./frontend/5.3-fe-1-categories-page.md) | 5.3 | 3h |
| 5.4-FE-1 | [Build /admin/orders list with status filter](./frontend/5.4-fe-1-orders-page.md) | 5.4 | 3h |
| 5.4-FE-2 | [Implement order status change with confirmation](./frontend/5.4-fe-2-orders-status-change.md) | 5.4 | 1h |

## Project Conventions (quick reference)

### Backend (NestJS)
- Module structure: `apps/api/src/<feature>/` with `*.controller.ts`, `*.service.ts`, `*.module.ts`, `dto/`
- Prisma access via injected `PrismaService` (not direct `PrismaClient`)
- DTOs use `class-validator` decorators (not zod)
- Existing empty skeleton: `apps/api/src/admin/{admin.controller,admin.service,admin.module}.ts` — fill these in
- Auth: `JwtAuthGuard` from `apps/api/src/auth/auth.guard.ts`; `req.user.role` is `'admin' | 'user'`
- After adding endpoints, the Swagger spec is consumed by Orval to auto-generate frontend hooks

### Frontend (Next.js App Router)
- Routes under `apps/web/src/app/admin/` (placeholders exist for `products/` and `orders/`)
- shadcn/ui components in `apps/web/src/components/ui/` — extend rather than re-implement; add missing primitives (`Select`, `Dialog`, `Form`, `Table`, `Tabs`, `Badge`, `Textarea`, `DropdownMenu`) via `npx shadcn@latest add <component>`
- Forms: `react-hook-form` + `zodResolver`, schemas in `apps/web/src/validation/validationSchema.ts`, fields wrapped in `Field` (`apps/web/src/components/Field.tsx`)
- API hooks from `@repo/api-client` (Orval-generated TanStack Query hooks)
- Toasts: `sonner` (`toast.success(...)`, `toast.error(...)`)
- Auth/role: `useSession()` from `next-auth/react`; role available in session token. Guard admin routes via `middleware.ts` redirecting non-admins to `/`
- All copy in English
