FROM node:20-slim

WORKDIR /app

# Install production dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy the rest of the app (frontend + server)
COPY . .

ENV NODE_ENV=production
# Cloud Run injects PORT; default to 8080 locally.
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server/index.js"]
