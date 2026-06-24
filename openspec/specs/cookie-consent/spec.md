## Purpose

Specifies the LGPD-compliant cookie consent gate for the public site. Defines when and how the consent banner is shown to first-time visitors, the three equally-prominent actions (accept all, reject all, customize), the granular category controls, and how the visitor's decision is persisted across routes and reloads. Also defines the consent record structure stored in `localStorage` and the client API that other modules (Meta Pixel, Google Analytics) consume to gate their behavior. Ensures the church respects visitor privacy by default and only activates analytics/marketing tracking after explicit, informed consent.

## Requirements

### Requirement: Banner de consentimento na primeira visita
O sistema SHALL exibir um banner de consentimento fixo na parte inferior da viewport para todo visitante público que não possua decisão de consentimento válida registrada em `localStorage` sob a chave `ir:consent:v1`.

#### Scenario: Banner visível na primeira visita
- **WHEN** um usuário acessa qualquer rota pública do route group `(frontend)` pela primeira vez (sem `ir:consent:v1` em `localStorage`)
- **THEN** após hidratação, um elemento `[data-testid="cookie-consent-banner"]` é visível com `position: fixed` no rodapé da viewport

#### Scenario: Banner ausente após decisão registrada
- **WHEN** o usuário tem em `localStorage` `ir:consent:v1` com `decidedAt` não-vazio E menos de 12 meses
- **THEN** o banner não é renderizado em nenhuma rota pública

#### Scenario: Banner não aparece no admin
- **WHEN** o usuário acessa `/admin` ou `/admin/login`
- **THEN** nenhum banner de consentimento é renderizado

#### Scenario: Banner reaparece após expirar
- **WHEN** `localStorage` contém `ir:consent:v1` com `decidedAt` há mais de 12 meses
- **THEN** o banner é renderizado novamente em qualquer rota pública

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

### Requirement: Aceitar todos concede consentimento para analytics e marketing
Ao clicar em "Aceitar todos", o sistema SHALL gravar em `localStorage` a chave `ir:consent:v1` com `categories.analytics = true` e `categories.marketing = true`, e SHALL fechar o banner.

#### Scenario: Após aceitar todos
- **WHEN** o usuário clica em "Aceitar todos" no banner
- **THEN** `localStorage.getItem('ir:consent:v1')` retorna um JSON com `categories.analytics === true` E `categories.marketing === true` E `decidedAt` é um ISO timestamp recente
- **AND** o banner desaparece da viewport

### Requirement: Rejeitar todos nega consentimento para analytics e marketing
Ao clicar em "Rejeitar todos", o sistema SHALL gravar em `localStorage` a chave `ir:consent:v1` com `categories.analytics = false` e `categories.marketing = false`, e SHALL fechar o banner.

#### Scenario: Após rejeitar todos
- **WHEN** o usuário clica em "Rejeitar todos" no banner
- **THEN** `localStorage.getItem('ir:consent:v1')` retorna um JSON com `categories.analytics === false` E `categories.marketing === false`
- **AND** o banner desaparece da viewport

### Requirement: Painel "Personalizar" permite escolha granular
Ao clicar em "Personalizar", o sistema SHALL expandir o banner para mostrar toggles individuais para `Essenciais` (sempre ligado e não modificável), `Analíticos` e `Marketing`, com um botão `Salvar preferências` que persiste a escolha.

#### Scenario: Painel mostra três categorias
- **WHEN** o usuário clica em "Personalizar"
- **THEN** três controles de toggle ficam visíveis, rotulados respectivamente "Essenciais", "Analíticos" e "Marketing"
- **AND** o toggle "Essenciais" está desabilitado (não modificável) e marcado como ativo

#### Scenario: Salvar com analytics ativo e marketing inativo
- **WHEN** o usuário marca apenas "Analíticos" no painel "Personalizar" e clica em "Salvar preferências"
- **THEN** `localStorage.getItem('ir:consent:v1')` retorna `categories.analytics === true` E `categories.marketing === false`

### Requirement: Persistência cross-rota e cross-reload
A decisão de consentimento SHALL persistir entre navegações no App Router e entre reloads de página enquanto a entrada em `localStorage` for válida.

#### Scenario: Decisão persiste entre rotas
- **WHEN** o usuário aceita todos na home e navega para `/blog` via `next/link`
- **THEN** o banner não reaparece em `/blog`

#### Scenario: Decisão persiste entre reloads
- **WHEN** o usuário aceita todos e dá reload na página
- **THEN** o banner não reaparece após o reload

### Requirement: Revogação de consentimento via página de privacidade
A página `/privacidade` SHALL conter uma seção e um botão visível com texto contendo "Gerenciar preferências" (ou equivalente) que, ao ser clicado, SHALL apagar a decisão atual e reabrir o banner em modo "Personalizar".

#### Scenario: Botão presente em /privacidade
- **WHEN** o usuário acessa `/privacidade`
- **THEN** existe um botão ou link cujo texto (case-insensitive) contém "gerenciar preferências"

#### Scenario: Clique reabre o painel de personalização
- **WHEN** o usuário tem decisão registrada E clica em "Gerenciar preferências de cookies" em `/privacidade`
- **THEN** o banner reaparece com o painel "Personalizar" expandido
- **AND** `localStorage.getItem('ir:consent:v1')` é `null` (ou foi removido)

### Requirement: Estrutura do registro de consentimento
A entrada `ir:consent:v1` em `localStorage` SHALL ser um JSON contendo os campos `version` (number, atualmente `1`), `decidedAt` (ISO 8601 string), e `categories` (objeto com booleanos `analytics` e `marketing`).

#### Scenario: Campos obrigatórios
- **WHEN** o usuário registra qualquer decisão
- **THEN** o JSON em `localStorage.getItem('ir:consent:v1')` contém `version === 1` E `decidedAt` parseável como ISO 8601 E `categories.analytics` é boolean E `categories.marketing` é boolean

### Requirement: API client de consentimento
O sistema SHALL expor funções puras em `src/lib/consent.ts` para ler, escrever e observar o estado de consentimento, com comportamento SSR-safe (sem erro quando `window` é indefinido).

#### Scenario: readConsent retorna null no servidor
- **WHEN** `readConsent()` é chamado em ambiente sem `window` (SSR)
- **THEN** retorna `null` sem lançar exceção

#### Scenario: subscribeConsent notifica mudanças
- **WHEN** um consumidor registra um callback via `subscribeConsent(cb)` E `writeConsent(...)` é chamado depois
- **THEN** o callback é invocado com o novo estado
