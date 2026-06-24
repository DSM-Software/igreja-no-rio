## 1. Imagem Open Graph padrão

- [x] 1.1 Adicionar a arte fornecida (foto da comunidade + logo, 1200×630) em `public/og-default.jpg`, convertida para JPEG e comprimida (~150KB, < ~300KB)
- [x] 1.2 Confirmar que `openGraph.images` em `src/app/(frontend)/layout.tsx` já referencia `/og-default.jpg` (1200×630, `alt: "Igreja no Rio"`) — nenhuma edição necessária
- [x] 1.3 Verificar localmente que `GET /og-default.jpg` retorna 200 com `Content-Type` de imagem (confirmado: `status=200 type=image/jpeg size=152109`)

## 1b. Propagar a imagem OG às páginas internas (descoberto na implementação)

> Descoberta: cada página interna definia `openGraph: { title: "… — Igreja no Rio" }`, o que no Next.js substitui o `openGraph` do layout por inteiro e descarta o `images` herdado — só a home (sem override) exibia a imagem. O `og:title` já é derivado automaticamente do `title` + template, então o override era redundante.

- [x] 1b.1 Remover o `openGraph` redundante de `blog`, `agenda`, `contato`, `downloads`, `quem-somos` e `privacidade` para que herdem `openGraph.images` do layout
- [x] 1b.2 Confirmar via `curl` que todas as rotas (`/`, `/blog`, `/agenda`, `/contato`, `/downloads`, `/quem-somos`, `/privacidade`) emitem `og:image = /og-default.jpg` e mantêm o `og:title` correto

## 2. Título da home

- [x] 2.1 Trocar `title: "Início"` por `title: "Faça parte dessa família"` em `src/app/(frontend)/page.tsx`
- [x] 2.2 Confirmar que o `Header.tsx` mantém o rótulo de navegação "Início" (sem alteração)

## 3. Botões do banner em linha única

- [x] 3.1 Adicionar `whitespace-nowrap` à constante `buttonBase` em `src/components/consent/ConsentBanner.tsx`
- [x] 3.2 Inspecionar visualmente com Playwright (viewport desktop 1280px) que "Aceitar todos" e "Rejeitar todos" não quebram em duas linhas (screenshot confirmou linha única)

## 4. Testes E2E

- [x] 4.1 Adicionar/ajustar teste em `tests/e2e/seo-meta.spec.ts` (ou `public-routes.spec.ts`): `og:image` presente e a URL resolvida retorna 200; `document.title` da home contém "Faça parte dessa família" e "Igreja no Rio"
- [x] 4.2 Adicionar teste em `tests/e2e/cookie-consent.spec.ts`: em viewport desktop, "Aceitar todos" e "Rejeitar todos" têm `getClientRects().length === 1` (texto em linha única)

## 5. Verificação final

- [x] 5.1 `npm run lint` (sem novos problemas; permanece 1 erro pré-existente em `SearchOverlay.tsx:34`, alheio a esta mudança)
- [x] 5.2 `npm run test:e2e`: `seo-meta` 29/29 verde; `cookie-consent` novos testes (linha única + igual proeminência) verdes. Nota: `cookie-consent › decisão persiste após reload` falha de forma flaky na suíte completa **também no HEAD limpo** (helper `clearConsent` re-limpa o consentimento no reload) — flake pré-existente, não introduzido aqui
- [x] 5.3 Documentar no PR o passo pós-deploy: re-scrape do link nos debuggers (Facebook/WhatsApp/X) para invalidar o cache da prévia antiga
