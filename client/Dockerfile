# dependency stage
FROM node:16.13.1-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install 

# build stage
FROM node:16.13.1-alpine AS build
WORKDIR /app
COPY ./ ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build && npm install --only=production 

# run stage
FROM node:16.13.1-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.env ./
COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build --chown=node /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
USER node
CMD ["node_modules/.bin/next", "start"]
