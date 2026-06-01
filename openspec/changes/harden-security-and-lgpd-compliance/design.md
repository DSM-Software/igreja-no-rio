## Context

O endurecimento necessário é transversal: envolve bootstrap do Payload, regras de acesso em coleções, renderização pública de links externos, configuração de origens confiáveis, dependências de runtime e transparência jurídica nas rotas públicas. Hoje o repositório já possui uma base razoável de operação com TLS, HSTS e rate limiting no Nginx, mas ainda deixa decisões sensíveis em estado permissivo ou implícito, como seed administrativo com fallback previsível, trusted origins dependentes de uma única variável pública e ausência de documentos legais públicos.

Os pontos de maior risco identificados na exploração foram: credenciais administrativas default no seed, validação ausente para `externalUrl` de downloads, enforcement incompleto de ownership para autores, advisories abertos em dependências críticas e interface pública de contato que aparenta coleta de dados sem explicar tratamento, retenção ou canal adequado de exercício de direitos.

## Goals / Non-Goals

**Goals:**
- Eliminar fallbacks inseguros no provisionamento administrativo e na configuração de origens confiáveis.
- Tornar o modelo de papéis e ownership coerente com o que o CMS promete para admin, editor e autor.
- Garantir que links públicos controlados por CMS só apontem para destinos validados e seguros.
- Expor uma camada mínima e clara de transparência LGPD no site público, especialmente em contato e navegação recorrente.
- Fechar a lacuna operacional mais relevante em dependências e headers antes de uma próxima publicação.

**Non-Goals:**
- Transformar o site em uma plataforma completa de gestão de consentimento ou cookie banner sem tracking ativo.
- Redesenhar a identidade visual pública ou reestruturar o CMS além do necessário para segurança e compliance.
- Substituir o Payload ou introduzir um sistema jurídico/documental complexo além do necessário para política de privacidade e avisos de contato.

## Decisions

### Decisão: Bootstrap administrativo deve falhar fechado
O seed não deve criar usuário privilegiado se `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` ou `SEED_ADMIN_NAME` estiverem ausentes, vazios ou em valores-placeholder conhecidos. Em vez de “ajudar” com defaults, o processo deve abortar com erro explícito e instrução operacional.

Alternativas consideradas:
- Manter defaults e depender de disciplina operacional: rejeitado porque transforma erro de configuração em compromisso de conta administrativa.
- Remover completamente o seed: rejeitado porque o ambiente ainda precisa de um caminho previsível de bootstrap.

### Decisão: Ownership deve existir no modelo, não só na regra de acesso
As coleções mutáveis por autor devem carregar um campo `owner` preenchido por hook de servidor, e as regras de update/delete devem depender desse campo para autores, preservando acesso amplo apenas para admin/editor. Isso corrige a incoerência atual em que a regra referencia `owner` sem garanti-lo no schema.

Alternativas consideradas:
- Dar acesso amplo a todos os usuários autenticados: rejeitado porque contradiz o modelo editorial definido.
- Restringir tudo apenas a admin/editor: rejeitado porque elimina o papel de autor do fluxo previsto.

### Decisão: Validar URLs externas na entrada e na renderização
`externalUrl` deve aceitar apenas URLs absolutas com protocolo permitido (`https:` e, se mantido por compatibilidade, `http:`), preferencialmente com validação no schema e uma segunda proteção na camada de renderização para omitir links inválidos. A validação em duas camadas reduz risco de conteúdo legado ou dados inconsistentes.

Alternativas consideradas:
- Validar apenas no frontend: rejeitado porque deixa dados perigosos persistidos no CMS.
- Validar apenas no schema: insuficiente sozinho para conteúdo já gravado ou importado antes da correção.

### Decisão: Transparência pública deve ser resolvida na UI, não apenas em documentação interna
O site deve publicar uma política de privacidade acessível por navegação recorrente e ajustar a página de contato para comunicar claramente se há coleta ativa, qual a finalidade e qual canal oficial de contato. Se o formulário continuar sem backend, a UI deve deixar isso explícito ou ser substituída por um canal real.

