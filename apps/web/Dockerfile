# ---- Base ----
FROM oven/bun:1.3.7-alpine AS base
WORKDIR /app

RUN apk add --no-cache libc6-compat

# ---- Dependencies ----
FROM base AS deps

COPY package.json bun.lock turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/prisma-generator-ids/package.json ./packages/prisma-generator-ids/

RUN bun install --frozen-lockfile

# ---- Dev image ----
FROM base AS dev

COPY --from=deps /app/node_modules ./node_modules
COPY . .

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["bun", "run", "dev"]
