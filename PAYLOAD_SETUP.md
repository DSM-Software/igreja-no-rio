# Payload CMS — Setup, Coleções e Papéis

Guia para o Claude Code implementar o CMS do site da Igreja no Rio com **Payload 3.x dentro de um app Next.js (App Router)**. O painel fica em `/admin`, o site público nas demais rotas, tudo no mesmo deploy.

> Códigos abaixo são um **ponto de partida fiel ao modelo do protótipo** (`design_reference/app/store.jsx`). Ajuste nomes/labels conforme necessário. Use a versão estável mais recente do Payload 3.

---

## 1. Bootstrap do projeto
```bash
npx create-payload-app@latest igreja-no-rio   # template: website (Next App Router) + Postgres
```
Dependências principais:
```
payload  @payloadcms/next  @payloadcms/db-postgres  @payloadcms/richtext-lexical
@payloadcms/storage-vercel-blob   # ou @payloadcms/storage-s3 para S3/R2
```

Variáveis de ambiente (`.env`):
```
DATABASE_URI=postgres://...           # Neon / Supabase / Railway
PAYLOAD_SECRET=<string-aleatoria-longa>
PAYLOAD_SERVER_URL=https://igrejanorio.org
PAYLOAD_TRUSTED_ORIGINS=https://igrejanorio.org,https://www.igrejanorio.com
PAYLOAD_CSRF_ORIGINS=https://igrejanorio.org,https://www.igrejanorio.com
BLOB_READ_WRITE_TOKEN=...             # se usar Vercel Blob
NEXT_PUBLIC_SERVER_URL=https://igrejanorio.org
SEED_ADMIN_EMAIL=<email-admin-real>
SEED_ADMIN_PASSWORD=<senha-inicial-forte>
SEED_ADMIN_NAME=<nome-do-admin>
```

---

## 2. Papéis de acesso (você quer várias pessoas publicando)
Defina 3 papéis na coleção `users`. Comece simples — dá pra refinar depois:

| Papel | Pode |
|---|---|
| **admin** | Tudo: conteúdo, mídia, criar/editar usuários, configurações |
| **editor** | Criar/editar/excluir/publicar **todo** o conteúdo (posts, downloads, eventos) e mídia. Não mexe em usuários. |
| **autor** | Criar e editar **os próprios** posts/downloads/eventos. Só publica o que é seu. |

Assim, se no fim só uma pessoa cuidar de tudo, ela é **admin/editor** e os papéis extras ficam prontos para quando mais gente entrar — sem retrabalho.

### `src/collections/Users.ts`
```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // login/email/senha + recuperação nativos
  admin: { useAsTitle: 'name' },
  access: {
    // só admin gerencia usuários
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'autor',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Autor', value: 'autor' },
      ],
      access: { update: ({ req }) => req.user?.role === 'admin' }, // só admin muda papel
    },
  ],
}
```

### Helper de acesso reutilizável — `src/access/contentAccess.ts`
```ts
import type { Access } from 'payload'

// editor/admin podem tudo; autor só os próprios registros
export const canReadPublishedOrOwn: Access = ({ req: { user } }) => {
  if (!user) return { published: { equals: true } }        // público: só publicado
  if (user.role === 'admin' || user.role === 'editor') return true
  return true // logado vê tudo na lista do admin; refine se quiser
}

export const canMutateOwnOrElevated: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin' || user.role === 'editor') return true
  // autor: só onde ele é o owner
  return { owner: { equals: user.id } }
}
```
> Para o modelo de "autor edita só o seu", adicione um campo `owner` (relationship → users, preenchido via hook `beforeChange` com `req.user.id`) nas coleções de conteúdo. Para começar mais simples, você pode dar a editores **e** autores acesso total e introduzir o `owner` depois.

---

## 3. Coleção `posts` (Blog)
Mapeada de `SEED.posts`. O `body` vira **rich text Lexical** (no protótipo era markdown leve com `##`, `>`, `**`, listas). `slug` é gerado do título. A "capa por cor" do protótipo vira **imagem opcional + cor de fallback**.

