# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.12.2

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /app


################################################################################
# Create a stage for installing production dependecies.
FROM base as deps

COPY package*.json ./ 

RUN npm install 

FROM deps as run 

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5173 

CMD ["npm","run","dev"]
