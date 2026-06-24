/**
 * Resíduo de scaffolding antigo do Payload: versões anteriores geravam o
 * importMap aqui, em `(payload)/importMap.ts`. O Payload atual gera em
 * `(payload)/admin/importMap.js` (ver `admin.importMap.baseDir` em
 * `payload.config.ts`). Este arquivo ficou órfão exportando um mapa VAZIO.
 *
 * Um importMap vazio (`{}`) é "truthy": qualquer `getPayload({ importMap: {} })`
 * sobrescreve `payload.importMap` da instância global compartilhada para vazio,
 * fazendo os componentes server-side dos campos (ex.: o editor Lexical do campo
 * `body` de Posts) sumirem do formulário do admin na navegação SPA até um reload
 * completo re-semear a instância.
 *
 * Para evitar a reincidência, este módulo agora re-exporta o importMap gerado
 * de verdade — assim qualquer importador deste caminho recebe o mapa correto.
 */
export { importMap } from './admin/importMap.js'
