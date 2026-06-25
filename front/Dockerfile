# Build stage
FROM node:20-slim AS build-stage

WORKDIR /app

# Install pbkit for protobuf generation
RUN npm install -g --unsafe-perm @pbkit/pb-cli

# Copy configuration and install dependencies
COPY front/package.json front/yarn.lock ./
RUN yarn install

# Copy proto directory to /proto (so that ../proto resolution from /app works)
COPY proto /proto

# Copy the rest of the frontend source
COPY front/ .

RUN pb vendor install
RUN yarn generate
RUN yarn build

# Production stage
FROM nginx:alpine

COPY --from=build-stage /app/dist /web
ADD front/nginx/default.conf /etc/nginx/conf.d/default.conf