FROM node:lts-alpine3.11

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build

RUN node server.js
