## Context

Mudança puramente editorial de copy institucional. Não há lógica nova, nem dependências adicionais, nem migrações. O design existe apenas para registrar o tratamento visual da citação bíblica (único ponto com decisão estilística).

## Goals / Non-Goals

**Goals:**
- Texto novo do hero da home preserva exatamente a mesma hierarquia tipográfica do `<h1>` atual (clamp 44–88px, font-display, extrabold, leading 0.95, tracking -0.02em, cor branca).
- Citação bíblica na seção "Missão" é visualmente identificável como citação, mas sem introduzir um componente novo.

**Non-Goals:**
- Reestilizar o hero ou a seção Missão para além da troca de texto.
- Introduzir um componente `Blockquote` reutilizável (não há reuso previsto).
- Alterar o heading "Para que todos conheçam e amem Jesus" ou o label "Missão".

## Decisions

### Hero: manter ou remover o `<br />`

O `<h1>` atual quebra "Você já foi" / "encontrado." com `<br />` para criar duas linhas com leading apertado em desktop. A nova frase "Seja bem-vindo." é curta o suficiente para caber em uma linha em desktop e quebra naturalmente em mobile graças ao `clamp(44px, 8vw, 88px)`. 

**Decisão:** remover o `<br />` e manter uma única linha. Reduz redundância de markup e o `clamp` mais o `max-w-3xl` do container já cuidam da legibilidade em mobile.

**Alternativa considerada:** manter `<br />` entre "Seja" e "bem-vindo.". Descartada porque cria uma quebra antinatural em uma saudação curta.

### Citação bíblica: `<blockquote>` inline com utilitários Tailwind

A citação de Romanos 8:29 vai em um `<blockquote>` semântico com:
- `border-l-4 border-brand-200 pl-4` (barra lateral teal, padrão de citação)
- `italic text-ink-2 leading-8` 
- Atribuição "Romanos 8:29" no rodapé em `<footer className="mt-2 text-sm text-ink-2 not-italic">`

**Alternativa considerada:** parágrafo simples com aspas tipográficas. Descartada porque a barra lateral comunica visualmente "citação" mesmo sem o leitor processar o texto, e mantém coerência com o paleta brand já em uso.

## Risks / Trade-offs

- **Teste existente quebra:** `tests/e2e/community-imagery.spec.ts:19` afirma o heading do hero com `/encontrado/i`. Mitigation: atualizar para `/bem-vindo/i` no mesmo PR. (Listado em tasks.)
- **Quebra de linha do hero em viewports estreitos:** "Seja bem-vindo." pode quebrar antes da última letra em telas muito estreitas (< 320px). Mitigation: o `clamp` mínimo de 44px já testado por `public-routes.spec.ts` (overflow horizontal) cobre o caso.
