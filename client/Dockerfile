FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Load env for build-time (NEXT_PUBLIC_ vars are inlined at build)
COPY .env* ./

RUN bun run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Load env for runtime
COPY .env* ./

EXPOSE 3000

CMD ["bun", "server.js"]
