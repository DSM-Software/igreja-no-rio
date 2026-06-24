# site-search

## Purpose

Define a busca global pública do site da Igreja no Rio: o gatilho no header, o overlay modal acessível, o endpoint `GET /api/search`, a página dedicada `/busca?q=...`, e o contrato de dados que cobre posts publicados (Devocional, Estudo) e eventos. Estabelece UX (posicionamento, atalhos de teclado, agrupamento de resultados, estados vazios/erro), acessibilidade (ARIA combobox/listbox, navegação por teclado, live region) e ordenação por similaridade trigram em PT-BR.

## Requirements

### Requirement: Gatilho de busca disponível no header em todas as rotas públicas

O sistema SHALL exibir um gatilho de busca acessível por mouse e teclado no header de todas as rotas públicas, em viewports desktop e mobile, com `aria-label` "Buscar" e ícone de lupa do conjunto `material-symbols`.

#### Scenario: Gatilho visível no desktop

- **WHEN** o usuário acessa qualquer rota pública em viewport ≥ 1024px (`/`, `/blog`, `/agenda`, `/quem-somos`, etc.)
- **THEN** existe no header um botão com `aria-label="Buscar"` exibindo ícone de lupa, posicionado entre o último item de navegação e o botão "Fale conosco"

#### Scenario: Gatilho visível no mobile

- **WHEN** o usuário acessa qualquer rota pública em viewport < 1024px
- **THEN** existe no header um botão com `aria-label="Buscar"` exibindo ícone de lupa, posicionado ao lado do botão de menu (e não dentro do menu sanduíche)

#### Scenario: Gatilho não some na home antes do scroll

- **WHEN** o usuário acessa `/` com o header em estado transparente (sem rolar)
- **THEN** o gatilho de busca permanece visível e legível, com contraste suficiente contra o hero escuro

### Requirement: Overlay de busca abre e fecha com mouse e teclado

O sistema SHALL abrir um overlay modal de busca ao clicar no gatilho, pressionar `Ctrl+K` / `⌘+K`, ou pressionar `/` em desktop, e SHALL fechá-lo ao pressionar `Esc`, clicar fora ou clicar no botão de fechar. Enquanto aberto, o foco SHALL ficar preso dentro do overlay, e o scroll do body SHALL ficar bloqueado.

#### Scenario: Abrir pelo clique no gatilho

- **WHEN** o usuário clica no botão de busca do header
- **THEN** um elemento com `role="dialog"` e `aria-modal="true"` aparece, o input recebe foco automaticamente, e o body recebe estilo de scroll bloqueado

#### Scenario: Abrir pelo atalho `/` em desktop

- **WHEN** o usuário em viewport ≥ 1024px pressiona `/` fora de qualquer campo editável (`input`, `textarea`, `[contenteditable]`)
- **THEN** o overlay abre e o input de busca recebe foco

#### Scenario: Abrir pelo atalho `Ctrl+K` / `⌘+K`

- **WHEN** o usuário pressiona `Ctrl+K` (Windows/Linux) ou `⌘+K` (macOS) em qualquer viewport
- **THEN** o overlay abre e o input de busca recebe foco, mesmo que o foco esteja dentro de um campo editável

#### Scenario: Atalho `/` ignorado dentro de campos editáveis

- **WHEN** o usuário pressiona `/` enquanto digita em um `input`, `textarea` ou `[contenteditable]`
- **THEN** o overlay NÃO abre e a tecla é tratada normalmente pelo campo

#### Scenario: Fechar com `Esc`

- **WHEN** o overlay está aberto e o usuário pressiona `Esc`
- **THEN** o overlay fecha, o foco retorna ao gatilho que o abriu, e o scroll do body é restaurado

#### Scenario: Fechar clicando fora

- **WHEN** o overlay está aberto e o usuário clica em uma área externa ao painel de busca
- **THEN** o overlay fecha

### Requirement: Input executa busca com debounce e cancelamento de requisições obsoletas

O sistema SHALL executar a busca após 250ms sem novas teclas digitadas, SHALL cancelar requisições anteriores ainda em voo quando uma nova é disparada, e SHALL ignorar consultas com menos de 2 caracteres não-espaço.

#### Scenario: Debounce de 250ms

- **WHEN** o usuário digita "or", "ora", "oração" em sequência rápida (< 250ms entre teclas)
- **THEN** apenas uma requisição `GET /api/search` é disparada, com `q=oração`, após 250ms de inatividade

#### Scenario: Query muito curta não dispara busca

- **WHEN** o usuário digita "a" no input
- **THEN** nenhuma requisição é disparada e o overlay exibe a dica "Digite ao menos 2 letras"

#### Scenario: Requisição anterior é cancelada

- **WHEN** o usuário digita "ora", espera o request começar, e antes da resposta digita mais letras formando "oracao"
- **THEN** a requisição anterior é abortada (sem race-condition de renderização) e os resultados exibidos correspondem ao último termo digitado

