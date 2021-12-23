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
RUN npm install pm2 -g
RUN npm run build
ENV NODE_ENV=production
RUN npm prune --production
EXPOSE 3000
USER node
CMD [ "pm2-runtime", "start", "npm", "--", "start" ]
