# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Production stage
FROM caddy:2-alpine

# Copy built assets from build stage
COPY --from=build /app/dist /srv

# Copy Caddyfile (we'll create this next)
COPY Caddyfile /etc/caddy/Caddyfile

# Expose port 80
EXPOSE 80

# Caddy will automatically use the Caddyfile