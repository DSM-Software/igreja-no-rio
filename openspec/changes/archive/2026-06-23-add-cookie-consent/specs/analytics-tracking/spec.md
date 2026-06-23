## MODIFIED Requirements

### Requirement: Meta Pixel carregado em todas as rotas públicas
O sistema SHALL injetar o script do Meta Pixel (`fbevents.js`) no `<head>` de todas as rotas servidas pelo route group `(frontend)` quando **ambas** as condições forem verdadeiras: a variável de ambiente `NEXT_PUBLIC_META_PIXEL_ID` (com fallback para `878835207994765`) for não-vazia E o usuário tiver consentido explicitamente a categoria `marketing` (`localStorage.ir:consent:v1.categories.marketing === true`). Sem consentimento, o script NÃO SHALL ser injetado.

#### Scenario: Pixel presente após consentimento
- **WHEN** o usuário acessa `/` E `localStorage` contém `ir:consent:v1` com `categories.marketing === true`
- **THEN** o HTML inclui um `<script>` cuja `src` contém `connect.facebook.net/en_US/fbevents.js` E uma chamada `fbq('init', '878835207994765')`

#### Scenario: Pixel ausente sem consentimento
- **WHEN** o usuário acessa `/` sem decisão registrada (banner ainda visível) OU com `categories.marketing === false`
- **THEN** o HTML não contém referência a `fbevents.js` E `window.fbq` é `undefined`

#### Scenario: Pixel ausente quando ID vazio
- **WHEN** `NEXT_PUBLIC_META_PIXEL_ID` é uma string vazia (independente do consentimento)
- **THEN** o HTML não contém nenhuma referência a `fbevents.js` E `window.fbq` é `undefined`

#### Scenario: Sem fallback noscript do Pixel
- **WHEN** o usuário acessa qualquer rota pública (com ou sem consentimento)
- **THEN** o HTML não contém `<noscript>` apontando para `facebook.com/tr` — o fallback noscript foi removido porque o gate de consentimento exige JavaScript, tornando o noscript inútil em ambos os cenários (sem JS o Pixel não carrega de qualquer forma)

### Requirement: Meta Pixel dispara PageView em mudança de rota
O sistema SHALL disparar `fbq('track', 'PageView')` no primeiro carregamento de cada rota pública E sempre que o usuário navegar para outra rota via `next/link` (mudança de `pathname` ou `searchParams`), desde que o consentimento `marketing` esteja ativo. Quando o consentimento for revogado, novos PageViews NÃO SHALL ser disparados.

#### Scenario: PageView no carregamento inicial após consentimento
- **WHEN** o usuário consente `marketing` e acessa `/` em uma aba nova
- **THEN** uma requisição é enviada para `https://www.facebook.com/tr/` com `ev=PageView` E `id=878835207994765`

#### Scenario: PageView em navegação client-side
- **WHEN** o usuário consentiu `marketing`, está em `/` e clica em um link interno para `/blog`
- **THEN** uma nova requisição para `https://www.facebook.com/tr/` com `ev=PageView` é enviada (sem full page reload)

#### Scenario: Nenhum PageView antes de decidir
- **WHEN** o usuário acessa `/` sem decisão registrada
- **THEN** nenhuma requisição para `facebook.com/tr/` é feita

#### Scenario: Nenhum PageView após rejeitar
- **WHEN** o usuário rejeita `marketing` e navega para `/blog`
- **THEN** nenhuma requisição para `facebook.com/tr/` é feita

### Requirement: Google Analytics 4 carregado em todas as rotas públicas
O sistema SHALL injetar o script `gtag.js` no `<head>` de todas as rotas servidas pelo route group `(frontend)` quando `NEXT_PUBLIC_GA_MEASUREMENT_ID` (com fallback para `G-EX9WZW1607`) for não-vazia, E SHALL inicializar o Google Consent Mode v2 com `analytics_storage: 'denied'`, `ad_storage: 'denied'`, `ad_user_data: 'denied'` e `ad_personalization: 'denied'` como default, ANTES de qualquer chamada a `gtag('config', ...)`. Após consentimento `analytics`, o sistema SHALL emitir `gtag('consent', 'update', { analytics_storage: 'granted' })`.

#### Scenario: gtag.js presente na home
- **WHEN** o usuário acessa `/` E `NEXT_PUBLIC_GA_MEASUREMENT_ID` não é vazia
- **THEN** o HTML inclui um `<script>` cuja `src` contém `googletagmanager.com/gtag/js?id=G-EX9WZW1607`

#### Scenario: Consent default = denied no dataLayer
- **WHEN** o usuário acessa qualquer rota pública E nenhuma decisão foi registrada
- **THEN** `window.dataLayer` contém uma entrada `['consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }]` (ou equivalente) antes da entrada de `config`

#### Scenario: Consent update após aceitar analytics
- **WHEN** o usuário consente `analytics` (via "Aceitar todos" ou painel "Personalizar")
- **THEN** uma entrada `['consent', 'update', { analytics_storage: 'granted' }]` é empurrada para `window.dataLayer`

#### Scenario: GA ausente quando ID vazio
- **WHEN** `NEXT_PUBLIC_GA_MEASUREMENT_ID` é uma string vazia
- **THEN** o HTML não contém nenhuma referência a `googletagmanager.com/gtag/js`

### Requirement: GA4 dispara page_view em mudança de rota
O sistema SHALL disparar um evento `page_view` no GA quando o usuário navegar para uma nova rota via App Router, usando o `pathname` atual como `page_path`. Quando o consentimento `analytics` estiver negado, o evento ainda pode ser empurrado para o `dataLayer` (Consent Mode encarregará-se de não transmitir), mas o sistema NÃO SHALL emitir hits identificadores ao endpoint `google-analytics.com/g/collect` sem consentimento — o próprio Consent Mode garante isso.

#### Scenario: page_view em navegação client-side com consent
- **WHEN** o usuário consente `analytics`, está em `/` e navega para `/blog` via `next/link`
- **THEN** uma requisição é enviada para `google-analytics.com/g/collect` com `tid=G-EX9WZW1607` E `en=page_view` E `dl` contendo `/blog`

#### Scenario: Sem hit a g/collect quando rejeitado
- **WHEN** o usuário rejeita `analytics` e navega para `/blog`
- **THEN** nenhuma requisição para `google-analytics.com/g/collect` é feita (Consent Mode bloqueia o transporte; somente requisições agregadas sem cookies — se houver — podem sair)

### Requirement: Analytics não carrega no admin Payload
O sistema SHALL NOT injetar Meta Pixel nem GA em nenhuma rota servida sob `/admin` ou pelo route group `(payload)`, independentemente do estado de consentimento.

#### Scenario: Admin sem Pixel
- **WHEN** o usuário acessa `/admin` ou `/admin/login`
- **THEN** o HTML não contém referência a `fbevents.js` nem a `googletagmanager.com/gtag/js`
