FROM node:14-alpine AS builder

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN apk update && \
    apk add --no-cache \
        python3 \
        make \
        g++ \
        curl

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sf https://gobinaries.com/tj/node-prune | PREFIX=/usr/local/bin sh

USER node

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

RUN npm prune --production

RUN /usr/local/bin/node-prune

FROM node:14-alpine

WORKDIR /home/node/app

COPY --from=builder /home/node/app/package.json ./

COPY --from=builder /home/node/app/dist ./dist

COPY --from=builder /home/node/app/node_modules ./node_modules

EXPOSE 3000

CMD [ "npm", "run", "start" ]
