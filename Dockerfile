FROM node:20

WORKDIR /home/node/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@latest

RUN pnpm install --verbose 

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
