# events-admin-form (delta)

## ADDED Requirements

### Requirement: Formulário de eventos com labels e descrições em português
O sistema SHALL exibir todos os campos da collection `Events` no admin com `label` em português correto (ex.: "Título", "Data de início", "Horário", "Local") e descrições de apoio em português onde houver convenção não-óbvia (formato de horário, critério do destaque).

#### Scenario: Campos com labels em português
- **WHEN** um editor abre a tela de criação de evento no admin
- **THEN** nenhum campo aparece com label em inglês gerado automaticamente (Title, Date, Time, Location)

### Requirement: Horário validado no formato HH:MM
O sistema SHALL validar os campos `time` e `endTime` contra o formato 24h `HH:MM` (00:00–23:59) e SHALL rejeitar valores fora do formato com mensagem em português. Registros existentes fora do formato SHALL continuar sendo exibidos no site sem migração de dados.

#### Scenario: Horário inválido rejeitado
- **WHEN** um editor tenta salvar um evento com `time` = "19h" ou "sete horas"
- **THEN** o Payload rejeita o save com mensagem orientando o formato (ex.: "19:00")

#### Scenario: Horário válido aceito
- **WHEN** um editor salva um evento com `time` = "08:00"
- **THEN** o save é aceito

### Requirement: Campos de término condicionais ao checkbox multi-dia
O sistema SHALL exibir os campos `endDate` e `endTime` no formulário apenas quando o checkbox `isMultiDay` ("Evento de mais de um dia?") está marcado.

#### Scenario: Formulário limpo para evento de um dia
- **WHEN** um editor abre a criação de evento sem marcar `isMultiDay`
- **THEN** os campos de término não são exibidos

#### Scenario: Campos de término revelados
- **WHEN** um editor marca `isMultiDay`
- **THEN** os campos "Data de término" e "Horário de término" aparecem no formulário

### Requirement: Layout do formulário agrupa data e horário
O sistema SHALL apresentar `date` e `time` lado a lado numa mesma linha do formulário, e `endDate` e `endTime` lado a lado quando visíveis.

#### Scenario: Data e horário na mesma linha
- **WHEN** um editor abre o formulário de evento em viewport desktop
- **THEN** "Data de início" e "Horário" aparecem lado a lado

### Requirement: Listagem de eventos exibe o local
O sistema SHALL incluir a coluna `location` nas colunas padrão da listagem de `Events` no admin.

#### Scenario: Coluna de local visível
- **WHEN** um editor abre a listagem de eventos no admin
- **THEN** a coluna "Local" aparece entre as colunas padrão
