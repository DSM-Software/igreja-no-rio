## Context

A homepage da Igreja no Rio renderiza, em ordem: Hero → evento em destaque → blog → **Agenda + Downloads** → destaque do YouTube → CTA final (`src/app/(frontend)/page.tsx`). O rodapé (`src/components/layout/Footer.tsx`) tem 3 colunas (marca, navegação, contato) e uma barra inferior com copyright + privacidade. URLs externas já são centralizadas em `src/lib/links.ts` (hoje apenas `YOUTUBE_CHANNEL_URL`) e o padrão de link externo é `<a target="_blank" rel="noopener noreferrer">` com ícones `@iconify/react`.

A Servo Livre é a editora parceira; a pedido (Tita Fleixeira) queremos divulgar os materiais com um banner full-width "Conheça nossos materiais" após a área de agenda/materiais e/ou uma entrada no rodapé. Decisão de UX: fazer **as duas** entradas, pois são complementares — o banner é o convite contextual de alta visibilidade e o rodapé é o acesso persistente discreto.

## Goals / Non-Goals

**Goals:**
- Dar visibilidade à editora Servo Livre com um banner promocional na homepage e um link no rodapé.
- Reutilizar uma única URL centralizada, evitando divergência entre entradas.
- Seguir os tokens Tailwind e os padrões de seção/link já existentes, sem novos blocos em `globals.css`.
- Garantir abertura segura em nova aba para domínio de terceiro.
- Cobrir as entradas com testes E2E.

**Non-Goals:**
- Não integrar catálogo, carrinho ou API da loja Servo Livre — apenas links externos.
- Não criar página interna dedicada à editora.
- Não usar a logomarca da Servo Livre nesta entrega (não temos o asset oficial aprovado); o banner usa tipografia/ícone do próprio design system. Pode ser adicionada depois se fornecida.
- Sem mudanças de schema Payload, migrações ou variáveis de ambiente.

## Decisions

### Decisão 1: Banner como componente próprio reutilizável

Criar `src/components/home/PublisherBanner.tsx` em vez de inline em `page.tsx`. Mantém `page.tsx` legível (segue o padrão de `HeroV1`) e isola o componente para o teste. **Alternativa considerada:** seção inline em `page.tsx` — rejeitada por inflar um arquivo já grande.

### Decisão 2: Posição e estilo do banner

Inserir entre a seção de Downloads (linha ~188) e o destaque do YouTube (linha ~191). Visual full-width seguindo o padrão "Pattern A" (evento em destaque): `<section className="bg-...">` com inner `mx-auto w-full max-w-content`. Para diferenciar do banner teal de eventos (`bg-brand-500`) e do card navy do YouTube, usar um tratamento distinto porém dentro da paleta (ex.: `bg-navy-900` ou gradiente brand), com título "Conheça nossos materiais", uma linha de apoio e CTA "Visitar a loja". A escolha exata de cor é validada visualmente com Playwright antes de fechar. **Alternativa:** reutilizar `bg-brand-500` igual ao banner de eventos — rejeitada para não criar dois banners teal idênticos em sequência visual.

### Decisão 3: URL centralizada em `src/lib/links.ts`

Adicionar `export const SERVO_LIVRE_URL = 'https://www.loja.servolivre.com/'`. Banner e rodapé importam a mesma constante. **Alternativa:** hardcode em cada local — rejeitada (divergência), contraria o padrão já estabelecido para o YouTube.

### Decisão 4: Entrada no rodapé

Adicionar o link "Editora Servo Livre" no rodapé como item externo. Por ser link externo (abre em nova aba) e os itens de navegação atuais serem internos (`next/link`), renderizá-lo de forma distinta (um `<a target="_blank">`), seja como item extra na coluna de navegação ou pequena linha própria. Detalhe visual validado no apply. **Alternativa:** quarta coluna dedicada — provavelmente excessivo para um único link.

## Risks / Trade-offs

- **[Domínio de terceiro pode mudar/expirar]** → URL centralizada em um único ponto facilita atualização futura; teste E2E falha visivelmente se o `href` for alterado por engano.
- **[Excesso de banners/CTA na home diluindo a mensagem]** → Diferenciar visualmente o banner dos vizinhos (eventos teal, YouTube navy) e manter copy enxuta; validar a hierarquia visual com Playwright antes de concluir.
- **[Segurança de `target="_blank"`]** → Sempre `rel="noopener noreferrer"`, consistente com os demais links externos.
- **[Banner pode parecer "anúncio" desalinhado da identidade]** → Sem logo de terceiro, usando tipografia/tokens do próprio site, o banner lê como seção institucional ("nossos materiais"), não como ad externo.
