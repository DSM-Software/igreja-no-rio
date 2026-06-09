## 1. Criar a página de agenda

- [x] 1.1 Criar `src/app/(frontend)/agenda/page.tsx` com fetch de eventos, separação entre recorrentes e por data, e reutilização de `EventCard`
- [x] 1.2 Definir `metadata` com `title: "Agenda"` e descrição referenciando eventos da Igreja no Rio
- [x] 1.3 Implementar estado vazio com mensagem amigável e link para `/contato`

## 2. Atualizar a navegação

- [x] 2.1 Adicionar `{ href: "/agenda", label: "Agenda" }` ao `NAV_LINKS` em `src/components/layout/Header.tsx` (entre "Cultos" e "Blog" ou em posição adequada)

## 3. Limpar a página de contato

- [x] 3.1 Remover o fetch de eventos e a seção "Próximos eventos" de `src/app/(frontend)/contato/page.tsx`
- [x] 3.2 Atualizar o `metadata` da página de contato removendo referência a "agenda de eventos" na description

## 4. Atualizar sitemap e robots

- [x] 4.1 Adicionar entrada `/agenda` em `src/app/(frontend)/sitemap.ts`
