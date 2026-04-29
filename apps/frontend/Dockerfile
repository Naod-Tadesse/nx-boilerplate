# Build stage
FROM node:20-alpine AS builder
WORKDIR /workspace

ARG VITE_BASE_URL
ENV VITE_BASE_URL=${VITE_BASE_URL}

# Layer 1: workspace manifests only (rarely changes — keeps npm ci cached across source edits)
COPY package.json package-lock.json ./
COPY packages/shared-config/package.json packages/shared-config/
COPY packages/database/package.json packages/database/
COPY packages/ui/package.json packages/ui/
COPY apps/backend/api-gateway/package.json apps/backend/api-gateway/
COPY apps/backend/authentication/package.json apps/backend/authentication/
COPY apps/backend/notification/package.json apps/backend/notification/
COPY apps/backend/application/package.json apps/backend/application/
COPY apps/backend/settings/package.json apps/backend/settings/
COPY apps/ekos-frontend/package.json apps/ekos-frontend/

RUN npm ci

# Layer 2: source (changes here do not bust npm ci)
COPY nx.json tsconfig.base.json ./
COPY packages packages
COPY apps/ekos-frontend apps/ekos-frontend

# Build (Nx auto-builds shared-config and ui first via dependsOn: ^build)
RUN npx nx build ekos-frontend --skip-nx-cache

# Serve with nginx
FROM nginx:alpine
COPY --from=builder /workspace/apps/ekos-frontend/dist /usr/share/nginx/html
COPY apps/ekos-frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
