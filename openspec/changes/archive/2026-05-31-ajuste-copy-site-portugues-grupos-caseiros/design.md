## Context

O site possui conteudo institucional em varias rotas publicas e metadados SEO definidos por pagina. Parte desse texto ainda contem termos em ingles e referencias pessoais, enquanto a comunicacao desejada deve ser institucional, clara e consistente em portugues do Brasil. Tambem e necessario corrigir o texto sobre grupos caseiros para refletir o funcionamento real (reunioes em casas, espalhadas pela cidade) e deixar explicito que a unica reuniao geral ocorre no domingo as 10h.

## Goals / Non-Goals

**Goals:**
- Padronizar o copy publico em portugues do Brasil sem termos em ingles.
- Remover referencias nominais a pessoas especificas no conteudo publico.
- Ajustar o texto sobre grupos caseiros e reuniao geral de domingo as 10h.
- Alinhar titulos e descricoes SEO ao novo padrao editorial.

**Non-Goals:**
- Nao alterar fluxo de navegacao, layout estrutural ou componentes visuais fora de necessidade textual.
- Nao alterar regras de acesso, autenticacao ou rotas administrativas.
- Nao redefinir estrategia completa de SEO alem de lingua e coerencia semantica do novo copy.

## Decisions

1. Centralizar os ajustes em conteudo renderizado nas rotas publicas e metadados por pagina.
   - Racional: minimiza risco tecnico e entrega rapidamente o ajuste editorial pedido.
   - Alternativa considerada: criar sistema novo de governanca de conteudo; descartada por escopo atual.

2. Definir regra explicita de linguagem (pt-BR) para textos publicos e SEO.
   - Racional: evita regressao futura com termos em ingles em headings, botoes, titulos ou descricoes.
   - Alternativa considerada: revisao apenas manual sem regra; descartada por risco alto de recorrencia.

3. Tratar grupos caseiros e reuniao geral como pontos normativos testaveis.
   - Racional: transforma o ajuste de copy em comportamento verificavel por teste automatizado.
   - Alternativa considerada: ajuste ad-hoc sem criterio de validacao; descartada por baixa confiabilidade.

## Risks / Trade-offs

- [Risco] Conteudo dinamico vindo do CMS pode manter texto antigo -> Mitigacao: revisar campos usados nas paginas e seeds relevantes.
- [Risco] Testes e2e atuais podem quebrar por assert de texto antigo -> Mitigacao: atualizar cenarios com as novas frases canonicas.
- [Trade-off] Requisito de linguagem estrita pode exigir manutencao editorial mais frequente -> Mitigacao: documentar padrao nos specs para orientar mudancas futuras.

## Migration Plan

1. Atualizar specs de comportamento publico e SEO com os novos requisitos de copy.
2. Implementar ajustes nos textos das rotas/componentes e fontes de conteudo associadas.
3. Atualizar testes e2e para validar nova redacao.
4. Executar suite de testes e revisar regressao visual basica das rotas publicas.

## Open Questions

- Existe algum texto institucional em area de blog/post que tambem deva seguir a mesma restricao de linguagem agora?
- O endereco da Ivan Pessoa deve continuar exibido apenas como contato/localizacao, sem associacao com reuniao geral?