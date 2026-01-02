# syntax=docker/dockerfile:1

FROM node:18.4.0-slim

# Install sqlite3 and clean up apt cache
RUN apt-get update \
    && apt-get install -y --no-install-recommends sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /opt/app

# Install dependencies (copy package files first for better caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code and config
COPY app ./app
COPY assets ./assets
COPY .eslintrc.cjs tsconfig.json vite.config.ts index.html ./

# Build for production
RUN npm run build

# Prune dev dependencies (keep app/server.tsx for production, remove React components)
RUN find app -type f ! -name 'server.tsx' ! -name 'reducer.ts' -delete \
    && find app -type d -empty -delete \
    && npm prune --production

# Initialize database
COPY database.sql ./
RUN npm run setup-db

# Define environment variables
ENV NODE_ENV=production
ENV PORT=5092

# Expose port
EXPOSE 5092

# Start the server
CMD ["npx", "tsx", "app/server.tsx"]
