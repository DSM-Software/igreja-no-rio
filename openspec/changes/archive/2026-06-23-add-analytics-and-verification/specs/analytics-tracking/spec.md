## ADDED Requirements

### Requirement: Meta Pixel carregado em todas as rotas públicas
O sistema SHALL injetar o script do Meta Pixel (`fbevents.js`) no `<head>` de todas as rotas servidas pelo route group `(frontend)` quando a variável de ambiente `NEXT_PUBLIC_META_PIXEL_ID` (com fallback para `878835207994765`) for não-vazia.

#### Scenario: Pixel presente na home
- **WHEN** o usuário acessa `/`
- **THEN** o HTML retornado inclui um `<script>` cuja `src` contém `connect.facebook.net/en_US/fbevents.js` E uma chamada `fbq('init', '878835207994765')` no JS carregado

#### Scenario: Pixel presente em página interna
- **WHEN** o usuário acessa `/blog`, `/downloads`, `/contato`, `/agenda`, `/cultos`, `/quem-somos` ou `/privacidade`
- **THEN** o `fbevents.js` é carregado e `window.fbq` está disponível após a hidratação

#### Scenario: Pixel ausente quando ID vazio
- **WHEN** `NEXT_PUBLIC_META_PIXEL_ID` é uma string vazia
- **THEN** o HTML não contém nenhuma referência a `fbevents.js` e `window.fbq` é `undefined`

#### Scenario: Fallback noscript do Pixel
- **WHEN** o usuário acessa qualquer rota pública com JavaScript desabilitado
- **THEN** o HTML inclui um `<img>` para `https://www.facebook.com/tr?id=878835207994765&ev=PageView&noscript=1` com `height="1"` e `width="1"`

### Requirement: Meta Pixel dispara PageView em mudança de rota
O sistema SHALL disparar `fbq('track', 'PageView')` no primeiro carregamento de cada rota pública E sempre que o usuário navegar para outra rota via `next/link` (mudança de `pathname` ou `searchParams`).

#### Scenario: PageView no carregamento inicial
- **WHEN** o usuário abre `/` em uma aba nova
- **THEN** uma requisição é enviada para `https://www.facebook.com/tr/` com `ev=PageView` E `id=878835207994765`

#### Scenario: PageView em navegação client-side
- **WHEN** o usuário está em `/` e clica em um link interno para `/blog`
- **THEN** uma nova requisição para `https://www.facebook.com/tr/` com `ev=PageView` é enviada (sem full page reload)

#### Scenario: Sem duplicação no primeiro load
- **WHEN** o usuário abre `/` em uma aba nova
- **THEN** exatamente uma requisição `PageView` é enviada ao Meta (não duas)

### Requirement: Google Analytics 4 carregado em todas as rotas públicas
O sistema SHALL injetar o script `gtag.js` no `<head>` de todas as rotas servidas pelo route group `(frontend)` quando a variável `NEXT_PUBLIC_GA_MEASUREMENT_ID` (com fallback para `G-EX9WZW1607`) for não-vazia, e SHALL chamar `gtag('config', '<id>')` para configuração inicial.

#### Scenario: gtag.js presente na home
- **WHEN** o usuário acessa `/`
- **THEN** o HTML inclui um `<script>` cuja `src` contém `googletagmanager.com/gtag/js?id=G-EX9WZW1607`

#### Scenario: gtag config inicial
- **WHEN** o usuário acessa qualquer rota pública
- **THEN** após hidratação, `window.dataLayer` é um array E contém uma entrada de configuração para `G-EX9WZW1607`

#### Scenario: GA ausente quando ID vazio
- **WHEN** `NEXT_PUBLIC_GA_MEASUREMENT_ID` é uma string vazia
- **THEN** o HTML não contém nenhuma referência a `googletagmanager.com/gtag/js` e `window.dataLayer` é `undefined`

### Requirement: GA4 dispara page_view em mudança de rota
O sistema SHALL disparar um evento `page_view` no GA quando o usuário navegar para uma nova rota via App Router, usando o `pathname` atual como `page_path`.

#### Scenario: page_view em navegação client-side
- **WHEN** o usuário está em `/` e navega para `/blog` via `next/link`
- **THEN** `gtag('event', 'page_view', { page_path: '/blog' })` é chamado (verificável via `window.dataLayer` ou via interceptação de requisições para `google-analytics.com/g/collect`)

#### Scenario: page_view inclui query string quando relevante
- **WHEN** o usuário navega para `/blog?categoria=devocional`
- **THEN** o `page_path` registrado contém `categoria=devocional`

### Requirement: Analytics não carrega no admin Payload
O sistema SHALL NOT injetar Meta Pixel nem GA em nenhuma rota servida sob `/admin` ou pelo route group `(payload)`.

#### Scenario: Admin sem Pixel
- **WHEN** o usuário acessa `/admin` ou `/admin/login`
- **THEN** o HTML não contém referência a `fbevents.js` nem a `googletagmanager.com/gtag/js`
