ARG NODE_IMAGE_VERSION=18.17.0-alpine
ARG NO_GIT=true

FROM node:${NODE_IMAGE_VERSION} AS base
ARG PNPM_VERSION=8.6.12
RUN npm install -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
# Mover tests a CD/CI en entorno real
#RUN pnpm test:onlyLocal
########
RUN pnpm build
#RUN pnpm prune --prod

FROM base AS deploy
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

CMD [ "node", "dist/main.js" ]