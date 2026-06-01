# Handoff: Site da Igreja no Rio + CMS (Payload)

## Visão geral
Site institucional/comunitário da **Igreja no Rio** (Santíssimo, Rio de Janeiro). É um site público com:

- **Home** (3 variações de layout possíveis)
- **Quem Somos**, **Cultos**
- **Blog** (devocionais e estudos em série) + página de post individual
- **Downloads** (pregações em áudio, PDFs, slides)
- **Contato** (com agenda de **eventos**)
- **Painel administrativo** (CMS) para publicar blog, downloads e eventos

O protótipo já modela todo o conteúdo e um "Painel da Igreja" em React. **Na implementação real, o painel deve ser substituído pelo Payload CMS** — veja `PAYLOAD_SETUP.md`.

---

## Sobre os arquivos deste pacote
Os arquivos em `design_reference/` são **referências de design feitas em HTML/React (via Babel no navegador)** — protótipos que mostram a aparência e o comportamento pretendidos. **Não são código de produção para copiar diretamente.**

A tarefa é **recriar esses designs no codebase alvo**. Recomendação: **Next.js (App Router) + Payload CMS 3.x no mesmo projeto**, com um único deploy. O protótipo usa React, então a transposição do JSX para componentes Next/React é direta — mas o roteamento client-side por hash deve virar rotas reais do Next, e a camada de dados (hoje `localStorage`) deve virar consultas à API local do Payload.

## Fidelidade
**Alta fidelidade (hi-fi).** Cores, tipografia, espaçamentos, raios e estados já são finais. Recrie a UI fielmente usando os tokens listados abaixo. Onde o protótipo usa "arte de capa por cor" (turquesa/marinho/areia) como placeholder, na produção isso vira um **upload de imagem de capa** com fallback para a cor (ver Coleção `posts`).

---

## Arquitetura recomendada
| Camada | Escolha | Observação |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | SSR/SSG para SEO — importante para um site de igreja ser encontrado |
| CMS | **Payload 3.x** | Roda dentro do mesmo app Next (`/admin`). Um único deploy. |
| Banco | **Postgres** (Neon / Supabase / Railway) | `@payloadcms/db-postgres` |
| Armazenamento de arquivos | **Vercel Blob** ou **S3/Cloudflare R2** | Para áudios, PDFs, slides e imagens de capa |
| Hospedagem | **Vercel** (app) + Neon (banco) + Blob (arquivos), ou **Railway/Render** tudo junto | Tudo hospedado, sem servidor pra "cuidar" no dia a dia |

> Áudios de pregação podem ser grandes. Se os arquivos forem pesados, considere hospedar o áudio externamente (ex.: um canal de podcast / YouTube) e guardar só o **link** no campo do download. O guia em `PAYLOAD_SETUP.md` suporta os dois modos (upload **ou** URL externa).

---

## Telas / Views

### 1. Header (global)
- **Layout:** barra fixa no topo, altura `--nav-h` (76px desktop / 64px mobile). Logo à esquerda, navegação ao centro/direita, botão de destaque à direita.
- **Logo:** usar `assets/logo-IR-dark.svg` sobre fundos claros e `assets/logo-IR-white.svg` sobre o hero escuro/navy (variação 1 e 3 da home têm hero claro → o componente `Header` recebe `lightHero`).
- **Itens de nav:** Início, Quem Somos, Cultos, Blog, Downloads, Contato.
- **Comportamento:** vira "sólido" ao rolar; em hero escuro começa transparente com texto claro.

### 2. Home — 3 variações (tweakable)
O protótipo permite alternar entre 3 layouts de home (Tweak "Variação da Home"). **Defina com a igreja qual será a versão de produção** (ou implemente as 3 e escolha uma via config):
- **Variação 1 — "Acolhedora":** hero escuro (navy) com foto + boas-vindas calorosas.
- **Variação 2 — "Editorial":** blocos de cor com tipografia gigante (estilo das artes da igreja).
- **Variação 3 — "Comunidade":** clara/leve, com colagem de fotos da comunidade.
- Todas puxam: próximos **eventos** (destaque), últimos **posts** do blog, e materiais recentes de **downloads**.

### 3. Quem Somos / Cultos
Páginas majoritariamente estáticas (texto + imagens). Conteúdo pode ficar fixo no código ou virar uma coleção `pages` no Payload se a igreja quiser editá-las (opcional — ver `PAYLOAD_SETUP.md`).

