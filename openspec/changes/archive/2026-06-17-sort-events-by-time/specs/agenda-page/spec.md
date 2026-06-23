## MODIFIED Requirements

### Requirement: Página de agenda exibe próximos eventos
O sistema SHALL exibir a rota `/agenda` com a lista de próximos eventos da igreja em ordem cronológica crescente por data **e horário**, reutilizando o componente `EventCard`. Quando dois eventos têm a mesma data, aquele com o horário mais cedo SHALL aparecer primeiro.

#### Scenario: Página carrega com eventos
- **WHEN** o usuário acessa `/agenda` e há eventos cadastrados
- **THEN** a página retorna status 200, exibe o título "Agenda" e lista os eventos em ordem de data crescente; eventos no mesmo dia aparecem em ordem de horário crescente
