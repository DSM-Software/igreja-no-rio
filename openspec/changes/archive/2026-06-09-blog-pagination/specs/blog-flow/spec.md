## MODIFIED Requirements

### Requirement: Listagem de posts exibe cards publicados
O sistema SHALL exibir cards de posts publicados na página `/blog`, com título, categoria, autor e data, em subconjuntos paginados de 12 itens por página.

#### Scenario: Cards visíveis quando há posts (com seed)
- **WHEN** o usuário acessa `/blog` e o banco tem posts publicados
- **THEN** pelo menos um `.post-card` é exibido com `.post-card-title` não vazio

#### Scenario: Máximo de 12 posts por página
- **WHEN** o usuário acessa `/blog` e há mais de 12 posts publicados
- **THEN** exatamente 12 `.post-card` são exibidos na primeira página

#### Scenario: Estado vazio quando não há posts
- **WHEN** o usuário acessa `/blog` e não há posts publicados
- **THEN** a página exibe a mensagem "Nenhum post encontrado"
