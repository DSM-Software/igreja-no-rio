## Why

A igreja possui uma editora parceira, a **Servo Livre** (`https://www.loja.servolivre.com/`), e hoje o site não oferece nenhum caminho para o visitante conhecer e comprar esses materiais. Damos visibilidade ao parceiro com duas entradas complementares: um banner promocional de destaque na homepage (alta visibilidade, contextual) e um link permanente no rodapé (acesso persistente em todas as páginas).

## What Changes

- Adicionar uma **constante centralizada** com a URL da loja da Servo Livre em `src/lib/links.ts`, reutilizada por todas as entradas.
- Adicionar um **banner full-width "Conheça nossos materiais"** na homepage (`/`), posicionado logo após a seção de Agenda + Downloads e antes do destaque do YouTube, com CTA que abre a loja em nova aba.
- Adicionar um **link "Editora Servo Livre"** no rodapé (`Footer.tsx`), presente em todas as páginas, abrindo a loja em nova aba.
- Cobrir as duas entradas com testes E2E Playwright (visibilidade, `href` correto, `target="_blank"` + `rel="noopener"`).

## Capabilities

### New Capabilities
- `publisher-promotion`: Visibilidade da editora parceira (Servo Livre) no site, com banner promocional na homepage, link no rodapé e URL centralizada reutilizável.

### Modified Capabilities
<!-- Nenhuma capability existente tem requisitos alterados; o banner é uma nova seção e o link no rodapé é um acréscimo, sem mudar o comportamento especificado das capabilities atuais (home-events, downloads-page, etc.). -->

## Impact

- **Código novo/alterado**:
  - `src/lib/links.ts` — nova constante `SERVO_LIVRE_URL`.
  - `src/app/(frontend)/page.tsx` — nova seção de banner após os Downloads.
  - `src/components/layout/Footer.tsx` — novo link para a editora.
  - Possível novo componente de seção (ex.: `src/components/home/PublisherBanner.tsx`) seguindo os padrões de seção existentes.
  - `tests/e2e/public-routes.spec.ts` (ou spec dedicada) — novas asserções.
- **Sem mudanças** de schema Payload, migrações, dependências ou variáveis de ambiente.
- **Links externos**: a URL aponta para domínio de terceiro (`loja.servolivre.com`); usar `target="_blank"` + `rel="noopener noreferrer"`, consistente com o padrão do projeto (YouTube/WhatsApp).
