## ADDED Requirements

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
