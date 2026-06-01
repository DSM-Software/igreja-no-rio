## MODIFIED Requirements

### Requirement: Downloads listados e agrupados por categoria
O sistema SHALL exibir os materiais de download agrupados em seções por categoria (Pregações, Estudos, Grupos Caseiros, Devocionais). Cada seção SHALL exibir inicialmente no máximo 6 itens, expandindo para todos ao clicar em "Ver mais". A página SHALL incluir uma barra de navegação sticky com âncoras para cada categoria disponível.

#### Scenario: Seções de categoria visíveis (com seed)
- **WHEN** o usuário acessa `/downloads` e o banco tem downloads cadastrados
- **THEN** pelo menos um `.download-card` é exibido, existe um heading `<h2>` com o nome de uma categoria, e a barra de navegação de categorias é visível

#### Scenario: Estado vazio
- **WHEN** o usuário acessa `/downloads` sem downloads no banco
- **THEN** a página exibe "Nenhum material disponível ainda" e a barra de navegação não é renderizada
