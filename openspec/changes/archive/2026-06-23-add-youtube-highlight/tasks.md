## 1. Constante de link compartilhada

- [x] 1.1 Criar `src/lib/links.ts` exportando `YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@IgrejanoRio7"`

## 2. Destaque na homepage

- [x] 2.1 Em `src/app/(frontend)/page.tsx`, importar `YOUTUBE_CHANNEL_URL` e adicionar a seção de destaque do YouTube entre a seção de agenda/downloads e o CTA final
- [x] 2.2 Usar ícone `mdi:youtube` (`@iconify/react`), tokens Tailwind do projeto (`max-w-content`, `font-display`, `brand-*`/`navy-*`, `shadow-soft`) e nenhum bloco novo em `globals.css`
- [x] 2.3 Garantir que o link use `target="_blank"` e `rel="noopener noreferrer"` e tenha texto/CTA conforme `site-copy-guidelines`

## 3. Entrada na página de Contato

- [x] 3.1 Em `src/app/(frontend)/contato/page.tsx`, importar `YOUTUBE_CHANNEL_URL` e adicionar um `icon-detail-item` "YouTube" (ícone `mdi:youtube`) na lista "Informações", espelhando o item do WhatsApp
- [x] 3.2 Adicionar um botão de canal (`btn btn-outline btn-md` com ícone `mdi:youtube`) na fileira "Canais de contato", com `target="_blank"` e `rel="noopener noreferrer"`

## 4. Testes E2E

- [x] 4.1 Em `tests/e2e/public-routes.spec.ts`, adicionar asserções de que a home renderiza o destaque do YouTube com `href` correto, `target="_blank"` e `rel` contendo `noopener`
- [x] 4.2 Adicionar asserções de que `/contato` expõe o item e o botão do YouTube apontando para a mesma URL, com atributos de link seguro

## 5. Verificação visual e qualidade

- [x] 5.1 Rodar Playwright/screenshot da home e do contato para confirmar que o destaque não compete com o CTA e que o contraste/legibilidade estão adequados
- [x] 5.2 Rodar `npx tsc --noEmit`, `npm run lint` e `npm run test:e2e -- tests/e2e/public-routes.spec.ts` e ajustar conforme necessário
