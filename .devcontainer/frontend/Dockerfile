FROM node:16-slim

# Set working directory
WORKDIR /workspace

# Copy frontend package files
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY . ./

# Build frontend
RUN npm run build

# Install serve to run the built frontend
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Run frontend
CMD ["serve", "-s", "build", "-l", "3000"]