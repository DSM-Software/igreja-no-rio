## Purpose

Specifies the authentication and access control behavior for the Payload CMS admin panel, ensuring unauthenticated users are redirected to login and that the login form works correctly with valid and invalid credentials.

## Requirements

### Requirement: Acesso ao admin sem autenticação redireciona para login
O sistema SHALL redirecionar usuários não autenticados que tentam acessar `/admin` para a tela de login do Payload.

#### Scenario: Redirect para login
- **WHEN** o usuário acessa `/admin` sem estar autenticado
- **THEN** a URL final é `/admin/login` (ou contém `login`) e o formulário de login é exibido

### Requirement: Formulário de login do Payload está funcional
O sistema SHALL exibir o formulário de login com campos de e-mail e senha e botão de submit.

#### Scenario: Campos de login presentes
- **WHEN** o usuário acessa `/admin/login`
- **THEN** existem um `input[name="email"]` ou `input[type="email"]` e um `input[type="password"]` na página

#### Scenario: Botão de submit presente
- **WHEN** o usuário acessa `/admin/login`
- **THEN** existe um `button[type="submit"]` ou botão com texto "Entrar" / "Login"

### Requirement: Login com credenciais válidas autentica o usuário
O sistema SHALL aceitar e-mail e senha do usuário admin e redirecionar para o dashboard do Payload.

#### Scenario: Login bem-sucedido
- **WHEN** o usuário preenche e-mail e senha corretos e submete o formulário
- **THEN** a URL muda para `/admin` (dashboard) e o título da página contém "Dashboard" ou "Payload"

### Requirement: Login com credenciais inválidas exibe erro
O sistema SHALL exibir mensagem de erro quando as credenciais fornecidas são incorretas.

#### Scenario: Credenciais inválidas exibem erro
- **WHEN** o usuário preenche e-mail e senha incorretos e submete o formulário
- **THEN** uma mensagem de erro é exibida na página (texto contendo "inválid" ou "incorret" ou "não encontr")

### Requirement: Campo Corpo do post visível e editável para todos os papéis autorizados
O sistema SHALL exibir e permitir edição do campo `body` (Corpo do post) no formulário de criação e no formulário de edição de posts em `/admin` para todos os usuários autenticados com papel `admin`, `editor` ou `autor`, independentemente do papel.

#### Scenario: Admin vê o campo Corpo do post ao criar
- **WHEN** o usuário `admin` autenticado acessa `/admin/collections/posts/create`
- **THEN** a página exibe o label "Corpo do post" e a área de edição richText (Lexical) está visível e editável

#### Scenario: Editor vê o campo Corpo do post ao criar
- **WHEN** o usuário `editor` autenticado acessa `/admin/collections/posts/create`
- **THEN** a página exibe o label "Corpo do post" e a área de edição richText (Lexical) está visível e editável

#### Scenario: Autor vê o campo Corpo do post ao criar
- **WHEN** o usuário `autor` autenticado acessa `/admin/collections/posts/create`
- **THEN** a página exibe o label "Corpo do post" e a área de edição richText (Lexical) está visível e editável

#### Scenario: Autor vê e edita Corpo do post em post próprio
- **WHEN** o usuário `autor` autenticado acessa `/admin/collections/posts/<id>` de um post de sua propriedade
- **THEN** a página exibe o label "Corpo do post" com conteúdo carregado e a área richText permanece editável

### Requirement: Todos os campos editáveis de Posts são visíveis para papéis autorizados
O sistema SHALL exibir, no formulário do admin (criação e edição), todos os campos editáveis de `Posts` (`title`, `slug`, `category`, `serie`, `serieParte`, `author`, `date`, `coverImage`, `coverColor`, `excerpt`, `body`, `tags`, `published`) para qualquer usuário com papel `admin`, `editor` ou `autor`.

#### Scenario: Campos principais visíveis no create para admin/editor/autor
- **WHEN** um usuário com qualquer um dos papéis (`admin`, `editor`, `autor`) acessa `/admin/collections/posts/create`
- **THEN** estão visíveis os campos com labels "Título" (`title`), "Categoria" (`category`), "Autor" (`author`), "Data" (`date`), "Resumo (chamada)" (`excerpt`), "Corpo do post" (`body`) e o checkbox "Publicado" (`published`)

#### Scenario: Nenhum campo editável de Posts é renderizado como somente leitura para autor
- **WHEN** o usuário `autor` autenticado acessa `/admin/collections/posts/create` ou um post próprio em `/admin/collections/posts/<id>`
- **THEN** nenhum dos campos editáveis listados acima exibe estado "readOnly" e seus inputs aceitam digitação

### Requirement: Campo body declara acesso explícito por papel
O sistema SHALL declarar explicitamente, no nível de campo (`field.access`), permissão de leitura, atualização e criação para `admin`, `editor` e `autor` no campo `body` de `Posts`, evitando depender apenas do acesso da coleção.

#### Scenario: Helper de acesso a campos de Posts aplicado
- **WHEN** o desenvolvedor inspeciona `src/collections/Posts.ts`
- **THEN** o campo `body` possui um objeto `access: { read, update, create }` que retorna verdadeiro para usuários autenticados com papel `admin`, `editor` ou `autor`

#### Scenario: Helper compartilhado existe
- **WHEN** o desenvolvedor inspeciona `src/access/contentAccess.ts`
- **THEN** existe e é exportado um helper (por exemplo `canEditPostsField`) que centraliza a lógica de acesso por campo aos campos editáveis de `Posts`
