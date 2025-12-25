FROM node:22 AS deps
WORKDIR /app

# Allow build to proceed even if DATABASE_URL is not provided (placeholder is overridden at runtime)
ARG DATABASE_URL=postgres://placeholder:placeholder@localhost:5432/placeholder
ENV DATABASE_URL=${DATABASE_URL}

# Install deps
COPY package*.json ./
RUN npm ci

# Build the app
COPY . .
RUN npm run build

# -------- Runtime image --------
FROM node:22-slim AS runner
WORKDIR /app
ARG DATABASE_URL=postgres://placeholder:placeholder@localhost:5432/placeholder
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=${DATABASE_URL}

# Next standalone server output
COPY --from=deps /app/.next/standalone ./

# Static assets
COPY --from=deps /app/.next/static ./.next/static
COPY --from=deps /app/public ./public

# Full node_modules so scripts can use drizzle, dotenv, etc.
COPY --from=deps /app/node_modules ./node_modules
# package.json for npm scripts
COPY --from=deps /app/package*.json ./

# Migration / seed scripts
COPY --from=deps /app/scripts ./scripts

# Drizzle migrations + meta/_journal.json
COPY --from=deps /app/drizzle ./drizzle

EXPOSE 3000
CMD ["sh", "-c", "npm run db:migrate && node server.js"]
