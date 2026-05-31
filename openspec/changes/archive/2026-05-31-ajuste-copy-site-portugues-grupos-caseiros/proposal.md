## Why

O site ainda contém textos com termos em ingles e referencias a pessoas especificas, o que prejudica clareza institucional e consistencia de comunicacao. Este ajuste e necessario agora para alinhar toda a mensagem publica ao contexto real da igreja, em portugues do Brasil.

## What Changes

- Revisar copy das paginas publicas para remover referencias nominais a pastores e figuras especificas.
- Substituir termos em ingles por equivalentes claros em portugues do Brasil em toda experiencia publica.
- Atualizar a descricao de grupos caseiros para refletir que sao reunioes em casas, espalhadas pela cidade, sem rigidez de data e hora unica na Ivan Pessoa.
- Deixar explicito que a unica reuniao geral da igreja ocorre aos domingos, as 10h.

## Capabilities

### New Capabilities

- `site-copy-guidelines`: diretrizes editoriais para linguagem institucional em portugues do Brasil sem referencias pessoais no conteudo publico.

### Modified Capabilities

- `public-routes`: atualiza requisitos de copy nas paginas publicas, incluindo descricao de grupos caseiros e reuniao geral de domingo as 10h.
- `seo-meta`: garante titulos e descricoes sem termos em ingles e coerentes com o novo texto institucional.

## Impact

- Paginas e componentes de conteudo em `src/app/(frontend)` e `src/components`.
- Possiveis ajustes em conteudo de seed/colecoes usadas para renderizacao publica.
- Atualizacao de testes e2e que validam textos e metadados publicos.