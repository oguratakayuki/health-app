FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

# prisma
COPY .env ./
COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

# Prismaクライアントを生成
RUN rm -rf node_modules/.prisma

# Prismaクライアントを生成
RUN yarn prisma generate

COPY .env ./

COPY . .

## RUN yarn build

EXPOSE 3000

CMD ["yarn", "dev"]
