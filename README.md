## Running Applications

### Individual services

```bash
# Frontend (Vite dev server on port 4200)
nx serve rontend

# backend (HTTP server on port 3000)
nx serve backend
```

### All services at once
```bash
nx run-many --target=serve --all
```

```bash
nx run-many -t serve -p api-gateway authentication notification
```

### Everything (frontend + all backends)

```bash
nx run-many -t serve
```

## Building

```bash
# Build a specific project
nx build <project-name>

# Build all projects
nx run-many -t build

# Build only affected projects (based on git changes)
nx affected -t build
```

## Testing & Linting

```bash
# Test a specific project
nx test <project-name>

# Lint a specific project
nx lint <project-name>

# Test and lint all projects
nx run-many -t test lint

# Only affected projects
nx affected -t test lint
```

## Generating New Projects

### New React frontend app

```bash
nx g @nx/react:app apps/<name> --bundler=vite
```

Then add the shared UI source directive to `src/index.css`:

```css
@source "../../../packages/ui/src/**/*.{ts,tsx}";
```

### New NestJS microservice

```bash
nx g @nx/nest:app apps/backend/<name>
```

Then configure it as a RabbitMQ microservice in `main.ts` and register its queue in `packages/shared-config`.

### New shared library

```bash
# React library
nx g @nx/react:lib packages/<name> --bundler=vite

# Plain TypeScript library
nx g @nx/js:lib packages/<name>
```

### New shadcn/ui component

```bash
cd packages/ui
npx shadcn@latest add <component-name>
```

Then export it from `packages/ui/src/index.ts`.

## Project Graph

Visualize the dependency graph of the workspace:

```bash
nx graph
```
