## MODIFIED Requirements

### Requirement: Lista de próximos eventos da home omite eventos passados
O sistema SHALL exibir, na lista "Próximos eventos" da home, apenas eventos do dia corrente ou de datas futuras, além dos eventos recorrentes. O sistema SHALL ocultar eventos não-recorrentes com `date` anterior a hoje. Quando dois eventos têm a mesma data, aquele com o horário mais cedo SHALL aparecer primeiro.

#### Scenario: Evento passado não listado
- **WHEN** o usuário acessa `/` e há eventos não-recorrentes com `date` anterior a hoje
- **THEN** esses eventos não aparecem na lista "Próximos eventos" da home

#### Scenario: Evento de hoje listado
- **WHEN** o usuário acessa `/` e há um evento com `date` igual a hoje
- **THEN** esse evento aparece na lista "Próximos eventos" da home

#### Scenario: Eventos no mesmo dia ordenados por horário crescente
- **WHEN** o usuário acessa `/` e há dois ou mais eventos com a mesma `date`
- **THEN** eles aparecem na lista ordenados pelo campo `time` crescente (mais cedo primeiro)

#### Scenario: Eventos recorrentes permanecem elegíveis
- **WHEN** o usuário acessa `/` e há eventos com o campo `recurring` preenchido
- **THEN** esses eventos permanecem elegíveis para a home independentemente de data
