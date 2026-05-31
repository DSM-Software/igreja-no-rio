## MODIFIED Requirements

### Requirement: Todas as rotas publicas carregam sem erro
O sistema SHALL carregar cada rota publica retornando HTTP 200 e renderizando o header e footer da Igreja no Rio com copy institucional em portugues do Brasil.

#### Scenario: Home page carrega
- **WHEN** o usuario acessa `http://localhost:3000/`
- **THEN** a pagina retorna status 200, o `<title>` contem "Igreja no Rio" e o logo esta visivel no header

#### Scenario: Quem Somos carrega
- **WHEN** o usuario acessa `/quem-somos`
- **THEN** a pagina retorna status 200 e exibe conteudo institucional sem referencias nominais a pessoas especificas

#### Scenario: Cultos carrega com reuniao geral explicita
- **WHEN** o usuario acessa `/cultos`
- **THEN** a pagina retorna status 200 e informa que a unica reuniao geral ocorre no domingo as 10h

#### Scenario: Grupos caseiros com descricao correta
- **WHEN** o usuario acessa a secao de grupos caseiros nas rotas publicas
- **THEN** o texto informa que sao reunioes em casas, espalhadas pela cidade, sem data e hora rigidas em local unico

#### Scenario: Blog carrega
- **WHEN** o usuario acessa `/blog`
- **THEN** a pagina retorna status 200 e exibe o heading "Devocionais e Estudos"

#### Scenario: Downloads carrega
- **WHEN** o usuario acessa `/downloads`
- **THEN** a pagina retorna status 200 e exibe o heading "Downloads"

#### Scenario: Contato carrega
- **WHEN** o usuario acessa `/contato`
- **THEN** a pagina retorna status 200 e exibe informacoes de contato da igreja
