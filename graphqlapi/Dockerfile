FROM node:20

WORKDIR /app

# COPY package.json yarn.lock ./
COPY package.json ./
RUN yarn install

COPY . .

EXPOSE 4000