```ts
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { canReadPublishedOrOwn, canMutateOwnOrElevated } from '../access/contentAccess'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'date', 'published'] },
  access: {
    read: canReadPublishedOrOwn,
    create: ({ req }) => Boolean(req.user),
    update: canMutateOwnOrElevated,
    delete: canMutateOwnOrElevated,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug', type: 'text', unique: true, index: true,
      admin: { position: 'sidebar', description: 'Gerado do título; pode editar.' },
      hooks: { beforeValidate: [({ value, data }) => value || slugify(data?.title || '')] },
    },
    {
      name: 'category', type: 'select', required: true, defaultValue: 'Devocional',
      options: [{ label: 'Devocional', value: 'Devocional' }, { label: 'Estudo', value: 'Estudo' }],
    },
    { name: 'serie', type: 'text', label: 'Série (opcional)' },
    { name: 'serieParte', type: 'number', label: 'Parte nº', min: 1 },
    { name: 'author', type: 'text', label: 'Autor', required: true },
    { name: 'date', type: 'date', required: true, defaultValue: () => new Date(),
      admin: { date: { pickerAppearance: 'dayOnly' } } },
    // capa: imagem opcional + cor de fallback (turquesa/marinho/areia do protótipo)
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Imagem de capa (opcional)' },
    {
      name: 'coverColor', type: 'select', defaultValue: 'teal',
      options: [{ label: 'Turquesa', value: 'teal' }, { label: 'Marinho', value: 'navy' }, { label: 'Areia', value: 'sand' }],
      admin: { description: 'Cor usada quando não há imagem de capa.' },
    },
    { name: 'excerpt', type: 'textarea', label: 'Resumo (chamada)', required: true },
    { name: 'body', type: 'richText', editor: lexicalEditor(), required: true },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    { name: 'published', type: 'checkbox', label: 'Publicado', defaultValue: true,
      admin: { position: 'sidebar', description: 'Desmarque para deixar como rascunho (oculto no site).' } },
    // opcional p/ "autor edita só o seu":
    // { name: 'owner', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar', readOnly: true } },
  ],
}
```
> Alternativa nativa: em vez do checkbox `published`, ative **Drafts/Versions** (`versions: { drafts: true }`) — o Payload passa a ter status Rascunho/Publicado e histórico. Recomendado se a igreja quiser revisar antes de publicar.

---

## 4. Coleção `downloads`
Mapeada de `SEED.downloads`. Suporta **arquivo enviado OU link externo** (útil para áudios grandes de pregação). `size`/duração pode ser informado à mão ou derivado do arquivo.

```ts
export const Downloads: CollectionConfig = {
  slug: 'downloads',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'kind', 'category', 'date'] },
  access: { read: () => true, create: ({ req }) => Boolean(req.user),
            update: canMutateOwnOrElevated, delete: canMutateOwnOrElevated },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'kind', type: 'select', required: true, defaultValue: 'audio',
      options: [{ label: 'Áudio', value: 'audio' }, { label: 'PDF', value: 'pdf' }, { label: 'Slides', value: 'slides' }] },
    { name: 'category', type: 'text', required: true, admin: { description: 'Ex.: Pregações, Estudos, Grupos Caseiros, Devocionais' } },
    { name: 'date', type: 'date', required: true, defaultValue: () => new Date() },
    { name: 'speaker', type: 'text', label: 'Pregador (opcional)' },
    { name: 'desc', type: 'textarea', label: 'Descrição' },
    // arquivo: envie OU informe link externo
    { name: 'file', type: 'upload', relationTo: 'media', label: 'Arquivo (PDF/áudio/slides)' },
    { name: 'externalUrl', type: 'text', label: 'Ou link externo (YouTube, podcast…)' },
    { name: 'size', type: 'text', label: 'Tamanho / duração', admin: { description: 'Ex.: 38 min · 2,4 MB' } },
  ],
}
```

---

## 5. Coleção `events`
Mapeada de `SEED.events`. `highlight` destaca o evento na home.

