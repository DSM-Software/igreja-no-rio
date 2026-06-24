## MODIFIED Requirements

### Requirement: Três ações com igual proeminência
O banner SHALL oferecer três ações visíveis simultaneamente — `Aceitar todos`, `Rejeitar todos`, `Personalizar` — com tamanho de fonte, padding e contraste equivalentes, sem dark pattern que favoreça aceitação. O rótulo de cada botão de ação SHALL permanecer em uma única linha (sem quebra de texto) na disposição horizontal do desktop.

#### Scenario: Três botões presentes
- **WHEN** o banner está visível
- **THEN** existem três elementos clicáveis com os textos (case-insensitive) "Aceitar todos", "Rejeitar todos" e "Personalizar"

#### Scenario: Rejeitar tem o mesmo destaque visual de Aceitar
- **WHEN** o banner está visível
- **THEN** os botões "Aceitar todos" e "Rejeitar todos" têm a mesma altura computada (`getBoundingClientRect().height`) E o mesmo `font-size`

#### Scenario: Texto das ações em linha única no desktop
- **WHEN** o banner está visível em uma viewport de desktop (largura ≥ 1024px)
- **THEN** os botões "Aceitar todos" e "Rejeitar todos" renderizam seu texto em uma única linha (cada um com `getClientRects().length === 1`, sem wrap)
