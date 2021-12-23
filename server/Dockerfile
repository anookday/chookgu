# build stage
FROM node:16.13.1-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build

# run stage
FROM node:16.13.1-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN npm install pm2 -g
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist
EXPOSE 5000
USER node
CMD ["pm2-runtime", "dist/main.js"]
