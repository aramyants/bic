# syntax=docker/dockerfile:1.5
FROM node:22 AS deps
WORKDIR /app

# Allow build to proceed even if DATABASE_URL is not provided (placeholder is overridden at runtime)
ARG DATABASE_URL=postgres://placeholder:placeholder@localhost:5432/placeholder
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false

# Install deps (cache npm downloads between builds)
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM node:22 AS builder
WORKDIR /app
ARG DATABASE_URL=postgres://placeholder:placeholder@localhost:5432/placeholder
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --omit=dev

# -------- Runtime image --------
FROM node:22-slim AS runner
WORKDIR /app
ARG DATABASE_URL=postgres://placeholder:placeholder@localhost:5432/placeholder
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Next standalone server output
COPY --from=builder /app/.next/standalone ./

# Static assets
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Full node_modules so scripts can use drizzle, dotenv, etc.
COPY --from=builder /app/node_modules ./node_modules
# package.json for npm scripts
COPY --from=builder /app/package*.json ./

# Migration / seed scripts
COPY --from=builder /app/scripts ./scripts

# Drizzle migrations + meta/_journal.json
COPY --from=builder /app/drizzle ./drizzle

EXPOSE 3000
CMD ["sh", "-c", "npm run db:migrate && node server.js"]
