FROM node:22

# NOTE:  this repo is pnpm-only -- `preinstall` runs only-allow pnpm...
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# Create app directory
WORKDIR /app

# Install app dependencies -- this layer caches until the manifests change.
# NOTE:  installing inside the image also pulls the linux build of the vercel
#        cli, which a copied-in host node_modules would not...
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

EXPOSE 8082

# NOTE:  `vc dev --local` skips the project link, so the container needs no
#        API_TOKEN & no .vercel dir -- it must bind 0.0.0.0 to be reachable...
CMD [ "pnpm", "dev:docker" ]