```ts
export const Events: CollectionConfig = {
  slug: 'events',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'date', 'time', 'highlight'] },
  access: { read: () => true, create: ({ req }) => Boolean(req.user),
            update: canMutateOwnOrElevated, delete: canMutateOwnOrElevated },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'date', type: 'date', required: true, defaultValue: () => new Date() },
    { name: 'time', type: 'text', required: true, defaultValue: '19:30', admin: { description: 'Ex.: 10:00' } },
    { name: 'location', type: 'text', required: true },
    { name: 'recurring', type: 'text', label: 'Recorrência (opcional)', admin: { description: 'Ex.: Todo domingo' } },
    { name: 'desc', type: 'textarea', label: 'Descrição' },
    { name: 'highlight', type: 'checkbox', label: 'Destaque na home', defaultValue: false },
  ],
}
```

---

## 6. Coleção `media`
```ts
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/*', 'application/pdf', 'audio/*',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 768 },
      { name: 'hero', width: 1600 },
    ],
  },
  access: { read: () => true, create: ({ req }) => Boolean(req.user) },
  fields: [{ name: 'alt', type: 'text', label: 'Texto alternativo' }],
}
```
Conecte o adapter de storage no `payload.config.ts` (Vercel Blob ou S3/R2) para que os arquivos não fiquem no disco efêmero do servidor.

---

## 7. (Opcional) Coleção `pages` para Quem Somos / Cultos / Contato
Se a igreja quiser editar essas páginas sem dev, crie uma coleção `pages` com `slug` + blocos de conteúdo (rich text, imagem, CTA). Se não, deixe essas páginas estáticas no Next. **Recomendo começar estático** e migrar para blocos só se pedirem.

---

## 8. `payload.config.ts` (esqueleto)
```ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Downloads } from './collections/Downloads'
import { Events } from './collections/Events'
import { Media } from './collections/Media'

export default buildConfig({
  admin: { user: 'users' },
  collections: [Users, Posts, Downloads, Events, Media],
  editor: lexicalEditor(),
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI! } }),
  secret: process.env.PAYLOAD_SECRET!,
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    }),
  ],
})
```

---

## 9. Consumir no site (Local API — sem HTTP)
No App Router, use a Local API do Payload direto nos Server Components (rápido, sem rede):
```ts
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

// últimos posts publicados para a home / blog
const { docs: posts } = await payload.find({
  collection: 'posts',
  where: { published: { equals: true } },
  sort: '-date',
  limit: 6,
})

// post por slug
const { docs } = await payload.find({ collection: 'posts', where: { slug: { equals: params.slug } }, limit: 1 })
```
- **Tempo de leitura** (mostrado no post): calcule de `body` (~200 palavras/min, mínimo 2) — lógica está em `readingTime()` no `store.jsx`.
- **Formatação de data PT-BR** ("24 de maio de 2026"): ver `fmtDate()` no `store.jsx`. Ou use `Intl.DateTimeFormat('pt-BR')`.

---

## 10. Seed inicial
O conteúdo de exemplo (5 posts, 7 downloads, 4 eventos) está em `design_reference/app/store.jsx` → objeto `SEED`. Crie um script de seed (`payload.create(...)` para cada item) para popular o banco na primeira subida — ótimo para a igreja já ver o site cheio. O `body` dos posts está em markdown leve; converta para Lexical ou cole como parágrafos.

O bootstrap administrativo deve falhar fechado: nunca use fallback para e-mail, senha ou nome do admin. Exija `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` e `SEED_ADMIN_NAME` com valores reais antes de rodar o seed inicial.

---

## 11. Checklist de deploy
- [ ] Banco Postgres provisionado (Neon/Supabase/Railway) e `DATABASE_URI` setado
- [ ] `PAYLOAD_SECRET` forte; storage de arquivos (Blob/S3/R2) configurado
- [ ] Primeiro usuário **admin** criado (tela inicial do `/admin`)
- [ ] Demais membros convidados com papel **editor** ou **autor**
- [ ] Seed rodado (conteúdo de exemplo) — depois a igreja edita/apaga
- [ ] Logos em `public/` (dark + white) e fontes Poppins/Mulish carregadas
- [ ] SEO: títulos/descrições por página, sitemap, Open Graph (importante p/ ser achado)
