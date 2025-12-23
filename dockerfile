FROM node:20-bullseye

WORKDIR /app

# pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# copy workspace files
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

# install deps
RUN pnpm install --frozen-lockfile

# prisma (inside Docker)
RUN pnpm exec prisma generate

# build only the backend
RUN pnpm turbo run build --filter=apps/http

# runtime
CMD ["node", "apps/http/dist/index.js"]