### 4. Blog (lista) — `/blog`
- **Layout:** grade de cards. Cada card tem capa (imagem ou cor), categoria (tag), título, resumo, autor e data.
- **Filtros:** por categoria (Devocional / Estudo) e por série.
- **Séries:** posts podem pertencer a uma série (ex.: "Somos a Igreja") com número de parte.

### 5. Post individual — `/blog/[slug]`
- **Layout:** capa no topo, título grande, metadados (autor, data, tempo de leitura calculado ~200 palavras/min), corpo.
- **Corpo:** escrito num **markdown leve** no protótipo: `##` subtítulo, `>` citação, `**negrito**`, `1.`/`2.` listas. **Na produção, usar o editor rich text do Payload (Lexical)** — o corpo vira rich text estruturado, não markdown cru.
- Se faz parte de série, mostra navegação entre partes.

### 6. Downloads — `/downloads`
- **Layout:** lista/grade de materiais agrupados por categoria. Cada item: ícone por tipo (áudio / pdf / slides), título, categoria, pregador (opcional), data, tamanho/duração, descrição e botão de download.
- **Tipos (`kind`):** `audio`, `pdf`, `slides` — cada um tem ícone e cor próprios.

### 7. Contato — `/contato`
- Dados de contato + endereço (Rua Ivan Pessoa, 341 — Santíssimo) + **agenda de eventos** (próximos cultos, grupos caseiros, etc.).

### 8. Painel admin → **substituído pelo Payload** (`/admin`)
No protótipo é uma tela própria com login (senha `familia`), abas (Blog / Downloads / Eventos), CRUD via "drawer" lateral e export/import JSON. **Tudo isso é nativo do Payload** — não recriar à mão. O export/import JSON do protótipo serve como **referência para um seed** inicial do banco (o conteúdo de exemplo está em `design_reference/app/store.jsx`, objeto `SEED`).

---

## Design Tokens

### Cores
```
/* Marca — turquesa / marinho / branco */
--teal-50:  #ECF8F6;   --teal-100: #D6F1ED;  --teal-200: #A9E3DC;
--teal-300: #7DD4CA;   --teal-400: #5CC8BD;  --teal-500: #45C0B4;  /* primária */
--teal-600: #2EA89C;   --teal-700: #237F76;

--navy-900: #161D29;   --navy-800: #1D2532;  /* hero escuro */
--navy-700: #283143;   --navy-600: #38445B;

--ink:    #1F2630;  --ink-2: #424B57;  --muted: #6B7480;  --muted-2: #9AA2AD;
--paper:  #FFFFFF;  --bg: #F5F8F8;  --bg-2: #EEF4F3;
--border: #E4EAE9;  --border-2: #D5DEDC;
--accent: var(--teal-500);  --accent-ink: #0E3B36;
```
**Tons de marca alternativos** (Tweak no protótipo — escolher 1 para produção):
- Turquesa (padrão): 400 `#5CC8BD` / 500 `#45C0B4` / 600 `#2EA89C` / 700 `#237F76`
- Profundo: `#3FB6AC` / `#2BA295` / `#1E867B` / `#16645C`
- Verde-água: `#6BD0C0` / `#4FC8B0` / `#33A88E` / `#247A68`

### Tipografia
- **Display/títulos:** `Poppins` (400, 500, 600, 700, 800) — Google Fonts
- **Corpo:** `Mulish` (400, 500, 600, 700) — Google Fonts
- Títulos: `line-height: 1.04`, `letter-spacing: -0.02em`, `text-wrap: balance`
- Corpo de texto/inputs: ~15px base; corpo de post `line-height: 1.6`

### Raios (variável "Cantos" — escolher 1)
```
soft (padrão): --r-md 12 / --r-lg 18 / --r-xl 26 / --r-2xl 34 / --r-pill 999
sharp:         --r-md 6  / --r-lg 8  / --r-xl 10 / --r-2xl 14 / --r-pill 8
round:         --r-md 16 / --r-lg 22 / --r-xl 30 / --r-2xl 40 / --r-pill 999
```

### Sombras
```
--shadow-sm:  0 1px 2px rgba(22,29,41,.06), 0 1px 3px rgba(22,29,41,.05);
--shadow-md:  0 6px 18px rgba(22,29,41,.08), 0 2px 6px rgba(22,29,41,.05);
--shadow-lg:  0 18px 50px rgba(22,29,41,.14), 0 6px 16px rgba(22,29,41,.08);
--shadow-teal:0 14px 34px rgba(45,168,156,.32);
```

