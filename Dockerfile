# Use an official Bun image as the base
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Install dependencies using Bun
COPY bun.lock ./
COPY package.json ./
RUN bun install

# Copy the rest of the application
COPY . .

# Expose port 3000 for SvelteKit
EXPOSE 3000

# Run the development server with Bun (this will enable hot reloading)
CMD ["bun", "dev"]
