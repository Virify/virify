FROM node:22-alpine

RUN npm i -g pnpm@latest
RUN pnpm config set store-dir /home/node/app/.pnpm-store