### Layout
- Largura máx. do conteúdo: `--maxw: 1180px`
- Breakpoints do protótipo: `980px` e `680px` (ver regras em `design_reference/app/app.jsx`)

### Ícones
- **Iconify** com o conjunto `material-symbols:*` (ex.: `material-symbols:download-rounded`, `material-symbols:event-outline-rounded`). Use o pacote `@iconify/react` no Next.

---

## Modelo de conteúdo (resumo — detalhes em PAYLOAD_SETUP.md)
Três tipos principais + mídia + usuários:

- **posts** (Blog): title, slug, category (Devocional|Estudo), serie, serieParte, author, date, cover, excerpt, tags[], body (rich text), published
- **downloads**: title, kind (audio|pdf|slides), category, date, size, speaker, desc, file (upload ou URL)
- **events**: title, date, time, location, recurring, desc, highlight
- **media**: imagens de capa e arquivos
- **users**: com **papéis** (admin / editor / autor) — você quer várias pessoas publicando

---

## Assets
- `assets/logo-IR-dark.svg` — logomarca em `#232323` (para fundos claros)
- `assets/logo-IR-white.svg` — logomarca branca (para fundos escuros/navy)
- Ambas são vetores válidos, viewBox `0 0 896 300`. A marca combina um **símbolo circular** (à esquerda) + wordmark "IGREJA NO RIO".
- **Fotos:** o protótipo usa placeholders coloridos / `image-slot`. A igreja precisa fornecer fotos reais da comunidade, cultos e espaço para a home e o Quem Somos.

---

## Arquivos de referência (em `design_reference/`)
- `Igreja no Rio.html` — documento raiz (fontes, tokens CSS, mount)
- `app/store.jsx` — **camada de dados + conteúdo de exemplo (`SEED`)**. A melhor fonte para entender o modelo e gerar o seed do Payload.
- `app/app.jsx` — roteamento, responsividade, tweaks (tons/raios/variação da home)
- `app/home.jsx` — as 3 variações da home
- `app/pages.jsx` — Quem Somos, Cultos, Contato
- `app/blog.jsx` — lista do blog + post individual + renderização do markdown leve
- `app/downloads.jsx` — lista de materiais e meta por tipo
- `app/admin.jsx` — painel CRUD (referência do que o Payload vai substituir; bom para entender os campos de cada formulário)
- `app/ui.jsx` — componentes base (Header, Footer, Btn, Tag, CoverArt, LogoMark, Container)
- `app/tweaks-panel.jsx` / `app/image-slot.js` — utilitários do protótipo (não precisam ir pra produção)

---

## Checklist de deploy e rollback

Antes de publicar em produção:

- Confirmar `PAYLOAD_SERVER_URL`, `PAYLOAD_TRUSTED_ORIGINS`, `PAYLOAD_CSRF_ORIGINS` e `NEXT_PUBLIC_SERVER_URL` com os domínios reais de produção.
- Rodar `npm run lint`, `npm audit --omit=dev` e as suítes Playwright críticas (`admin-access`, `downloads`, `public-routes`).
- Garantir que o banco de produção receberá as migrations novas antes do tráfego normal (`npm run migrate`).
- Validar que o proxy/Nginx publicado inclui o baseline de headers de segurança, incluindo `Content-Security-Policy`.
- Confirmar que `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` e `SEED_ADMIN_NAME` estão definidos com valores reais apenas se o seed inicial for executado.

Sequência sugerida de deploy:

- Atualizar dependências e imagem da aplicação.
- Publicar variáveis de ambiente de origem confiável.
- Aplicar migrations.
- Subir a aplicação e validar `/`, `/downloads`, `/contato`, `/privacidade` e `/admin/login`.

Rollback sugerido:

- Reverter a imagem/commit da aplicação para a versão anterior.
- Restaurar as variáveis de ambiente anteriores de `PAYLOAD_SERVER_URL`, `PAYLOAD_TRUSTED_ORIGINS`, `PAYLOAD_CSRF_ORIGINS` e `NEXT_PUBLIC_SERVER_URL`.
- Se a regressão vier de headers/proxy, restaurar a configuração anterior do Nginx e reiniciar apenas o proxy.
- Se a regressão vier da migration de ownership, restaurar o backup do banco ou aplicar o rollback da migration antes de religar a versão anterior da app.
