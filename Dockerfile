# syntax=docker/dockerfile:1

# =============================================================================
# Stage 1: Build
# =============================================================================
FROM node:22-slim AS builder

WORKDIR /app

# Install sqlite3 for database setup
RUN apt-get update \
    && apt-get install -y --no-install-recommends sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Install all dependencies (including devDependencies for build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and config files
COPY app ./app
COPY assets ./assets
COPY eslint.config.js tsconfig.json vite.config.ts index.html ./

# Build the application
RUN npm run build

# Initialize the database
COPY database.sql ./
RUN npm run setup-db

# =============================================================================
# Stage 2: Production
# =============================================================================
FROM node:22-slim AS production

# Install sqlite3 runtime and create non-root user
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        sqlite3 \
        dumb-init \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 1001 nodejs \
    && useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nodejs

WORKDIR /app

# Copy package files and install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built assets from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/database.db ./
COPY --from=builder /app/index.html ./

# Copy server runtime files (only what's needed)
COPY app/server.tsx app/reducer.ts app/types.ts ./app/

# Set ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Environment configuration
ENV NODE_ENV=production
ENV PORT=5092

# Expose port
EXPOSE 5092

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5092/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the server with tsx
CMD ["npx", "tsx", "app/server.tsx"]
