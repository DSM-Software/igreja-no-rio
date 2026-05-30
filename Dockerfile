# ─────────────────────────────────────────────────────────────────────────────
# Dockerfile — Igreja no Rio (produção)
# Build multi-stage com Next.js standalone (~150 MB imagem final)
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

ENV DATABASE_URI=postgresql://placeholder:placeholder@localhost:5432/placeholder
ENV PAYLOAD_SECRET=build-placeholder-secret-mude-em-producao
ENV S3_BUCKET=placeholder
ENV S3_REGION=us-east-1
ENV S3_ACCESS_KEY_ID=placeholder
ENV S3_SECRET_ACCESS_KEY=placeholder

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ─── Stage 3: runner mínimo ───────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# standalone precisa que o servidor escute em 0.0.0.0
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copia somente o que o standalone precisa
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# sharp é importado opcionalmente pelo Payload e não é rastreado pelo bundler do Next.js —
# precisa ser copiado explicitamente para que o redimensionamento de imagens funcione.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@img ./node_modules/@img

# Script que roda migrations antes de subir o servidor.
COPY --from=builder --chown=nextjs:nodejs /app/scripts/migrate-prod.mjs ./migrate-prod.mjs

USER nextjs
EXPOSE 3000

CMD ["sh", "-c", "node migrate-prod.mjs && node server.js"]
