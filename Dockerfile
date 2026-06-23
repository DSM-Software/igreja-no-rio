# ─────────────────────────────────────────────────────────────────────────────
# Dockerfile — Igreja no Rio (produção)
# Build multi-stage com Next.js + Payload (runner com migrations no startup)
#
# Build:
#   docker build \
#     --build-arg NEXT_PUBLIC_SERVER_URL=https://igrejanorio.com \
#     -t igreja-no-rio .
#
# Run (todas as vars em tempo de execução, exceto NEXT_PUBLIC_*):
#   docker run -p 3000:3000 --env-file .env.production igreja-no-rio
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ─── Stage 1: instalar dependências ──────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# ─── Stage 2: build ───────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* são embutidas no bundle no momento do build
ARG NEXT_PUBLIC_SERVER_URL=https://igrejanorio.com
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Regenera o importMap do admin Payload ANTES do next build para garantir
# que o arquivo correto vá pra imagem mesmo se o withPayload+Turbopack
# falhar silenciosamente. Sem isso, o admin pode renderizar sem o editor
# Lexical (RscEntryLexicalField "not found in importMap" em runtime).
RUN DATABASE_URI=postgresql://placeholder:placeholder@localhost:5432/placeholder \
    PAYLOAD_SECRET=build-placeholder-secret \
    S3_BUCKET=placeholder \
    S3_REGION=us-east-1 \
    S3_ACCESS_KEY_ID=placeholder \
    S3_SECRET_ACCESS_KEY=placeholder \
    sh -c "npx payload generate:importmap && npm run build"

# ─── Stage 3: runner ──────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# servidor em 0.0.0.0 para container
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 nextjs

# Copia app buildado, dependências e código-fonte necessário para migrations do Payload
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./next.config.ts

USER nextjs
EXPOSE 3000

# Aplica migrations pendentes antes de subir o app
CMD ["sh", "-c", "npm run migrate && npm run start"]
