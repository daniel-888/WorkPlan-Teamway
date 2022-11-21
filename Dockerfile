FROM node:16.13.0-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn install

COPY --chown=node:node . .

EXPOSE 3000

USER node

CMD [ "node", "index.js" ]
