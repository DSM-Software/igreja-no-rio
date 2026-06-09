## ADDED Requirements

### Requirement: Rota /agenda acessível como rota pública
O sistema SHALL incluir `/agenda` no conjunto de rotas públicas do site, com header e footer presentes, e o item "Agenda" ativo no menu de navegação.

#### Scenario: /agenda carrega sem erro
- **WHEN** o usuário acessa `/agenda`
- **THEN** a página retorna status 200, o header e o footer estão presentes

#### Scenario: Item "Agenda" ativo no menu ao acessar /agenda
- **WHEN** o usuário está na rota `/agenda`
- **THEN** o link "Agenda" no header possui a classe `active`

#### Scenario: /agenda incluída no sitemap
- **WHEN** o crawler acessa `/sitemap.xml`
- **THEN** a URL `/agenda` está presente no sitemap

## MODIFIED Requirements

### Requirement: Contato carrega
O sistema SHALL carregar `/contato` retornando status 200 e exibindo informações de contato da igreja, sem a seção de eventos.

#### Scenario: Contato carrega sem seção de eventos
- **WHEN** o usuário acessa `/contato`
- **THEN** a página retorna status 200, exibe informações de endereço, e-mail e canais de contato, e NÃO exibe a seção "Próximos eventos"
