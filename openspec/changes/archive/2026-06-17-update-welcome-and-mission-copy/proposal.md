## Why

A liderança quer ajustar dois textos institucionais para refletir melhor o tom acolhedor e a identidade da comunidade: o título do hero da home (substituir "Você já foi encontrado" por "Seja bem-vindo") e o corpo da seção "Missão" em `/quem-somos`, que passa a enfatizar identidade de família (com citação de Romanos 8:29). A redação atual não comunica isso de forma adequada.

## What Changes

- **Hero da home** (`src/components/home/HeroV1.tsx`): trocar o `<h1>` "Você já foi encontrado." por "Seja bem-vindo." mantendo tipografia, cor e estrutura de quebra de linha do hero (clamp grande, peso extrabold, leading apertado).
- **Seção "Missão" em `/quem-somos`** (`src/app/(frontend)/quem-somos/page.tsx`): substituir os dois parágrafos atuais sob o heading "Para que todos conheçam e amem Jesus" por três parágrafos novos:
  1. "Somos parte da igreja na cidade do Rio de Janeiro. Não vamos à igreja — somos a igreja. E você também pode fazer parte dessa família."
  2. "Cremos que Deus como nosso Pai tem um propósito eterno: uma família, de muitos filhos, conformes à imagem de Jesus, para o louvor da Sua glória."
  3. Citação de Romanos 8:29 destacada visualmente (estilo de citação bíblica): "Porque os que dantes conheceu, também os predestinou para serem conformes à imagem de seu Filho, a fim de Ele seja o primogênito entre muitos irmãos" (Romanos 8:29).
- O heading "Para que todos conheçam e amem Jesus" e a rotulagem "Missão" permanecem.

## Capabilities

### New Capabilities

- `welcome-and-mission-copy`: define as mensagens institucionais do hero da home (saudação de boas-vindas) e do corpo da seção "Missão" em `/quem-somos` (identidade de família com referência a Romanos 8:29).

### Modified Capabilities

_(nenhuma — os specs existentes não pinam essas frases especificamente)_

## Impact

- `src/components/home/HeroV1.tsx` — atualizar o `<h1>`.
- `src/app/(frontend)/quem-somos/page.tsx` — substituir o corpo da seção "Missão" e incluir a citação bíblica.
- Testes E2E em `tests/e2e/` para verificar a presença das novas frases. Testes existentes que afirmam "Você já foi encontrado" precisam ser atualizados (se houver — buscar antes de editar).
