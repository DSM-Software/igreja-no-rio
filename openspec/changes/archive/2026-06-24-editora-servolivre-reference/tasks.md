## 1. URL centralizada

- [x] 1.1 Adicionar `export const SERVO_LIVRE_URL = 'https://www.loja.servolivre.com/'` em `src/lib/links.ts`

## 2. Banner da homepage

- [x] 2.1 Criar `src/components/home/PublisherBanner.tsx` — seção full-width "Conheça nossos materiais" com copy de apoio e CTA "Visitar a loja", usando tokens Tailwind (`max-w-content`, `brand-*`/`navy-*`), ícone `@iconify/react` e link externo (`href={SERVO_LIVRE_URL}`, `target="_blank"`, `rel="noopener noreferrer"`)
- [x] 2.2 Renderizar `<PublisherBanner />` em `src/app/(frontend)/page.tsx` entre a seção de Agenda + Downloads e o destaque do YouTube
- [x] 2.3 Validar visualmente o banner com Playwright (desktop e mobile) e ajustar cor/hierarquia para diferenciá-lo dos vizinhos (banner de eventos teal e card do YouTube navy)

## 3. Link no rodapé

- [x] 3.1 Adicionar o link "Editora Servo Livre" em `src/components/layout/Footer.tsx` apontando para `SERVO_LIVRE_URL`, como link externo (`<a target="_blank" rel="noopener noreferrer">`)

## 4. Testes E2E

- [x] 4.1 Adicionar teste em `tests/e2e/public-routes.spec.ts`: na home, o banner está visível, com `href` = `SERVO_LIVRE_URL`, `target="_blank"` e `rel` contendo `noopener`
- [x] 4.2 Adicionar teste do link no rodapé (em qualquer página pública): `href` correto, `target`/`rel` corretos
- [x] 4.3 Garantir que o teste da home valida que as seções existentes continuam visíveis (resposta `ok()`)

## 5. Verificação final

- [x] 5.1 Rodar `npx tsc --noEmit` e `npm run lint`
- [x] 5.2 Rodar `npm run test:e2e -- tests/e2e/public-routes.spec.ts`
