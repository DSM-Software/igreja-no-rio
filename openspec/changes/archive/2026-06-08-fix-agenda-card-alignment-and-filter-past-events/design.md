## Context

A página `/agenda` busca eventos sem filtro de data (`where: {}`), exibindo eventos passados junto com os futuros. O componente `EventCard` usa `verticalAlign: "middle"` inline nos ícones dentro de `<p>`, o que não garante alinhamento preciso entre ícone e texto em todos os contextos.

## Goals / Non-Goals

**Goals:**
- Ocultar eventos não-recorrentes com `date` anterior a hoje na página `/agenda`
- Corrigir o alinhamento visual entre ícone e texto nas linhas de horário e local do `EventCard`

**Non-Goals:**
- Alterar a lógica de eventos recorrentes (continuam exibidos independente de data)
- Modificar o `EventCard` usado na home page
- Adicionar paginação ou ordenação adicional

## Decisions

### 1. Filtro de data na query do servidor

**Decisão**: Aplicar `where: { date: { greater_than_equal: <hoje ISO> } }` diretamente na query Payload dentro do Server Component `agenda/page.tsx`.

**Alternativas consideradas**:
- Filtrar no lado do cliente após buscar todos os eventos — descartado: desperdiça banda e expõe dados desnecessários.
- Filtrar no banco via SQL/migration — desnecessário, Payload já suporta filtros `greater_than_equal` em campos `date`.

**Detalhe**: `new Date().toISOString().split('T')[0]` gera `YYYY-MM-DD`, compatível com o campo `date` do Payload (que armazena como date string). Eventos recorrentes não têm `date` relevante para exibição futura, então são buscados separadamente ou sem esse filtro.

### 2. Alinhamento ícone + texto com flex

**Decisão**: Substituir `<p>` + `verticalAlign: "middle"` inline por `<span className="flex items-center gap-1.5">` envolvendo ícone e texto em cada linha.

**Alternativas consideradas**:
- Manter `verticalAlign` com ajuste de `line-height` — frágil, depende do tamanho de fonte e do navegador.
- Usar CSS grid — overhead desnecessário para duas linhas simples.

**Detalhe**: O ícone `<Icon>` do Iconify renderiza um `<svg>` inline; dentro de um flex container, `items-center` alinha perfeitamente o centro do SVG com o centro da linha de texto.

## Risks / Trade-offs

- **Fuso horário**: `new Date()` no servidor Node.js usa o fuso do host. Em produção (UTC), `hoje` pode diferir do calendário local do Brasil (UTC-3). Eventos de hoje cedo (antes das 03:00 UTC) podem ser filtrados indevidamente. → Mitigação: usar `new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))` para gerar a data no fuso correto, ou simplesmente subtrair 3h ao comparar. Dado que eventos raramente terminam antes das 03h00 locais, a abordagem pragmática é aceitar a janela de 3h e documentar.
- **EventCard compartilhado**: o componente é usado também na home page. A mudança de layout flex é puramente visual e não quebra nenhum outro uso.
