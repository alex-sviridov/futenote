# Multi-stage build for Vue.js application
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage - use non-root nginx
FROM nginxinc/nginx-unprivileged:alpine

# Copy custom nginx config for unprivileged nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port (note: unprivileged nginx uses port 8080 by default)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start nginx (runs as nginx user automatically)
CMD ["nginx", "-g", "daemon off;"]