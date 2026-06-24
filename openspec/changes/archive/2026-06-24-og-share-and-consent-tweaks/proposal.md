## Why

Ao compartilhar o link do site nas redes sociais, nenhuma imagem aparece — o `og:image` aponta para `/og-default.jpg`, que não existe em `public/`. Além disso, o título da home no compartilhamento/aba ("Início — Igreja no Rio") não convida o visitante, e no desktop o texto dos botões "Aceitar todos" / "Rejeitar todos" do banner de consentimento quebra em duas linhas, prejudicando o acabamento visual.

## What Changes

- Adicionar a imagem oficial de Open Graph (foto da comunidade com a logo "Igreja no Rio", 1200×630) em `public/` e apontar o `og:image` padrão para ela, garantindo prévia visual ao compartilhar qualquer rota.
- Trocar o `title` da home de `"Início"` para `"Faça parte dessa família"`, fazendo o compartilhamento/aba exibir "Faça parte dessa família — Igreja no Rio" (o rótulo do menu de navegação permanece "Início").
- Impedir a quebra de linha do texto dos botões de ação do banner de consentimento, mantendo "Aceitar todos" e "Rejeitar todos" em uma única linha no desktop.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `seo-meta`: passa a exigir um `og:image` padrão resolvível (arquivo existente, 1200×630) e fixa o copy do título da home para "Faça parte dessa família".
- `cookie-consent`: as ações do banner passam a exigir que o rótulo de cada botão fique em linha única (sem wrap) no desktop.

## Impact

- `public/og-default.jpg` — nova imagem Open Graph (1200×630, JPEG ~150KB); o `og:image` do layout já a referenciava, então `layout.tsx` não muda.
- `src/app/(frontend)/page.tsx` — `title` da home.
- `src/app/(frontend)/{blog,agenda,contato,downloads,quem-somos,privacidade}/page.tsx` — remoção do `openGraph` redundante para herdar o `og:image` padrão (descoberto na implementação).
- `src/components/consent/ConsentBanner.tsx` — classe utilitária dos botões (no-wrap).
- Testes E2E: `tests/e2e/seo-meta.spec.ts` (og:image em todas as rotas, título da home, remoção de `/cultos` que redireciona) e `tests/e2e/cookie-consent.spec.ts` (texto em linha única).
