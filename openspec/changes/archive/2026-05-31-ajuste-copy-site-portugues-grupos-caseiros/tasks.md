## 1. Levantamento e alinhamento de copy

- [x] 1.1 Mapear textos publicos em `src/app/(frontend)` e `src/components` que contenham termos em ingles ou referencias nominais a pessoas.
- [x] 1.2 Definir frases canonicas para grupos caseiros e reuniao geral de domingo as 10h para uso consistente nas paginas.

## 2. Ajustes de conteudo nas rotas publicas

- [x] 2.1 Atualizar copy das paginas publicas para remover nomes de pessoas especificas e manter linguagem institucional em pt-BR.
- [x] 2.2 Corrigir textos de grupos caseiros para descrever reunioes em casas espalhadas pela cidade, sem data e hora rigidas em local unico.
- [x] 2.3 Garantir que a informacao da unica reuniao geral no domingo as 10h esteja explicita no conteudo relevante.

## 3. Alinhamento de metadados SEO

- [x] 3.1 Revisar e ajustar `<title>` das rotas publicas para manter portugues do Brasil e evitar termos em ingles.
- [x] 3.2 Revisar e ajustar `meta[name="description"]` das rotas publicas para coerencia com o novo copy institucional.

## 4. Validacao automatizada e regressao

- [x] 4.1 Atualizar testes e2e que validam headings, textos e metadados publicos para refletir a nova redacao.
- [x] 4.2 Executar a suite e2e relevante (`public-routes`, `seo-meta`) e confirmar que os cenarios passam com o novo copy.
- [x] 4.3 Revisar rapidamente as rotas publicas principais para confirmar clareza do texto e ausencia de termos em ingles.
