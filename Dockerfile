FROM node:10.15.0

WORKDIR /usr/src
RUN curl -sSL https://get.docker.com/ | sh

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app

EXPOSE 3000
ENV NODE_ENV prod
