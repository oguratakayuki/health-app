FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

# prisma
COPY .env ./
COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

# Prismaクライアントを生成
RUN rm -rf node_modules/.prisma

# Prismaクライアントを生成（マルチプラットフォーム対応）
RUN yarn prisma generate && \
    echo "=== Generated Prisma Client ===" && \
    ls -la src/generated/ && \
    echo "=== Binary Targets ===" && \
    find src/generated -name "*.so.node" -o -name "*.node" | head -5

COPY .env ./

COPY . .

## RUN yarn build

EXPOSE 3000

CMD ["yarn", "dev"]
