## Context

O site já possui um `EventCard` component funcional e uma coleção `events` no Payload CMS. Os eventos são atualmente carregados na rota `/contato` junto a informações de endereço e canais de contato — uma mistura que prejudica a escaneabilidade de ambas as seções. A proposta é criar `/agenda` como destino dedicado e limpar a página de contato.

## Goals / Non-Goals

**Goals:**
- Nova rota `/agenda` com layout focado em eventos, otimizado para UX
- Separação clara de responsabilidades: `/contato` = como falar conosco, `/agenda` = o que está acontecendo
- "Agenda" adicionado à navegação principal
- Página de contato limpa, sem a seção de eventos
- Sitemap atualizado

**Non-Goals:**
- Filtros por categoria ou tipo de evento (escopo futuro)
- Integração com Google Calendar ou iCal
- Paginação (limite razoável de eventos é suficiente por ora)
- Sistema de RSVP ou inscrição

## Decisions

### 1. Reutilizar `EventCard` sem modificações
O componente já existe, está correto e é usado na página de contato. Não há razão para duplicar ou modificar — basta reutilizá-lo.

**Alternativa considerada:** Criar um novo `AgendaCard` com layout diferente. Rejeitado — adiciona complexidade sem benefício imediato.

### 2. Layout em lista única com grouping visual por mês
Os eventos serão exibidos em ordem cronológica crescente, agrupados visualmente por mês com um separador de seção. Isso orienta o usuário temporalmente sem exigir filtros.

**Alternativa considerada:** Grid de cards lado a lado. Rejeitado — para uma lista de eventos com texto variável, a lista vertical lê melhor e é mais previsível em mobile.

### 3. Separar "Regulares" de "Próximos eventos únicos"
Se existirem eventos recorrentes (campo `recurring`), exibi-los em uma seção separada "Encontros regulares" acima dos eventos com data específica. Isso ajuda o visitante a entender o ritmo semanal da igreja sem precisar navegar pela lista.

**Alternativa considerada:** Misturar tudo na lista. Rejeitado — eventos recorrentes sem data fixa poluem a leitura cronológica.

### 4. Estado vazio com call-to-action para contato
Quando não há eventos cadastrados, exibir uma mensagem amigável com link para `/contato`. Evita uma página em branco.

### 5. `force-dynamic` para dados sempre frescos
Igual à abordagem já usada em `/contato` — sem cache estático para garantir que eventos novos apareçam imediatamente após cadastro no admin.

## Risks / Trade-offs

- **Risco: Evento recorrente sem `date` válida** → `EventCard` já trata isso com fallback `—`; nenhum risco novo.
- **Trade-off: Grouping por mês requer lógica de formatação de data** → Complexidade mínima, encapsulada na página.
- **Risco: Nav com 7 itens pode ficar apertada em tablets** → Avaliar se o layout do header aguenta; o item "Agenda" é curto e não deve quebrar.

## Migration Plan

1. Criar `/agenda/page.tsx`
2. Adicionar "Agenda" ao `NAV_LINKS` no Header
3. Remover fetch de eventos e seção "Próximos eventos" de `/contato/page.tsx`
4. Adicionar `/agenda` ao `sitemap.ts`
5. Atualizar `metadata` do `/contato` removendo menção a "agenda de eventos"

Rollback: reverter commits individualmente. Não há mudança de schema ou banco de dados.
