## Why

A igreja mantém um canal no YouTube (`https://www.youtube.com/@IgrejanoRio7`) onde publica cultos, pregações e conteúdo, mas o site não tem nenhum ponto de entrada para ele. Visitantes que chegam pela home ou pela página de contato não têm como descobrir e seguir o canal, perdendo um canal de relacionamento contínuo e de alcance dos conteúdos já produzidos.

## What Changes

- Adicionar uma **seção de destaque do canal do YouTube na homepage**, posicionada de forma a convidar o visitante a assistir/inscrever-se sem competir com o CTA final de comunhão.
- Adicionar uma **entrada do YouTube na página de Contato**, tanto na lista "Informações" (item com ícone) quanto entre os botões de "Canais de contato".
- Centralizar a URL do canal (`https://www.youtube.com/@IgrejanoRio7`) como uma constante reutilizável para evitar duplicação entre home e contato.
- Cobrir os dois pontos de entrada com testes Playwright (link presente, visível e apontando para a URL correta, com `target="_blank"` e `rel` seguro).

## Capabilities

### New Capabilities
- `youtube-highlight`: Presença do canal do YouTube no site público — destaque na homepage e ponto de contato dedicado na página de Contato, com link externo seguro e consistente.

### Modified Capabilities
<!-- Nenhuma capability existente tem requisitos alterados; a home ganha um bloco novo e o contato ganha um item adicional, sem mudar comportamento já especificado. -->

## Impact

- **Código**: `src/app/(frontend)/page.tsx` (nova seção), `src/app/(frontend)/contato/page.tsx` (novo item + botão), nova constante de link (ex.: `src/lib/links.ts` ou similar).
- **Testes**: `tests/e2e/public-routes.spec.ts` (ou spec dedicada) para home e contato.
- **Dependências**: nenhuma nova; usa `@iconify/react` (`mdi:youtube`) e Tailwind já presentes.
- **Sem migração de dados** e sem mudanças no Payload CMS — é um link estático para um canal externo.
