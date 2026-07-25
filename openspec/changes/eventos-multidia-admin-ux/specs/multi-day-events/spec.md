# multi-day-events (delta)

## ADDED Requirements

### Requirement: Evento pode ter data e horário de término
O sistema SHALL permitir cadastrar em `Events` um término opcional composto por `isMultiDay` (checkbox, default falso), `endDate` (data) e `endTime` (horário `HH:MM`). Quando `isMultiDay` está marcado, `endDate` SHALL ser obrigatório. O sistema SHALL rejeitar `endDate` anterior a `date` e, quando `endDate` é igual a `date`, SHALL rejeitar `endTime` menor ou igual a `time`. Quando `isMultiDay` é desmarcado, o sistema SHALL limpar `endDate` e `endTime` ao salvar.

#### Scenario: Cadastro de evento multi-dia válido
- **WHEN** um editor cria um evento com `isMultiDay` marcado, `date` = dia 1º 08:00 e `endDate` = dia 3 com `endTime` 12:00
- **THEN** o evento é salvo com os campos de término preenchidos

#### Scenario: Término anterior ao início rejeitado
- **WHEN** um editor tenta salvar um evento com `endDate` anterior a `date`
- **THEN** o Payload rejeita o save com mensagem de validação em português

#### Scenario: Desmarcar multi-dia limpa o término
- **WHEN** um editor desmarca `isMultiDay` em um evento que tinha `endDate`/`endTime` e salva
- **THEN** o evento é salvo com `endDate` e `endTime` nulos

### Requirement: Superfícies públicas exibem o intervalo de datas de eventos multi-dia
O sistema SHALL exibir o intervalo de datas de um evento com `endDate` em dia diferente de `date`: no `EventCard`, o bloco de data SHALL mostrar o intervalo de dias quando início e término estão no mesmo mês (ex.: "01–03" / "AGO") e, quando cruzam meses, SHALL manter o início no bloco e indicar o término na linha de informações (ex.: "até 02 ago"). A linha de horário SHALL indicar horário de início e de término quando `endTime` está preenchido. O banner de destaque da home SHALL indicar o término na linha de informações. Eventos sem término (ou com término no mesmo dia) SHALL manter a exibição atual.

#### Scenario: Intervalo no mesmo mês
- **WHEN** um evento com `date` dia 1º/ago e `endDate` dia 3/ago aparece no `EventCard`
- **THEN** o bloco de data exibe "01–03" e "AGO"

#### Scenario: Intervalo cruzando meses
- **WHEN** um evento com `date` 31/jul e `endDate` 2/ago aparece no `EventCard`
- **THEN** o bloco de data exibe o início (31 JUL) e a linha de informações indica o término (até 02 ago)

#### Scenario: Evento de um dia inalterado
- **WHEN** um evento sem `endDate` aparece no `EventCard`
- **THEN** o bloco de data e a linha de horário mantêm o formato atual (dia único, horário de início)
