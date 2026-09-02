FROM node:22-slim AS builder

LABEL maintainer="admin@lance.moe"

WORKDIR /app

RUN npm install -g pnpm@latest

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . ./

ENV NODE_ENV=production
RUN pnpm build


FROM nginx:alpine
LABEL maintainer="admin@lance.moe"

ENV NODE_ENV=production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
