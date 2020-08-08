FROM node:lts-alpine3.11

WORKDIR /usr/src/app

COPY . .

RUN cd frontend && npm install && npm run build

WORKDIR /usr/src/app/backend

RUN npm install

CMD npm start
