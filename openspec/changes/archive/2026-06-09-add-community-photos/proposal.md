## Why

O site atual é quase todo "texto sobre gradiente": o hero da home, a banda de CTA final e os placeholders da página *Quem Somos* / *Cultos* usam fundos sólidos ou degradês, sem nenhuma fotografia da comunidade. As imagens de referência do site antigo (fotos de adoração, abraços e comunhão com as artes "Seja bem-vindo" e "Conte conosco!") mostram que a identidade da Igreja no Rio era construída a partir de pessoas reais. Recuperar esse calor humano nos pontos certos aumenta acolhimento, confiança e conversão sem poluir o layout.

## What Changes

- Adicionar fotografia da comunidade em **3 superfícies de alto impacto**, espelhando a referência:
  - **Hero da home** (`HeroV1`): foto full-bleed da congregação como fundo, sob overlay navy/teal, mantendo o título "Você já foi encontrado" legível — equivalente ao "Seja bem-vindo".
  - **Banda de CTA final da home**: foto de comunhão como fundo, com overlay escuro — equivalente ao "Conte conosco! Desfrute da comunhão."
  - **Placeholder da seção Missão em `/quem-somos`**: substituir o `feature-placeholder-hero` (degradê) por foto real de adoração/comunidade.
- Introduzir um padrão reutilizável de **imagem de fundo com overlay** (gradiente + foto) para hero/CTAs, garantindo contraste de texto acessível.
- Adicionar um conjunto curado de imagens otimizadas como assets do projeto (não todas as da referência — apenas algumas representativas) e renderizá-las com `next/image`.
- Cobrir as novas superfícies visuais com testes Playwright (rota renderiza, imagem visível, texto sobre a imagem permanece visível).

Fora de escopo (intencional, para manter foco): galeria/carrossel de fotos, imagens em `EventCard`, fotos de liderança individuais, e gestão dessas imagens via CMS (decisão de fonte em `design.md`).

## Capabilities

### New Capabilities
- `community-imagery`: Uso intencional de fotografia da comunidade em superfícies públicas-chave (hero, banda de CTA, bloco institucional) com overlay que preserva contraste e legibilidade, em paridade visual com a referência do site antigo.

### Modified Capabilities
<!-- Nenhuma alteração de requisito em specs existentes; a consistência visual existente (public-visual-consistency, tailwind-styling-foundation) permanece como guardrail, não como requisito modificado. -->

## Impact

- **Componentes**: `src/components/home/HeroV1.tsx` (suporte a imagem de fundo + overlay), seção de CTA final em `src/app/(frontend)/page.tsx`, seção Missão em `src/app/(frontend)/quem-somos/page.tsx`.
- **Assets**: novo diretório de imagens otimizadas (ex.: `public/images/community/`) e/ou uso da Media collection — definido em `design.md`.
- **Config**: possível ajuste de `next/image` (remote patterns / sizes) caso as imagens venham do S3.
- **Testes**: `tests/e2e/public-routes.spec.ts` (ou novo spec) para validar renderização e legibilidade.
- **Sem breaking changes**: comportamento de fallback (degradê) preservado caso a imagem não carregue.
