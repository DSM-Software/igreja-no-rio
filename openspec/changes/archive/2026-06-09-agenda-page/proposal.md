## Why

Os próximos eventos da igreja aparecem embutidos na página de Contato, misturados a informações de endereço e canais de comunicação. Isso cria ruído cognitivo, dilui o foco do usuário e esconde a agenda atrás de uma rota secundária — pouco intuitivo para quem quer apenas saber o que está acontecendo.

## What Changes

- Criar nova rota `/agenda` com uma página dedicada a eventos da igreja
- Remover a seção "Próximos eventos" da página `/contato`
- Adicionar "Agenda" ao menu de navegação principal (desktop e mobile)
- Adicionar link para `/agenda` no sitemap e robots
- Ajustar metadados SEO da página `/contato` para não mencionar mais a agenda de eventos

## Capabilities

### New Capabilities

- `agenda-page`: Página pública `/agenda` exibindo os próximos eventos da igreja com layout e filtros otimizados para UX

### Modified Capabilities

- `public-routes`: Nova rota `/agenda` é adicionada ao conjunto de rotas públicas do site

## Impact

- `src/app/(frontend)/contato/page.tsx` — remover fetch de eventos e seção "Próximos eventos"
- `src/app/(frontend)/agenda/page.tsx` — novo arquivo (nova rota)
- `src/components/layout/Header.tsx` — adicionar item "Agenda" no `NAV_LINKS`
- `src/app/(frontend)/sitemap.ts` — incluir `/agenda`
- Componente `EventCard` existente reutilizado sem alteração
