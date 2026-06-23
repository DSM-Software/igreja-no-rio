# youtube-highlight

## Purpose

Dar visibilidade ao canal do YouTube da igreja, convidando visitantes a assistir e se inscrever, com entradas consistentes na homepage e na página de Contato a partir de uma URL centralizada.

## Requirements

### Requirement: Destaque do canal do YouTube na homepage

A homepage (`/`) SHALL exibir uma seção de destaque convidando o visitante a assistir e se inscrever no canal do YouTube da igreja. A seção MUST conter um link para `https://www.youtube.com/@IgrejanoRio7` que abre em nova aba (`target="_blank"`) e usa `rel="noopener noreferrer"`. A seção MUST seguir os tokens de design Tailwind do projeto (sem novos blocos em `globals.css`) e o ícone `mdi:youtube` via `@iconify/react`.

#### Scenario: Visitante vê o destaque do YouTube na home

- **WHEN** o visitante carrega a homepage `/`
- **THEN** uma seção de destaque do canal do YouTube está visível
- **AND** ela contém um link cujo `href` é `https://www.youtube.com/@IgrejanoRio7`
- **AND** o link possui `target="_blank"` e `rel` contendo `noopener`

#### Scenario: A home continua renderizando sem erros

- **WHEN** o visitante carrega a homepage `/`
- **THEN** a resposta HTTP é bem-sucedida (`response.ok()`)
- **AND** as seções existentes (eventos, blog, downloads, CTA final) continuam visíveis

### Requirement: Entrada do YouTube na página de Contato

A página `/contato` SHALL apresentar o canal do YouTube como um ponto de contato. O canal MUST aparecer na lista "Informações" como um item com ícone (`mdi:youtube`) e título "YouTube", e também entre os botões da seção "Canais de contato". Todos os links para o canal MUST apontar para `https://www.youtube.com/@IgrejanoRio7`, abrir em nova aba e usar `rel="noopener noreferrer"`.

#### Scenario: Visitante encontra o canal do YouTube no Contato

- **WHEN** o visitante carrega a página `/contato`
- **THEN** existe um item "YouTube" na lista de informações com link para `https://www.youtube.com/@IgrejanoRio7`
- **AND** existe um botão de canal de contato que leva ao mesmo endereço
- **AND** os links do YouTube possuem `target="_blank"` e `rel` contendo `noopener`

### Requirement: URL do canal centralizada

A URL do canal do YouTube SHALL ser definida em um único local reutilizável e consumida pela homepage e pela página de Contato, evitando divergência de endereço entre as duas entradas.

#### Scenario: As duas entradas apontam para a mesma URL

- **WHEN** a homepage e a página de Contato são renderizadas
- **THEN** ambas usam a mesma URL `https://www.youtube.com/@IgrejanoRio7` proveniente da constante compartilhada
