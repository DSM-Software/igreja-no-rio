## ADDED Requirements

### Requirement: Banner da editora na homepage

A homepage (`/`) SHALL exibir uma seção full-width de divulgação da editora parceira Servo Livre, posicionada após a seção de Agenda + Downloads e antes do destaque do YouTube. A seção MUST conter um título no espírito de "Conheça nossos materiais" e um link/CTA cujo `href` seja a URL da loja (`https://www.loja.servolivre.com/`), que abre em nova aba (`target="_blank"`) e usa `rel="noopener noreferrer"`. A seção MUST seguir os tokens de design Tailwind do projeto (sem novos blocos em `globals.css`).

#### Scenario: Visitante vê o banner da editora na home

- **WHEN** o visitante carrega a homepage `/`
- **THEN** uma seção de divulgação da editora está visível
- **AND** ela contém um link cujo `href` é `https://www.loja.servolivre.com/`
- **AND** o link possui `target="_blank"` e `rel` contendo `noopener`

#### Scenario: A home continua renderizando sem erros

- **WHEN** o visitante carrega a homepage `/`
- **THEN** a resposta HTTP é bem-sucedida (`response.ok()`)
- **AND** as seções existentes (eventos, blog, downloads, YouTube, CTA final) continuam visíveis

### Requirement: Link da editora no rodapé

O rodapé (`Footer.tsx`), presente em todas as páginas públicas, SHALL apresentar um link para a editora Servo Livre. O link MUST apontar para `https://www.loja.servolivre.com/`, abrir em nova aba (`target="_blank"`) e usar `rel="noopener noreferrer"`.

#### Scenario: Visitante encontra a editora no rodapé

- **WHEN** o visitante carrega qualquer página pública e visualiza o rodapé
- **THEN** existe um link cujo texto refere a editora (ex.: "Servo Livre")
- **AND** o `href` é `https://www.loja.servolivre.com/`
- **AND** o link possui `target="_blank"` e `rel` contendo `noopener`

### Requirement: URL da loja centralizada

A URL da loja da Servo Livre SHALL ser definida em um único local reutilizável (`src/lib/links.ts`) e consumida pelo banner da homepage e pelo link do rodapé, evitando divergência de endereço entre as entradas.

#### Scenario: As duas entradas apontam para a mesma URL

- **WHEN** a homepage e o rodapé são renderizados
- **THEN** ambos usam a mesma URL `https://www.loja.servolivre.com/` proveniente da constante compartilhada
