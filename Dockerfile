FROM node:slim AS base

ENV DIR=/project
WORKDIR $DIR

FROM base AS dev

ENV NODE_ENV=development

COPY package*.json $DIR

RUN npm ci

COPY tsconfig*.json $DIR
COPY .swcrc $DIR
COPY nest-cli.json $DIR
COPY src $DIR/src

EXPOSE $PORT
CMD ["npm", "run", "start:dev"]

FROM base AS build

RUN apk update && apk add --no-cache dumb-init=1.2.5-r2

COPY package*.json $DIR
RUN npm ci

COPY tsconfig*.json $DIR
COPY .swcrc $DIR
COPY nest-cli.json $DIR
COPY src $DIR/src

RUN npm run build && \
    npm prune --production

FROM base AS production

ENV NODE_ENV=production
ENV USER=node

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/node_modules $DIR/node_modules
COPY --from=build $DIR/dist $DIR/dist

USER $USER
EXPOSE $PORT
CMD ["dumb-init", "node", "dist/main.js"]
