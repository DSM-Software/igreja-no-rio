## 1. Assets de imagem

- [ ] 1.1 Selecionar 3 fotos da referência (1 hero de boas-vindas, 1 comunhão para CTA, 1 adoração/comunidade para Quem Somos)
- [ ] 1.2 Otimizar e exportar em WebP/AVIF, dimensionadas (hero ~1920px, blocos ~1000px) e comprimidas
- [ ] 1.3 Adicionar arquivos em `public/images/community/` com nomes descritivos

## 2. Hero da home com foto de fundo

- [x] 2.1 Estender `src/components/home/HeroV1.tsx` com prop opcional `backgroundImage`
- [x] 2.2 Renderizar `next/image` com `fill` + `object-cover` e `priority` no fundo; mover o gradiente navy/teal atual para uma camada de overlay absoluta
- [x] 2.3 Garantir conteúdo (título/subtítulo) em camada `relative z-10` com texto branco e contraste preservado
- [x] 2.4 Implementar fallback: sem `backgroundImage` ou em falha de carregamento, manter o degradê atual
- [x] 2.5 Passar a foto de boas-vindas a partir de `src/app/(frontend)/page.tsx`

## 3. Banda de CTA final da home

- [x] 3.1 Envolver a seção de CTA final em `src/app/(frontend)/page.tsx` num container `relative` com `next/image fill object-cover` (lazy)
- [x] 3.2 Adicionar overlay escuro garantindo contraste de texto e botões
- [ ] 3.3 Validar reorganização em mobile sem sobreposição/corte horizontal (verificação visual — requer fotos)

## 4. Foto na seção Missão de Quem Somos

- [x] 4.1 Substituir `feature-placeholder feature-placeholder-hero` em `src/app/(frontend)/quem-somos/page.tsx` por wrapper com `next/image fill object-cover`
- [x] 4.2 Manter dimensões/raio e alinhamento do grid de duas colunas existente
- [x] 4.3 Definir `alt` descritivo da cena

## 5. Acessibilidade e performance

- [x] 5.1 Fundos decorativos (hero/CTA) com `alt=""`; foto de conteúdo com `alt` descritivo
- [x] 5.2 Definir `sizes` responsivos e reservar proporção/altura para evitar CLS
- [x] 5.3 Confirmar que nenhum bloco novo foi adicionado a `globals.css` (uso de utilitários Tailwind)

## 6. Testes e verificação visual

- [x] 6.1 Adicionar/atualizar testes (`tests/e2e/community-imagery.spec.ts`): `/` e `/quem-somos` renderizam (`response.ok()`), imagem de fundo visível, título visível sobre a foto
- [x] 6.2 Rodar Playwright e capturar screenshots de `/` e `/quem-somos` em mobile e desktop para validar contraste/legibilidade
- [x] 6.3 Rodar `npm run lint` e `npm run build` sem erros
