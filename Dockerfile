FROM node:10.15.0

WORKDIR /usr/src
RUN curl -sSL https://get.docker.com/ | sh

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000
ENV NODE_ENV production
