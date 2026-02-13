FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
COPY server/package.json server/package.json
COPY shared/package.json shared/package.json
RUN npm install --workspaces --include-workspace-root
COPY shared shared
COPY server server
RUN npm run build -w shared && npm run build -w server
WORKDIR /app/server
EXPOSE 3000
CMD ["node", "dist/index.js"]