### Requirement: Endpoint `GET /api/search` retorna posts e eventos agrupados

O sistema SHALL expor o endpoint público `GET /api/search?q=<termo>&limit=<n>&offset=<n>&type=<posts|events|all>` que SHALL retornar JSON `{ posts: SearchHit[], events: SearchHit[], total: number }`, com top-N por tipo, cabeçalho `Cache-Control: public, max-age=60, stale-while-revalidate=300`, e SHALL truncar `q` para no máximo 80 caracteres antes de qualquer operação no banco para limitar custo de CPU em buscas trigram.

#### Scenario: Resposta bem formada

- **WHEN** uma requisição é feita para `GET /api/search?q=batismo`
- **THEN** o status é 200, o cabeçalho `Cache-Control` está presente conforme acima, e o corpo contém `posts`, `events` e `total` como números/arrays

#### Scenario: Query insuficiente retorna 200 vazio

- **WHEN** uma requisição é feita para `GET /api/search?q=a` (1 caractere)
- **THEN** o status é 200 e o corpo é `{ posts: [], events: [], total: 0 }`

#### Scenario: Filtro por tipo

- **WHEN** uma requisição é feita para `GET /api/search?q=culto&type=events`
- **THEN** o array `posts` está vazio e o array `events` contém somente eventos correspondentes

#### Scenario: Limites default

- **WHEN** uma requisição é feita para `GET /api/search?q=igreja` sem `limit`
- **THEN** cada array (`posts`, `events`) retorna no máximo 5 hits

#### Scenario: Posts não publicados ficam fora

- **WHEN** existe um post com `published: false` cujo título casa o termo de busca
- **THEN** ele NÃO aparece em `posts` na resposta

#### Scenario: Query gigante é truncada sem 500

- **WHEN** uma requisição chega com `q` de 2.000 caracteres
- **THEN** o status é 200, o servidor trunca para 80 caracteres antes de executar a query trigram, e responde no tempo normal

### Requirement: Resultados são exibidos agrupados por tipo, com contexto e snippet

O sistema SHALL exibir os resultados no overlay agrupados em duas seções rotuladas: "Posts" e "Eventos". Cada hit SHALL exibir título, contexto secundário (categoria/série para posts; data formatada e local para eventos) e um snippet de até 2 linhas com o trecho do texto que casa o termo.

#### Scenario: Seções com rótulo

- **WHEN** o overlay exibe resultados para uma busca que casa em ambos os tipos
- **THEN** existe um cabeçalho "Posts" antes dos posts e um cabeçalho "Eventos" antes dos eventos

#### Scenario: Hit de post mostra contexto

- **WHEN** o overlay exibe um post no resultado
- **THEN** o hit exibe o título do post, a categoria (Devocional ou Estudo) e, se existir, o nome da série

#### Scenario: Hit de evento mostra contexto

- **WHEN** o overlay exibe um evento no resultado
- **THEN** o hit exibe título, data formatada em PT-BR ("DD de mês de AAAA") e o `location`

#### Scenario: Snippet visível para match no corpo

- **WHEN** o termo de busca casa o corpo do post (não o título)
- **THEN** o hit exibe um snippet de 1–2 linhas com texto ao redor do match e marcadores "…" antes/depois quando truncado

#### Scenario: Seção omitida quando vazia

- **WHEN** a busca retorna posts mas não retorna eventos
- **THEN** o cabeçalho "Eventos" e seu container não são renderizados

### Requirement: Navegação por teclado entre resultados

O sistema SHALL permitir que o usuário navegue pelos resultados usando setas `↑` e `↓`, abra o hit selecionado com `Enter`, e SHALL manter o atributo `aria-activedescendant` no input apontando para o hit atualmente destacado.

#### Scenario: Seta para baixo seleciona próximo hit

- **WHEN** o overlay tem resultados e o usuário pressiona `↓`
- **THEN** o primeiro hit é destacado visualmente, `aria-activedescendant` do input aponta para o `id` do hit, e a janela do overlay rola para mantê-lo visível

#### Scenario: Enter abre o hit selecionado

- **WHEN** um hit está destacado via teclado e o usuário pressiona `Enter`
- **THEN** o navegador navega para a URL do hit (`/blog/<slug>` para posts ou `/agenda` para eventos)

#### Scenario: Setas envolvem nos extremos

- **WHEN** o último hit está destacado e o usuário pressiona `↓`
- **THEN** o destaque volta ao primeiro hit (comportamento circular)

### Requirement: Estados explícitos de carregando, vazio, sem resultados e erro

O sistema SHALL exibir mensagens distintas para os estados "consulta curta", "carregando", "sem resultados" e "erro", e SHALL anunciar mudanças de estado para tecnologias assistivas via `aria-live="polite"`.

#### Scenario: Estado inicial (consulta vazia ou curta)

