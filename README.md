# Memento Frontend

This is the frontend for the Memento application, which is a web-based tool for managing and organizing personal memories.

## Development

To get started with the development of the Memento frontend, follow these steps:

```bash
npm install
npm run dev
```

### Development Inside Docker

To develop the Memento frontend inside a Docker container, follow these steps:

```bash
docker run --rm -it \
  -v ${PWD}:/app \
  -p 5173:5173 \
  -w /app \
  -e NODE_ENV=development \
  -e VITE_HOST=0.0.0.0 \
  node:20-alpine \
  sh -c "npm install && npm run dev"
```

## Deployment

To deploy the Memento frontend, follow these steps:

```bash
npm run build
npm run start
```

### Shadcn UI Components

To add new base components, visit https://ui.shadcn.com/.

Use the following command to add a new component:

```
npx shadcn@latest add <component-name>
```
