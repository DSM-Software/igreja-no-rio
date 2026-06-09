## Why

A página de agenda exibe eventos passados misturados com os próximos, confundindo o usuário. Além disso, os cards de evento têm desalinhamento visual entre os ícones e o texto de horário/local, degradando a qualidade da interface.

## What Changes

- **Filtro de datas**: a query de eventos na página `/agenda` passa a incluir somente eventos com `date >= hoje` (além dos recorrentes, que não têm data específica).
- **Alinhamento do card**: o componente `EventCard` substitui o `verticalAlign: "middle"` inline por um layout `flex items-center gap-1.5` nas linhas de horário e local, garantindo alinhamento preciso entre ícone e texto.

## Capabilities

### New Capabilities

_Nenhuma nova capability._

### Modified Capabilities

- `agenda-page`: adicionar requisito de filtro de data — eventos não-recorrentes passados não devem ser exibidos na página de agenda.

## Impact

- `src/app/(frontend)/agenda/page.tsx` — adicionar filtro `where: { date: { greater_than_equal: <hoje> } }` na query de eventos não-recorrentes.
- `src/components/ui/EventCard.tsx` — trocar alinhamento inline por flex nas linhas de ícone+texto.
- `openspec/specs/agenda-page/spec.md` — delta spec com novo requisito de filtragem de eventos passados.
