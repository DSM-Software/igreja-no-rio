## Context

Três ajustes visuais pequenos e independentes:

1. **OG image quebrada** — `src/app/(frontend)/layout.tsx` declara `openGraph.images = [{ url: "/og-default.jpg", width: 1200, height: 630 }]`, mas `public/og-default.jpg` não existe. Compartilhamentos saem sem prévia. O usuário forneceu a arte final (foto da comunidade + logo, 1200×630).
2. **Título da home** — `src/app/(frontend)/page.tsx` define `title: "Início"`. Com o template `"%s — Igreja no Rio"` do layout, o share/aba mostra "Início — Igreja no Rio". A home não define `openGraph.title`, então o Next resolve o `og:title` a partir do `title` da página. Trocar o `title` propaga para o `og:title` automaticamente.
3. **Botões do banner quebram linha** — `ConsentBanner.tsx` usa `buttonBase` sem `whitespace-nowrap`; em desktop "Aceitar todos"/"Rejeitar todos" podem quebrar em duas linhas.

## Goals / Non-Goals

**Goals:**
- Share de qualquer rota exibe a imagem oficial 1200×630.
- Share/aba da home exibe "Faça parte dessa família — Igreja no Rio".
- Texto dos botões de ação do banner em linha única no desktop.

**Non-Goals:**
- Não alterar o rótulo "Início" do menu de navegação (`Header.tsx`).
- Não criar OG images por página (blog/[slug] já tem a sua via `generateMetadata`).
- Não redesenhar o banner nem mudar o layout mobile (empilhado) das ações.

## Decisions

- **Formato/nome do arquivo OG**: a arte fornecida é um PNG fotográfico de 1200×630 com ~1.29MB. **Decisão (revisada na implementação): converter para JPEG e salvar como `public/og-default.jpg`**, exatamente o caminho que o metadata raiz já referencia — assim **nenhuma edição em `layout.tsx` é necessária** e o arquivo cai para ~150KB (qualidade 82, degradação imperceptível em foto). Alternativa descartada: manter PNG em `/og-default.png` + editar `layout.tsx` — adicionaria uma mudança de código e serviria um asset ~8× mais pesado sem ganho visual de prévia.
- **Título da home**: alterar apenas `title` em `page.tsx` para `"Faça parte dessa família"`. Não adicionar `openGraph.title` explícito — deixar o Next derivar do `title` mantém uma única fonte de verdade. A meta description da home permanece inalterada.
- **No-wrap dos botões**: adicionar `whitespace-nowrap` à constante `buttonBase` em `ConsentBanner.tsx`, aplicando a todos os botões (inclusive "Personalizar") sem efeito colateral no mobile, onde os botões já ocupam largura total empilhada. Alternativa descartada: `min-w`/larguras fixas — mais frágil a mudanças de copy.

- **Propagação do `og:image` às páginas internas (descoberto na implementação)**: o metadata do Next.js faz *shallow merge* — uma página que exporta `openGraph: { title }` substitui o `openGraph` do layout por inteiro, descartando o `images` herdado. Por isso, apenas a home (sem override) exibia a imagem; `/blog`, `/agenda`, `/contato`, `/downloads`, `/quem-somos`, `/privacidade` ficavam sem `og:image`. **Decisão: remover o bloco `openGraph` redundante dessas páginas** — o `og:title` já é derivado automaticamente do `title` + template (mesmo resultado de antes, ex.: "Blog — Igreja no Rio"), e sem o override elas voltam a herdar o `openGraph.images` do layout. Alternativas descartadas: (a) repetir `images` em cada `openGraph` — duplicação que se perde em páginas futuras; (b) convenção de arquivo `opengraph-image.jpg` no grupo `(frontend)` — testada empiricamente e **não** propaga quando a página define seu próprio `openGraph`, além de não cobrir o caso. `blog/[slug]` mantém seu `openGraph` próprio (capa dinâmica do post), que tem prioridade legítima.

## Risks / Trade-offs

- **Cache de crawler (Facebook/WhatsApp/X)** mantém a prévia antiga → após deploy, revalidar a URL no Sharing Debugger / forçar re-scrape; documentar no runbook do PR.
- **Peso da imagem** PNG 1200×630 pode ser maior que JPEG → garantir compressão razoável (< ~300KB) antes de commitar; é asset estático servido por CDN, impacto baixo.
- **`whitespace-nowrap` em viewport muito estreita** poderia estourar o container → mitigado porque no mobile o container é `flex-col` (botões full-width empilhados), e o no-wrap só importa na linha do desktop.

## Migration Plan

1. Adicionar `public/og-default.png` e atualizar `layout.tsx`.
2. Trocar o `title` da home.
3. Adicionar `whitespace-nowrap` ao `buttonBase`.
4. `npm run lint` + suites E2E (`seo-meta`/`public-routes`, `cookie-consent`).
5. Pós-deploy: re-scrape do link nos debuggers das redes para invalidar cache de prévia.

Rollback: reverter os 3 arquivos; nenhum dado/migração de banco envolvido.

## Open Questions

- Nenhuma. (Escopo do título confirmado com o usuário: apenas share/aba, menu permanece "Início".)
