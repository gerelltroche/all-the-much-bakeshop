# Multi-stage Dockerfile for Next.js 16 (App Router)
# Uses Debian slim for better native module compatibility (Tailwind v4 oxide binaries)

# Stage 1: Builder
FROM node:22-slim AS builder
WORKDIR /app

# Accept build args for prisma generate and Next.js build
ARG DATABASE_URL
ARG STRIPE_SECRET_KEY=sk_build_placeholder
ENV DATABASE_URL=${DATABASE_URL}
ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}

# Copy package files and prisma config (needed for postinstall: prisma generate)
COPY package.json package-lock.json* ./
COPY prisma ./prisma
COPY prisma.config.ts ./

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Delete and regenerate lock file to resolve platform-specific optional deps
# This is needed because npm has bugs with optional deps across platforms
RUN rm -f package-lock.json && npm install

# Copy remaining source files
COPY . .

# Build Next.js app in standalone mode
# This creates a minimal production server
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Runner (Production)
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Copy only necessary files from builder
# Standalone mode bundles everything needed
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma generated client (Prisma 7 uses custom output path)
COPY --from=builder --chown=nextjs:nodejs /app/lib/generated/prisma ./lib/generated/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Create uploads directory for product images
RUN mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
