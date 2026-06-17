## Context

A collection `events` possui dois campos de temporalidade: `date` (tipo `date`, somente dia) e `time` (tipo `text`, formato `"HH:MM"`, obrigatório com default `"10:00"`). As queries nas páginas `/agenda` e home usam `sort: "date"` — o campo `time` é ignorado. Quando dois eventos caem no mesmo dia, a ordem é não-determinística.

Como `time` é `required: true` com `defaultValue: '10:00'`, todo documento terá um valor válido no padrão `"HH:MM"`, o que garante ordenação lexicográfica correta (equivalente à cronológica).

## Goals / Non-Goals

**Goals:**
- Eventos com a mesma data aparecem ordenados por horário crescente em todas as superfícies públicas.
- A solução reusa os mecanismos existentes — nenhum campo novo na collection.

**Non-Goals:**
- Alterar o modelo de dados ou a estrutura do campo `time`.
- Aplicar ordenação a contextos administrativos (lista do Payload admin).
- Cobrir eventos recorrentes por horário (eles não têm data fixa; a ordem deles entre si é aceitável como está).

## Decisions

### Multi-sort via Payload API (`sort: "date,time"`)

Payload suporta múltiplos campos de ordenação separados por vírgula: `sort: "date,time"`. Isso delega a ordenação ao banco de dados (PostgreSQL) com dois critérios compostos: `ORDER BY date ASC, time ASC`.

**Alternativa considerada:** ordenar em JavaScript após o `find` (e.g., `events.sort(...)`). Descartada porque exigiria buscar mais registros do que o `limit` para garantir a ordenação correta antes de paginar, e duplicaria lógica de ordenação que o banco já faz melhor.

**Razão da escolha:** zero lógica extra no servidor, sem custo de duplicação, e compatível com paginação futura.

### Nenhum utilitário compartilhado

Ambas as páginas (`/agenda` e `/`) têm só uma chamada `find` de eventos cada. Extrair um helper não reduziria duplicação de forma significativa — mantemos as duas chamadas independentes e apenas atualizamos o campo `sort` em cada uma.

## Risks / Trade-offs

- **Formato inválido em `time`** → O campo é `required` com default `"10:00"`, mas um admin poderia salvar valores como `"10h"` ou `"9:00"`. Nesses casos, a ordenação lexicográfica ainda funciona, mas pode divergir da cronológica. Mitigation: o campo já tem descrição "Ex.: 10:00" no admin; não há validação de formato na collection.
- **Eventos recorrentes sem data** → Eles são filtrados em uma seção separada na `/agenda` e não passam pelo critério de ordenação por data/hora. Sem impacto.

## Migration Plan

Não há migração de banco necessária — nenhum campo novo ou índice é criado. A mudança é apenas na string `sort` das queries. Deploy direto, sem rollback especial.
