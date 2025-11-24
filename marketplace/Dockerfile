FROM node:22 AS deps
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Build the app
COPY . .
RUN npm run build

# -------- Runtime image --------
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Next standalone server output
COPY --from=deps /app/.next/standalone ./

# Static assets
COPY --from=deps /app/.next/static ./.next/static
COPY --from=deps /app/public ./public

# Full node_modules so scripts can use drizzle, dotenv, etc.
COPY --from=deps /app/node_modules ./node_modules

# Migration / seed scripts
COPY --from=deps /app/scripts ./scripts

# Drizzle migrations + meta/_journal.json
COPY --from=deps /app/drizzle ./drizzle

EXPOSE 3000
CMD ["node", "server.js"]
