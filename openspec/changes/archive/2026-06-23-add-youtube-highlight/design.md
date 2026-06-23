## Context

O site da Igreja no Rio (Next.js App Router + Payload) não expõe o canal do YouTube (`https://www.youtube.com/@IgrejanoRio7`) em nenhum ponto. Dois locais foram pedidos: a **homepage** (`src/app/(frontend)/page.tsx`) e a **página de Contato** (`src/app/(frontend)/contato/page.tsx`).

Estado atual relevante:
- A home é um server component com seções empilhadas: Hero → destaque de evento (faixa `bg-brand-500`) → blog → agenda/downloads → CTA final em `bg-navy-900`.
- A página de Contato ainda usa classes legadas (`page-hero`, `section`, `icon-detail-item`, `surface-card`, `btn`), parte da migração Tailwind em andamento. Já possui uma lista "Informações" (endereço, e-mail, WhatsApp, encontros) e um card "Canais de contato" com botões.
- WhatsApp já estabelece o padrão de link externo: `target="_blank"` + `rel="noopener noreferrer"` + ícone `mdi:*`.

## Goals / Non-Goals

**Goals:**
- Dar visibilidade ao canal do YouTube na home com um destaque claro, mas sem roubar a atenção do CTA final de comunhão.
- Adicionar o YouTube ao Contato de forma consistente com os canais já existentes (item na lista + botão).
- Centralizar a URL para que home e contato nunca divirjam.
- Cobrir ambos os pontos com testes E2E.

**Non-Goals:**
- Não embutir player/iframe do YouTube nem buscar vídeos via API (sem nova dependência, sem chamada externa em runtime, sem custo de performance/CSP de embed).
- Não tornar a URL editável via Payload CMS (é um link institucional estável; configurável depois se necessário).
- Não adicionar o YouTube ao Footer neste change (fora do escopo pedido; pode virar follow-up).

## Decisions

### Posição e formato do destaque na home
**Decisão:** Inserir uma seção dedicada ao YouTube **logo após a seção de agenda/downloads e antes do CTA final** (`bg-navy-900`). Formato: banner horizontal com ícone `mdi:youtube`, título curto ("Assista no YouTube"/"Acompanhe nossos cultos"), uma linha de apoio e um botão "Inscreva-se" / "Ver no YouTube".

**Por quê:** Mantém a hierarquia: conteúdo do site primeiro, depois convite para o canal externo, e o CTA de pertencimento permanece como fechamento emocional da página. Reusa o vocabulário visual da faixa de destaque de evento (`section` + `max-w-content` + botão arredondado), então não exige CSS novo.

**Alternativas consideradas:**
- *Dentro do Hero*: rejeitado — polui o primeiro impacto e a chamada principal.
- *Como card na grade de downloads*: rejeitado — mistura "material para baixar" com "canal a seguir", semânticas diferentes.
- *Substituir o CTA final*: rejeitado — o CTA de comunhão é institucional e deve permanecer.

### Estilização do bloco da home
**Decisão:** Usar utilitários Tailwind e tokens do projeto (`max-w-content`, `font-display`, `brand-*`, `navy-*`, `shadow-soft`). Para a "cor do YouTube" no ícone/botão, usar classes utilitárias com a cor de marca do projeto ou um vermelho aplicado inline apenas se não houver token — preferindo os tokens de marca para manter coerência visual com o site (o ícone `mdi:youtube` já comunica a plataforma).

**Por quê:** CLAUDE.md proíbe novos blocos em `globals.css` e pede tokens em vez de valores hardcoded.

### Contato: item + botão
**Decisão:** Adicionar um `icon-detail-item` "YouTube" na lista "Informações" (espelhando o item do WhatsApp) e um botão `btn btn-outline btn-md` com ícone `mdi:youtube` na fileira de "Canais de contato".

**Por quê:** Reusa exatamente os padrões já presentes na página, minimizando risco visual e mantendo consistência até a migração Tailwind chegar nesta página.

### URL centralizada
**Decisão:** Criar `src/lib/links.ts` exportando `YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@IgrejanoRio7"` e importá-la na home e no contato.

**Por quê:** Evita duplicar a string em dois arquivos e garante que os testes e ambas as páginas falem da mesma fonte da verdade.

## Risks / Trade-offs

- **Cor de marca do YouTube vs. paleta do site** → usar tokens do projeto + ícone `mdi:youtube`; aceitar que o destaque siga a identidade do site em vez da cor oficial do YouTube, mantendo coerência visual.
- **Decisão visual sem ver o resultado** → conforme as regras de teste do projeto, rodar Playwright/screenshot antes de declarar o layout pronto; ajustar posição/contraste se o destaque competir com o CTA.
- **Página de Contato em classes legadas** → seguir o padrão legado existente em vez de migrar a página inteira agora (fora de escopo), evitando regressões visuais.

## Migration Plan

Mudança puramente aditiva no frontend, sem migração de banco. Deploy normal (`build` + deploy). Rollback = reverter o commit; não há estado persistido. Validar com `npm run lint`, `npx tsc --noEmit` e a suíte `public-routes` do Playwright.

## Open Questions

- Texto exato do título/botão do destaque (ex.: "Inscreva-se no canal" vs. "Assista aos cultos") — definir na implementação seguindo `site-copy-guidelines`.
- Incluir o YouTube também no Footer? Tratado como possível follow-up, fora deste change.
