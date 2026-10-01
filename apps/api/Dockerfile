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
COPY packages/prisma-generator-ids/package.json ./packages/prisma-generator-ids/

RUN bun install --frozen-lockfile

# ---- Production dependencies ----
# Лише runtime-залежності воркспейсу api (без devDependencies і без пакетів
# web/api-client), щоб у prod-образ не потрапляли next, orval тощо.
FROM deps AS prod-deps
RUN rm -rf node_modules && bun install --frozen-lockfile --production --filter api

# ---- Dev image ----
FROM base AS dev

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генеруємо Prisma client.
# Кастомний генератор `ids` пише той самий generated/prisma/types.ts, що й
# prisma-client, і за порядком/часом може програти гонку. Тому форсуємо
# повторний прогін лише генератора `ids`, щоб його types.ts завжди переміг.
WORKDIR /app/apps/api
RUN bunx prisma generate && bunx prisma generate --generator ids

EXPOSE 8000

# На старті контейнера: міграції + dev сервер
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start:dev"]

# ---- Build ----
FROM dev AS build
RUN bun run build

# ---- Production image ----
FROM base AS prod
ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules ./node_modules
COPY package.json ./
COPY --from=build /app/apps/api/package.json /app/apps/api/prisma.config.ts ./apps/api/
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api

RUN echo '{ "compilerOptions": { "baseUrl": "." } }' > dist/tsconfig.json

EXPOSE 8000

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start:prod"]
