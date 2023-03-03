FROM node:18-buster-slim as builder

LABEL maintainer="admin@lance.moe"

WORKDIR /app
COPY . ./

RUN npm install -g pnpm
RUN pnpm install
ENV NODE_ENV=production
RUN pnpm build


FROM nginx
LABEL maintainer="admin@lance.moe"

ENV NODE_ENV=production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