Alternativas consideradas:
- Deixar a adequação só em README ou operação interna: rejeitado porque não resolve a transparência perante o visitante.
- Implementar imediatamente fluxo completo de consentimento e storage: rejeitado por ampliar demais o escopo atual.

### Decisão: Baseline de runtime deve combinar upgrade de dependências e headers explícitos
O change deve incluir atualização para patch seguro de Next.js e revisão dos advisories de produção com correções disponíveis, além de completar o baseline de headers com CSP compatível com Next/Payload. A combinação reduz exposição a issues conhecidas e fortalece a entrega pública sem depender apenas da aplicação.

Alternativas consideradas:
- Tratar advisories como ruído até virar incidente: rejeitado porque há achados com correção disponível.
- Adicionar CSP extremamente restritiva sem rollout controlado: rejeitado porque pode quebrar admin, imagens remotas e scripts legítimos.

### Decisão: Trusted origins devem usar configuração explícita por ambiente
`serverURL`, `cors` e `csrf` devem derivar de variáveis explícitas de servidor e suportar múltiplas origens confiáveis quando necessário, sem cair para `localhost` em produção. Isso precisa ser documentado e validado em configuração.

Alternativas consideradas:
- Continuar com uma única `NEXT_PUBLIC_SERVER_URL`: rejeitado por fragilidade em produção, preview e domínios auxiliares.

## Risks / Trade-offs

- [Risco] Introduzir `owner` nas coleções exige migração de dados existentes e definição de propriedade para conteúdo já criado. → Mitigação: backfill em migration/script e fallback temporário para admin/editor enquanto o conteúdo legado é atribuído.
- [Risco] Upgrade de Next.js pode gerar regressões não relacionadas em build, imagens ou admin. → Mitigação: atualizar para patch target mínimo, executar lint/testes E2E focados e revisar changelog do salto exato.
- [Risco] CSP mal calibrada pode bloquear Payload admin, fontes, imagens remotas ou Iconify. → Mitigação: começar com política observável/compatível e validar rotas públicas e admin antes de apertar diretivas.
- [Risco] Publicar política de privacidade sem revisão adequada pode criar promessa jurídica imprecisa. → Mitigação: estruturar conteúdo técnico correto e marcar revisão final do texto por responsável jurídico/operacional.
- [Risco] Remover ou clarificar o formulário de contato pode reduzir conversão temporariamente. → Mitigação: manter e-mail/WhatsApp visíveis e só expor formulário quando houver fluxo real de tratamento.

## Migration Plan

1. Ajustar configuração e bootstrap: remover defaults inseguros, adicionar variáveis explícitas de origem confiável e preparar upgrade de dependências.
2. Evoluir schema/access: introduzir `owner`, hooks de preenchimento e regras de mutação coerentes para posts, downloads e events, com backfill para conteúdo existente.
3. Endurecer superfícies públicas: validar `externalUrl`, ajustar `DownloadCard`, publicar política de privacidade e revisar a página de contato e links recorrentes no footer/header.
4. Atualizar entrega: completar headers de segurança compatíveis, revisar imagens remotas e confirmar comportamento do Nginx/Next em produção.
5. Validar e liberar: executar lint e E2E focados em admin, downloads, rotas públicas e documentos legais; rollback consiste em reverter o change inteiro e restaurar a configuração anterior, preservando backup de conteúdo e variáveis.

## Open Questions

- A igreja quer manter um formulário real de contato nesta fase ou prefere canal explícito por e-mail/WhatsApp até haver backend e política operacional definidos?
- Haverá revisão jurídica formal do texto da política de privacidade antes da publicação, ou o change deve entregar apenas um texto-base técnico?
- O domínio final usará apenas apex e www ou também previews/hosts auxiliares que precisem entrar na lista de trusted origins?
- O baseline de CSP deve ser entregue já em modo enforcement ou primeiro em modo compatível com revisão manual?