# Dockerfile (at repo root)
FROM node:20-alpine

# Work inside /app
WORKDIR /app

# Install server deps
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# Copy server source
COPY server ./server

# Run the Express API
WORKDIR /app/server
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
CMD ["npm", "start"]
