FROM node:22

# Create app directory
WORKDIR /api

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn install

# Bundle app source
COPY . .

EXPOSE 8082
CMD [ "yarn", "dev" ]