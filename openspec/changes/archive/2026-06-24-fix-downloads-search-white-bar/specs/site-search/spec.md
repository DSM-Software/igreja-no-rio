## ADDED Requirements

### Requirement: Backdrop do overlay cobre toda a viewport acima de qualquer chrome de página

O sistema SHALL renderizar o backdrop do overlay de busca cobrindo toda a viewport e em uma camada de empilhamento (`z-index`) acima de **todo** o chrome de página, incluindo o header e quaisquer elementos `position: sticky`/posicionados elevados (por exemplo, a navegação de categorias da página `/downloads`). Nenhum elemento de página SHALL permanecer visível como faixa sólida sobre o backdrop enquanto o overlay estiver aberto, em viewports desktop e mobile.

#### Scenario: Overlay aberto sobre a página de downloads não deixa a nav de categorias visível

- **WHEN** o usuário está em `/downloads` (com a navegação de categorias renderizada) e abre o overlay de busca, em viewport desktop ou mobile
- **THEN** o backdrop desfocado/escurecido cobre toda a viewport e a barra de navegação de categorias NÃO permanece visível como faixa branca sobre o backdrop

#### Scenario: Overlay fica acima de chrome de página com z-index elevado

- **WHEN** uma rota pública renderiza um elemento de chrome `sticky`/posicionado com `z-index` próprio (como a nav de categorias) e o overlay de busca é aberto
- **THEN** o backdrop e o painel do overlay são pintados acima desse elemento, dominando-o visualmente
