# Build stage (keep NODE_ENV unset/development so devDependencies are installed)
# Use Debian slim instead of Alpine because native packages like @swc/core
# can fail during postinstall on musl-based images in some CI/container hosts.
FROM node:22.15.0-slim AS builder

WORKDIR /app

# Copy source code first so npm workspaces resolve locally
COPY . .

# Install dependencies (workspaces need to be on-disk for npm ci to symlink them properly)
RUN npm ci

# Align tsconfig project references with the Nx graph (required in non-TTY Docker: `nx build` exits if out of sync).
RUN npx nx sync

# Build packages first in dependency order; serial so dist/ exists.
# shared-config and database have emitDeclarationOnly:false so they produce runnable JS.
RUN npx nx run-many -t build --projects=@org/database,@org/shared-config,@org/ui --configuration=production --parallel=1

# Build apps (libs ready); run in parallel to avoid timeout.
RUN npx nx run-many -t build --projects=@org/api-gateway,@org/application,@org/authentication,@org/notification,@org/settings --configuration=production

# Nx/Webpack output is per-app (apps/<name>/dist/). Assemble into dist/apps/<name>/ for runtime.
RUN mkdir -p dist/apps && \
  cp -r apps/backend/api-gateway/dist dist/apps/api-gateway && \
  cp -r apps/backend/authentication/dist dist/apps/authentication && \
  cp -r apps/backend/application/dist dist/apps/application && \
  cp -r apps/backend/notification/dist dist/apps/notification && \
  cp -r apps/backend/settings/dist dist/apps/settings


# Production stage
FROM node:22.15.0-slim AS production

WORKDIR /app

# Default to production; overridden by docker-compose per service
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy environment files
COPY .env* ./

# Copy api-gateway assets for Swagger (since we use readFileSync in main.ts)
COPY --from=builder /app/apps/backend/api-gateway/src/assets ./apps/api-gateway/src/assets

# Copy built applications from builder
COPY --from=builder /app/dist ./dist

# Ship @org/* runtime: real JS in dist/, plus a minimal package.json that points main at it.
# (npm ci above may have created broken symlinks under node_modules/@org — wipe them first.)
RUN rm -rf node_modules/@org && mkdir -p node_modules/@org/database node_modules/@org/shared-config
COPY --from=builder /app/packages/database/dist/ ./node_modules/@org/database/dist/
COPY --from=builder /app/packages/shared-config/dist/ ./node_modules/@org/shared-config/dist/
RUN printf '%s' '{"name":"@org/database","main":"./dist/index.js","type":"commonjs"}' > node_modules/@org/database/package.json && \
    printf '%s' '{"name":"@org/shared-config","main":"./dist/index.js","type":"commonjs"}' > node_modules/@org/shared-config/package.json

# Create non-root user
RUN groupadd -g 1001 sims && \
  useradd -m -u 1001 -g sims simsuser

# Create uploads directory and own it for the app user
RUN mkdir -p /app/uploads && chown -R simsuser:sims /app/uploads

# Own app dir so simsuser can read dist and node_modules
RUN chown -R simsuser:sims /app

USER simsuser

# Expose API gateway default port (override with PORT env)
EXPOSE 3100

# Run the application (default: api-gateway; override in docker-compose per service)
CMD ["node", "dist/apps/api-gateway/main.js"]

