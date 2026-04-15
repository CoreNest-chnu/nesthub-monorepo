# ---- Base ----
FROM oven/bun:1.3.7-alpine AS base
WORKDIR /app

# Потрібно для Prisma на Alpine (OpenSSL)
RUN apk add --no-cache openssl libc6-compat

# ---- Dependencies ----
FROM base AS deps

# Копіюємо манифести монорепо
COPY package.json bun.lock turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

RUN bun install --frozen-lockfile

# ---- Dev image ----
FROM base AS dev

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генеруємо Prisma client
WORKDIR /app/apps/api
RUN bunx prisma generate

EXPOSE 8000

# На старті контейнера: міграції + dev сервер
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start:dev"]
