# home-events (delta)

## MODIFIED Requirements

### Requirement: Banner de destaque exibe o próximo evento mais próximo
O sistema SHALL exibir, na seção "Próximo evento em destaque" da home (`/`), o evento não-encerrado mais próximo. Um evento é considerado não-encerrado enquanto seu dia de término (`endDate` quando preenchido, senão `date`) for igual a hoje ou futuro, ou quando for recorrente. O sistema SHALL respeitar o campo editorial `highlight` apenas quando ele aponta para um evento não-encerrado; caso contrário SHALL exibir o evento elegível mais próximo por data de início.

#### Scenario: Destaque ignora evento encerrado e mostra o próximo
- **WHEN** o usuário acessa `/` e existe ao menos um evento não-encerrado
- **THEN** o banner de destaque exibe o evento elegível com a data de início mais próxima, e nunca um evento já encerrado

#### Scenario: Highlight editorial respeitado quando não-encerrado
- **WHEN** o usuário acessa `/` e o evento marcado com `highlight` está em andamento ou é futuro (ou recorrente)
- **THEN** o banner de destaque exibe esse evento marcado

#### Scenario: Highlight encerrado cai para o próximo evento
- **WHEN** o usuário acessa `/` e o evento marcado com `highlight` tem dia de término anterior a hoje
- **THEN** o banner de destaque NÃO exibe esse evento e exibe o próximo evento elegível mais próximo

#### Scenario: Evento multi-dia em andamento elegível para destaque
- **WHEN** o usuário acessa `/` durante um evento multi-dia (`date` anterior a hoje, `endDate` igual a hoje ou futura)
- **THEN** esse evento permanece elegível para o banner de destaque

#### Scenario: Sem eventos elegíveis o banner não aparece
- **WHEN** o usuário acessa `/` e não há eventos recorrentes nem eventos não-encerrados
- **THEN** a seção de destaque não é renderizada

### Requirement: Lista de próximos eventos da home omite eventos passados
O sistema SHALL exibir, na lista "Próximos eventos" da home, apenas eventos não-encerrados — dia de término (`endDate` quando preenchido, senão `date`) igual a hoje ou futuro — além dos eventos recorrentes. O sistema SHALL ocultar eventos não-recorrentes já encerrados. Quando dois eventos têm a mesma data de início, aquele com o horário de início mais cedo SHALL aparecer primeiro.

#### Scenario: Evento encerrado não listado
- **WHEN** o usuário acessa `/` e há eventos não-recorrentes com dia de término anterior a hoje
- **THEN** esses eventos não aparecem na lista "Próximos eventos" da home

#### Scenario: Evento de hoje listado
- **WHEN** o usuário acessa `/` e há um evento com `date` igual a hoje
- **THEN** esse evento aparece na lista "Próximos eventos" da home

#### Scenario: Evento multi-dia em andamento listado
- **WHEN** o usuário acessa `/` durante um evento multi-dia (`date` anterior a hoje, `endDate` igual a hoje ou futura)
- **THEN** esse evento aparece na lista "Próximos eventos" da home

#### Scenario: Eventos no mesmo dia ordenados por horário crescente
- **WHEN** o usuário acessa `/` e há dois ou mais eventos com a mesma `date`
- **THEN** eles aparecem na lista ordenados pelo campo `time` crescente (mais cedo primeiro)

#### Scenario: Eventos recorrentes permanecem elegíveis
- **WHEN** o usuário acessa `/` e há eventos com o campo `recurring` preenchido
- **THEN** esses eventos permanecem elegíveis para a home independentemente de data
