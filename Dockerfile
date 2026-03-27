# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app (React/Vite)
RUN npm run build

# Final Stage: Nginx runtime
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

# Copy the built assets to Nginx
COPY --from=build /app/dist .

# Add a basic Nginx configuration for single page apps (SPA)
RUN printf 'server {\n\tlisten 80;\n\tlocation / {\n\t\troot /usr/share/nginx/html;\n\t\tindex index.html;\n\t\ttry_files $uri $uri/ /index.html;\n\t}\n}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
