FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["sh", "-c", "node dist/main && node dist/seed"]