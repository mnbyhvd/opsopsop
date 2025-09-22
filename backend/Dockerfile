# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads/images uploads/videos uploads/documents

# Expose port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]