- **WHEN** o overlay abre e o input está vazio (ou com menos de 2 caracteres)
- **THEN** o painel exibe a dica "Digite ao menos 2 letras para buscar"

#### Scenario: Estado carregando

- **WHEN** a requisição está em voo
- **THEN** um indicador de carregamento é visível e a região `aria-live` anuncia "Carregando resultados"

#### Scenario: Estado sem resultados

- **WHEN** a resposta retorna `total: 0`
- **THEN** o painel exibe "Nada encontrado para '<termo>'", com links para `/blog` e `/agenda`, e a região `aria-live` anuncia "Nenhum resultado"

#### Scenario: Estado de erro

- **WHEN** a requisição falha (erro de rede ou status ≥ 500)
- **THEN** o painel exibe "Não foi possível buscar agora. Tente novamente." e um botão "Tentar novamente"

### Requirement: Página dedicada `/busca?q=...` exibe todos os resultados com paginação

O sistema SHALL expor a rota pública `/busca`, que SHALL exibir resultados paginados (20 por página) a partir do parâmetro `q`, com seções "Posts" e "Eventos", contagem total por seção, e SHALL marcar a página como `noindex, follow` para crawlers.

#### Scenario: Rota carrega com `q` válido

- **WHEN** o usuário acessa `/busca?q=igreja`
- **THEN** a página retorna status 200, exibe o título "Resultados para 'igreja'" e lista posts e eventos correspondentes

#### Scenario: Rota carrega sem `q`

- **WHEN** o usuário acessa `/busca` sem parâmetro `q`
- **THEN** a página retorna status 200 e exibe uma mensagem orientando a digitar um termo, com o campo de busca em destaque

#### Scenario: Paginação

- **WHEN** uma busca retorna mais de 20 posts
- **THEN** a página exibe o primeiro lote de 20 e uma navegação de páginas que mantém o parâmetro `q`

#### Scenario: Página não é indexada

- **WHEN** um crawler acessa `/busca?q=qualquercoisa`
- **THEN** a resposta contém `<meta name="robots" content="noindex, follow">`

#### Scenario: Link "Ver todos os resultados" do overlay leva à página

- **WHEN** o overlay tem resultados e o usuário clica em "Ver todos os resultados de '<termo>'"
- **THEN** o navegador navega para `/busca?q=<termo>` e o overlay fecha

### Requirement: Busca é insensível a caixa e acentuação, com matches parciais

O sistema SHALL retornar os mesmos resultados independentemente de maiúsculas/minúsculas e da presença ou ausência de acentos no termo de busca, e SHALL casar substrings dentro de palavras (ex.: "orac" casa "oração").

#### Scenario: Insensibilidade a caixa

- **WHEN** existem dois posts com "Oração" no título e o usuário busca por "oração" e por "ORAÇÃO"
- **THEN** ambas as buscas retornam o mesmo conjunto de resultados

#### Scenario: Insensibilidade a acento

- **WHEN** existe um post com "oração" no título e o usuário busca por "oracao"
- **THEN** o post é retornado

#### Scenario: Match parcial

- **WHEN** existe um post com "oração" no corpo e o usuário busca por "orac"
- **THEN** o post é retornado e o hit exibe um snippet contendo "oração"

### Requirement: Ordenação dos resultados

O sistema SHALL ordenar os hits por relevância (similaridade do termo) como critério primário; SHALL usar `date desc` como desempate para posts; e SHALL usar `date asc` (futuros primeiro, depois passados) como desempate para eventos pontuais, mantendo eventos recorrentes ao topo do grupo de eventos.

#### Scenario: Desempate por data nos posts

- **WHEN** dois posts têm a mesma similaridade para o termo buscado
- **THEN** o post com `date` mais recente aparece antes

#### Scenario: Eventos recorrentes ao topo

- **WHEN** a busca casa um evento recorrente (`recurring` preenchido) e um evento pontual com mesma similaridade
- **THEN** o evento recorrente aparece antes do pontual no grupo "Eventos"

### Requirement: Cobertura E2E da busca

O sistema SHALL ter uma suíte Playwright em `tests/e2e/site-search.spec.ts` que cobre os fluxos críticos do recurso.

#### Scenario: Suíte cobre fluxos chave

- **WHEN** a suíte `tests/e2e/site-search.spec.ts` é executada com seed padrão
- **THEN** os seguintes fluxos passam: (a) gatilho visível no header em desktop e mobile; (b) atalho `/` abre overlay; (c) atalho `Ctrl/⌘+K` abre overlay; (d) digitar 2+ letras dispara busca e exibe agrupamento; (e) navegação por setas + Enter abre o hit; (f) estado "sem resultados" aparece para termo improvável; (g) página `/busca?q=...` carrega com `noindex`; (h) post `published: false` no seed não aparece nos resultados; (i) `q` de 2.000 caracteres retorna 200 sem sobrecarregar o servidor
