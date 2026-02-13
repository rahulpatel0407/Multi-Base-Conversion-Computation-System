FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY frontend/package.json frontend/package.json
COPY shared/package.json shared/package.json
RUN npm install --workspaces --include-workspace-root
COPY shared shared
COPY frontend frontend
RUN npm run build -w shared && npm run build -w frontend

FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
