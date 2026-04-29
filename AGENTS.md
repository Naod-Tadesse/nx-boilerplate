### Running Applications

```bash
# Frontend (Vite dev server on port 4200)
nx serve frontend

# Backend (HTTP server on port 3000)
nx serve backend


# Run all backend services at once
nx run-many -t serve -p api-gateway authentication notification

# Run everything
 nx run-many --target=serve --all
```

