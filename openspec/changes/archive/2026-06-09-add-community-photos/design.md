## Context

O frontend é Next.js App Router (SSR/SSG) com Payload CMS no mesmo processo. Hoje o hero da home (`HeroV1`), a banda de CTA final e os blocos institucionais usam apenas degradês/placeholders — nenhuma fotografia. A referência do site antigo aplicava fotos de comunidade em duas superfícies-âncora: **boas-vindas (hero)** e **CTA de comunhão**.

Restrições relevantes:
- Imagens já existentes no projeto passam pela Media collection + S3, com `next/image` configurado para tratar URLs como `unoptimized` (ver `CoverArt`).
- `public/` hoje só contém SVGs (logos/favicon) — não há assets raster.
- Tailwind é o sistema de estilos primário; `globals.css` não deve receber novos blocos (CLAUDE.md). Tokens: `navy-900`, `teal-500`, `shadow-soft`, etc.
- Decisões visuais exigem verificação via Playwright antes de concluir (CLAUDE.md).

## Goals / Non-Goals

**Goals:**
- Reintroduzir calor humano da referência em 3 pontos de alto impacto (hero, CTA final, Missão em Quem Somos).
- Criar um padrão reutilizável de "foto de fundo + overlay" com contraste de texto garantido.
- Preservar resiliência: a página renderiza mesmo se a imagem falhar (fallback de degradê).
- Cobrir as superfícies com testes E2E.

**Non-Goals:**
- Galeria/carrossel, lightbox, imagens em `EventCard`, retratos de liderança.
- Gestão editorial dessas 3 imagens-âncora via CMS (são brand assets estáveis).
- Reprocessar ou hospedar exatamente todas as imagens da referência — usaremos um subconjunto curado.

## Decisions

### Decisão 1: Imagens-âncora como assets estáticos em `public/images/community/`
As 3 fotos (hero, CTA, missão) são **branding editorial estável**, não conteúdo gerido por editores. Servir como assets estáticos otimizados:
- Renderiza sem fetch ao CMS → home resiliente e rápida (bom para LCP do hero).
- `next/image` otimiza assets locais nativamente (sem necessidade de `remotePatterns` novos).
- Versionadas no repositório junto ao código que as referencia.

**Alternativa considerada:** subir via Media collection (S3). Rejeitada para estas 3 superfícies por acoplar a home ao CMS/S3 e exigir seed/migração para o layout renderizar corretamente. (Conteúdo realmente dinâmico — capas de blog, downloads — continua no CMS.)

As imagens devem ser exportadas em formato web moderno (WebP/AVIF), redimensionadas para a maior largura útil (hero ~1920px, blocos ~1000px) e comprimidas antes de commitar.

### Decisão 2: Padrão "imagem de fundo + overlay" via `next/image fill`
Para hero e CTA, usar um container `relative` com `<Image fill className="object-cover" />` no fundo e um overlay absoluto com o gradiente atual (`navy-900` → teal radial). O conteúdo (texto/botões) fica em camada `relative z-10`. Isso reaproveita exatamente o gradiente já usado no `HeroV1`, apenas movendo-o de `background` para uma camada sobre a foto.

- Garante contraste: o overlay escuro é a única dependência para legibilidade — texto continua branco.
- `priority` na imagem do hero (above-the-fold); `loading="lazy"` na CTA e na foto de Quem Somos.

**Alternativa considerada:** CSS `background-image`. Rejeitada por perder otimização do `next/image` e responsividade de `sizes`.

### Decisão 3: `HeroV1` aceita prop opcional de imagem; fallback preservado
Estender `HeroV1` com prop opcional (ex.: `backgroundImage`). Sem a prop, mantém o comportamento atual de degradê puro → mudança não-quebrante e fácil rollback. A home passa a imagem; outras eventuais reutilizações não são afetadas.

### Decisão 4: Quem Somos substitui placeholder por componente de imagem
Trocar `<div className="feature-placeholder feature-placeholder-hero" />` por um wrapper com `next/image fill object-cover`, mantendo as mesmas dimensões/raio do placeholder (reaproveitar classes de container existentes para não alterar o grid). Manter `alt` descritivo.

### Decisão 5: Acessibilidade e legibilidade
- Fotos de fundo (hero/CTA) são decorativas → `alt=""` + overlay garante contraste do texto.
- Foto de conteúdo (Quem Somos) → `alt` descritivo da cena.
- Reservar proporção do container (aspect/altura fixa) para evitar CLS.

## Risks / Trade-offs

- **Contraste insuficiente do texto sobre foto clara** → Mitigação: overlay com opacidade calibrada (reusar gradiente navy existente); validar via Playwright screenshot em mobile e desktop antes de concluir.
- **Peso das imagens degradando LCP** → Mitigação: exportar WebP/AVIF comprimido, dimensionar ao tamanho real, `priority` só no hero e `sizes` responsivos.
- **CLS durante carregamento** → Mitigação: container com altura/aspect fixos; `fill` dentro de wrapper dimensionado.
- **Imagens da referência podem ter direitos/rostos identificáveis** → Mitigação: usar somente fotos fornecidas/autorizadas pela igreja; preferir enquadramentos da própria referência já usada publicamente.
- **Divergência de fonte (estático vs CMS)** → Trade-off aceito: brand assets estáticos; conteúdo dinâmico permanece no CMS.

## Migration Plan

1. Adicionar imagens otimizadas em `public/images/community/`.
2. Estender `HeroV1` (prop de imagem + camada de overlay) e aplicá-la na home.
3. Atualizar banda de CTA final da home e seção Missão de `/quem-somos`.
4. Rodar `npm run lint`, `npm run build` e Playwright (`public-routes`), inspecionando screenshots de `/` e `/quem-somos` em mobile e desktop.
5. Rollback: remover a prop de imagem (hero/CTA voltam ao degradê) e reverter a seção de Quem Somos ao placeholder.

## Open Questions

- Quais 3 fotos específicas usar (seleção final do subconjunto da referência)? — definir na implementação com base nos arquivos disponibilizados.
- Manter as artes com texto embutido ("Seja bem-vindo"/"Conte conosco") ou usar a foto limpa com o texto renderizado em HTML? Recomendação: **foto limpa + texto em HTML** (melhor responsividade, acessibilidade e i18n) — o título já existe no layout.
