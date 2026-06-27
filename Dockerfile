FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy workspace manifests
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./

# Copy lib packages
COPY lib/ ./lib/

# Copy artifacts
COPY artifacts/api-server/ ./artifacts/api-server/
COPY artifacts/portfolio/ ./artifacts/portfolio/

# Install all dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Build frontend
RUN BASE_PATH=/ PORT=3000 pnpm --filter @workspace/portfolio run build

# Build backend
RUN pnpm --filter @workspace/api-server run build

# --- Production image ---
FROM node:24-slim AS runner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./

# Copy lib packages (needed for workspace resolution)
COPY lib/ ./lib/

# Copy api-server source + built output
COPY artifacts/api-server/ ./artifacts/api-server/

# Install production-only deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod

# Copy built frontend dist from build stage
COPY --from=base /app/artifacts/portfolio/dist/public ./artifacts/portfolio/dist/public
COPY --from=base /app/artifacts/api-server/dist ./artifacts/api-server/dist
# Expose port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Serve static frontend files and API from the same server
WORKDIR /app
CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
