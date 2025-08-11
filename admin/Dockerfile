# admin/Dockerfile
FROM node:20

WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH

# 依存だけ先にインストールしてキャッシュを効かせる
COPY package*.json ./
RUN npm install

# 残りをコピー（ただし docker-compose で bind mount するならコピーは上書きされます）
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]

