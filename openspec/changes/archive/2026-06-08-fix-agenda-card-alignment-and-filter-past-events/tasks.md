## 1. Filtro de eventos passados na página de agenda

- [x] 1.1 Em `src/app/(frontend)/agenda/page.tsx`, calcular a data de hoje no fuso `America/Sao_Paulo` em formato `YYYY-MM-DD`
- [x] 1.2 Adicionar `where: { date: { greater_than_equal: today } }` na query de eventos não-recorrentes (manter query separada ou mesma, mas com filtro de data)
- [x] 1.3 Verificar que eventos recorrentes continuam sendo buscados/exibidos sem filtro de data

## 2. Alinhamento de ícone e texto no EventCard

- [x] 2.1 Em `src/components/ui/EventCard.tsx`, substituir o `<p>` da linha de horário por `<span className="mt-1 flex items-center gap-1.5 text-sm text-ink-2">` removendo o `style={{ verticalAlign: "middle", marginRight: 4 }}` do ícone
- [x] 2.2 Aplicar a mesma mudança na linha de local (`location`)

## 3. Testes e validação

- [x] 3.1 Rodar `npm run lint` e corrigir eventuais warnings
- [x] 3.2 Rodar `npm run build` e garantir que compila sem erros
- [x] 3.3 Rodar `npm run test:e2e -- tests/e2e/public-routes.spec.ts` e garantir que todos os testes passam
- [x] 3.4 Tirar screenshot da página `/agenda` com Playwright e confirmar visualmente o alinhamento dos ícones e ausência de eventos passados
