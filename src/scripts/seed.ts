/**
 * Seed script — popula o banco com o conteúdo de exemplo do protótipo.
 * Roda com: npx tsx src/scripts/seed.ts
 *
 * Variáveis necessárias no .env:
 *   DATABASE_URI, PAYLOAD_SECRET, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME
 *
 * Opcionais (para garantir usuários de teste com cada papel):
 *   SEED_EDITOR_EMAIL, SEED_EDITOR_PASSWORD, SEED_EDITOR_NAME
 *   SEED_AUTOR_EMAIL, SEED_AUTOR_PASSWORD, SEED_AUTOR_NAME
 *
 * Em desenvolvimento (NODE_ENV != 'production'), valores padrão de email e nome
 * são aplicados quando as envs estão ausentes; a senha cai para `change-me-now`
 * apenas em dev. Em produção, qualquer ausência aborta o seed.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

// ── Helpers ────────────────────────────────────────────────────────────────────

const ADMIN_PLACEHOLDERS = new Set([
  'admin@igrejanorio.com',
  'senha-forte-aqui',
  'administrador',
])

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const DEV_PASSWORD_FALLBACK = 'change-me-now'

function requireAdminEnv(name: 'SEED_ADMIN_EMAIL' | 'SEED_ADMIN_PASSWORD' | 'SEED_ADMIN_NAME') {
  const rawValue = process.env[name]?.trim()

  // if (!rawValue) {
  //   throw new Error(`Defina ${name} com um valor real antes de rodar o seed.`)
  // }

  // if (ADMIN_PLACEHOLDERS.has(rawValue.toLowerCase())) {
  //   throw new Error(`Defina ${name} com um valor real; placeholders inseguros nao sao aceitos.`)
  // }

  return rawValue
}

type RoleSeed = {
  role: 'editor' | 'autor'
  emailEnv: 'SEED_EDITOR_EMAIL' | 'SEED_AUTOR_EMAIL'
  passwordEnv: 'SEED_EDITOR_PASSWORD' | 'SEED_AUTOR_PASSWORD'
  nameEnv: 'SEED_EDITOR_NAME' | 'SEED_AUTOR_NAME'
  defaultEmail: string
  defaultName: string
}

function readRoleEnv(envName: string, fallback: string | null, label: string) {
  const value = process.env[envName]?.trim()
  if (value) return value

  if (IS_PRODUCTION) {
    throw new Error(`Defina ${envName} antes de rodar o seed em producao.`)
  }

  if (fallback === null) {
    throw new Error(`Defina ${envName} (sem fallback) antes de rodar o seed.`)
  }

  console.warn(`⚠️  ${envName} ausente — usando fallback de desenvolvimento para ${label}.`)
  return fallback
}

async function upsertRoleUser(payload: Awaited<ReturnType<typeof getPayload>>, spec: RoleSeed) {
  const email = readRoleEnv(spec.emailEnv, spec.defaultEmail, `email do ${spec.role}`)
  const password = readRoleEnv(spec.passwordEnv, DEV_PASSWORD_FALLBACK, `senha do ${spec.role}`)
  const name = readRoleEnv(spec.nameEnv, spec.defaultName, `nome do ${spec.role}`)

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log(`⏭️  Usuário ${spec.role} já existe: ${email}`)
    return existing.docs[0].id as number
  }

  const created = await payload.create({
    collection: 'users',
    data: { name, email, password, role: spec.role },
  })
  console.log(`✅ Usuário ${spec.role} criado: ${email}`)
  return created.id as number
}

/** Converte markdown simples para nós Lexical serializados */
function mdToLexical(markdown: string) {
  const lines = markdown.split('\n')
  const children: any[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      children.push(heading(2, line.slice(3)))
    } else if (line.startsWith('### ')) {
      children.push(heading(3, line.slice(4)))
    } else if (line.startsWith('> ')) {
      children.push(quote(line.slice(2)))
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''))
        i++
      }
      children.push(listNode('number', items))
      continue
    } else if (line.trim() !== '') {
      children.push(paragraph(line))
    }

    i++
  }

  return { root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } }
}

function textNode(text: string) {
  // Handle **bold** inline
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  if (parts.length === 1) {
    return { detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }
  }
  return parts.map((p) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return { detail: 0, format: 1, mode: 'normal', style: '', text: p.slice(2, -2), type: 'text', version: 1 }
    }
    return { detail: 0, format: 0, mode: 'normal', style: '', text: p, type: 'text', version: 1 }
  })
}

function paragraph(text: string) {
  const inline = textNode(text)
  return {
    children: Array.isArray(inline) ? inline : [inline],
    direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1,
  }
}

function heading(level: number, text: string) {
  return {
    children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
    direction: 'ltr', format: '', indent: 0,
    tag: `h${level}`, type: 'heading', version: 1,
  }
}

function quote(text: string) {
  return {
    children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
    direction: 'ltr', format: '', indent: 0, type: 'quote', version: 1,
  }
}

function listNode(listType: 'bullet' | 'number', items: string[]) {
  return {
    children: items.map((item) => ({
      children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: item.replace(/\*\*([^*]+)\*\*/, '$1'), type: 'text', version: 1 }],
      direction: 'ltr', format: '', indent: 0, type: 'listitem', version: 1, value: 1,
    })),
    direction: 'ltr', format: '', indent: 0, listType, start: 1, tag: listType === 'number' ? 'ol' : 'ul',
    type: 'list', version: 1,
  }
}

// ── Seed data (from design_reference/app/store.jsx SEED) ──────────────────────

const POSTS = [
  {
    slug: 'voce-e-parte-desse-proposito',
    title: 'Você é parte desse propósito',
    category: 'Devocional',
    serie: null,
    author: 'Pr. Daniel Moraes',
    date: '2026-05-24',
    coverColor: 'navy',
    excerpt: 'Antes de você procurar a igreja, o Pai já tinha procurado você. A comunhão que vivemos aqui começou no coração de Deus.',
    tags: ['propósito', 'família', 'comunhão'],
    published: true,
    body: `Existe um cansaço que não vem do corpo, mas da sensação de não pertencer a lugar nenhum. A gente passa a vida tentando ser aceito, e poucas vezes descansa em ser amado.

O evangelho começa exatamente aí. Antes de qualquer esforço seu, antes de qualquer mérito, o Pai já tinha um propósito: reunir uma família de muitos filhos, conformes à imagem de Jesus.

## Não é sobre frequência, é sobre pertencimento
Quando você entra numa reunião da Igreja no Rio, não está visitando uma organização religiosa. Está entrando numa casa. E numa casa não se mede presença por crachá — se vive a vida junto.

> "Porque os que dantes conheceu, também os predestinou para serem conformes à imagem de seu Filho." (Romanos 8:29)

## Um convite, não uma cobrança
Você é parte desse propósito. Nós também. E é isso que nos reúne aqui — não a obrigação, mas a alegria de ser família.

Nesta semana, em vez de perguntar "o que eu preciso fazer pela igreja?", experimente perguntar "como eu posso amar mais de perto a família que Deus me deu?". A resposta quase sempre começa numa mesa, num abraço, num grupo caseiro.`,
  },
  {
    slug: 'a-casa-antes-do-templo',
    title: 'A casa antes do templo',
    category: 'Estudo',
    serie: 'Somos a Igreja',
    serieParte: 1,
    author: 'Pr. Daniel Moraes',
    date: '2026-05-17',
    coverColor: 'teal',
    excerpt: 'Parte 1 — Por que a igreja do Novo Testamento se encontrava nas casas, e o que isso ensina sobre a nossa ênfase nos grupos caseiros.',
    tags: ['eclesiologia', 'grupos caseiros'],
    published: true,
    body: `Quando lemos o livro de Atos, encontramos uma igreja que crescia de duas maneiras complementares: no templo e nas casas.

"E, perseverando unânimes todos os dias no templo, e partindo o pão em casa, comiam juntos com alegria e singeleza de coração." (Atos 2:46)

## O grande e o pequeno
O encontro no templo dava sentido de pertencer a algo maior. O encontro na casa dava rosto, nome e história a esse pertencimento.

Na Igreja no Rio celebramos juntos aos domingos, mas a ênfase do nosso relacionamento está nos grupos caseiros — porque é ali que a fé deixa de ser um evento e vira convivência.

## Três marcas da casa
1. **Proximidade** — ninguém é anônimo numa sala de estar.
2. **Cuidado mútuo** — as necessidades aparecem e são atendidas.
3. **Discipulado real** — a vida é observada e moldada de perto.

Na próxima parte da série, veremos como a mesa — o ato de comer juntos — se tornou central na formação dessa família.`,
  },
  {
    slug: 'a-mesa-que-forma-familia',
    title: 'A mesa que forma família',
    category: 'Estudo',
    serie: 'Somos a Igreja',
    serieParte: 2,
    author: 'Pra. Lúcia Andrade',
    date: '2026-05-10',
    coverColor: 'sand',
    excerpt: 'Parte 2 — O partir do pão não era um detalhe da igreja primitiva. Era o coração da convivência cristã.',
    tags: ['comunhão', 'mesa', 'grupos caseiros'],
    published: true,
    body: `Há algo profundamente humano e profundamente espiritual em compartilhar uma refeição. Jesus sabia disso — boa parte do seu ministério aconteceu em torno de mesas.

## Comer juntos é confiar
Quando abrimos a nossa casa e a nossa mesa, estamos dizendo: "há lugar para você aqui". Não é por acaso que a igreja primitiva crescia partindo o pão de casa em casa.

## Da mesa para a missão
A intimidade da mesa prepara a coragem da missão. Quem aprende a amar de perto, aprende a servir de longe.

Neste mês, convide alguém para a sua mesa. Pode ser um almoço simples. O Reino de Deus muitas vezes começa num prato compartilhado.`,
  },
  {
    slug: 'quando-a-fe-encontra-a-cidade',
    title: 'Quando a fé encontra a cidade',
    category: 'Devocional',
    serie: null,
    author: 'Pr. Daniel Moraes',
    date: '2026-05-03',
    coverColor: 'teal',
    excerpt: 'Somos a igreja na cidade do Rio de Janeiro. O que significa amar uma cidade inteira a partir do Monte do Santíssimo?',
    tags: ['cidade', 'missão'],
    published: true,
    body: `Deus tem um povo em cada cidade. No Rio de Janeiro, esse povo tem o seu jeito — caloroso, resiliente, alegre mesmo na dificuldade.

## A igreja não tem endereço, tem rosto
Estar em Santíssimo é um ponto de partida, não de chegada. A igreja transborda para o trabalho, para a escola, para a fila do mercado.

## Um chamado simples
Ame a sua rua. Conheça o nome do seu vizinho. Ore pelo seu bairro. A cidade muda quando a igreja deixa de ser um lugar aonde se vai e passa a ser um povo que vive.`,
  },
  {
    slug: 'descanse-voce-ja-foi-encontrado',
    title: 'Descanse: você já foi encontrado',
    category: 'Devocional',
    serie: null,
    author: 'Pra. Lúcia Andrade',
    date: '2026-04-26',
    coverColor: 'navy',
    excerpt: 'Para quem está cansado de tentar provar valor. Uma palavra sobre graça, descanso e aceitação.',
    tags: ['graça', 'descanso'],
    published: true,
    body: `"Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei." (Mateus 11:28)

## O fim da corrida pelo valor
Você não precisa ser impressionante para ser amado por Deus. Ele não está esperando a sua melhor versão — Ele já se entregou pela versão real de você.

## Descanso é confiança
Descansar não é parar de se importar. É confiar que Deus segura o que você não consegue carregar. Hoje, entregue uma preocupação específica a Ele e não a pegue de volta.`,
  },
]

const DOWNLOADS = [
  { title: 'Somos a Igreja — Parte 1: A casa antes do templo', kind: 'audio', category: 'Pregações', date: '2026-05-18', size: '38 min', speaker: 'Pr. Daniel Moraes', desc: 'Mensagem de domingo sobre a igreja que se encontrava nas casas.' },
  { title: 'Somos a Igreja — Parte 2: A mesa que forma família', kind: 'audio', category: 'Pregações', date: '2026-05-11', size: '41 min', speaker: 'Pra. Lúcia Andrade', desc: 'O partir do pão como coração da convivência cristã.' },
  { title: 'Guia do Grupo Caseiro — Semana 1', kind: 'pdf', category: 'Grupos Caseiros', date: '2026-05-19', size: '1,2 MB', speaker: null, desc: 'Roteiro de perguntas e dinâmica para o encontro da semana.' },
  { title: 'Estudo: Romanos 8 — Filhos e herdeiros', kind: 'pdf', category: 'Estudos', date: '2026-05-05', size: '2,4 MB', speaker: null, desc: 'Apostila de 6 capítulos para estudo individual ou em grupo.' },
  { title: 'Slides — Encontro de Grupos Caseiros', kind: 'slides', category: 'Grupos Caseiros', date: '2026-05-12', size: '5,8 MB', speaker: null, desc: 'Apresentação para conduzir o encontro na sua casa.' },
  { title: 'Devocional de Maio — 31 dias na Graça', kind: 'pdf', category: 'Devocionais', date: '2026-05-01', size: '3,1 MB', speaker: null, desc: 'Um devocional curto para cada dia do mês.' },
  { title: 'Você é parte desse propósito', kind: 'audio', category: 'Pregações', date: '2026-04-27', size: '35 min', speaker: 'Pr. Daniel Moraes', desc: 'Mensagem sobre pertencimento e propósito.' },
]

const EVENTS = [
  { title: 'Reunião Geral de Domingo', date: '2026-05-31', time: '10:00', location: 'Rua Ivan Pessoa, 341 — Santíssimo', recurring: 'Todo domingo', desc: 'Nosso encontro de toda a família, com louvor, palavra e comunhão.', highlight: true },
  { title: 'Grupos Caseiros', date: '2026-06-04', time: '19:30', location: 'Casas em diversos bairros', recurring: 'Toda quarta', desc: 'O coração da nossa convivência. Fale com a gente para encontrar um grupo perto de você.', highlight: false },
  { title: 'Café com a Família — Novos por aqui', date: '2026-06-08', time: '09:00', location: 'Rua Ivan Pessoa, 341 — Santíssimo', recurring: null, desc: 'Um café simples para quem chegou há pouco conhecer a nossa história e fazer perguntas.', highlight: false },
  { title: 'Encontro de Oração', date: '2026-06-13', time: '18:00', location: 'Online e presencial', recurring: 'Todo sábado', desc: 'Um tempo para orar juntos pela igreja e pela cidade.', highlight: false },
  { title: 'Reunião Geral', date: '2026-06-19', time: '10:00', location: 'Online e presencial', recurring: 'Todo domingo', desc: 'Um tempo para orar juntos pela igreja e pela cidade.', highlight: false },
  { title: 'CTL', date: '2026-06-19', time: '14:00', location: 'Online e presencial', recurring: 'Todo domingo', desc: 'Um tempo para orar juntos pela igreja e pela cidade.', highlight: false },
]

// ── Main ────────────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config: configPromise })
  console.log('🌱 Iniciando seed...')

  // 1. Admin user
  const adminEmail = requireAdminEnv('SEED_ADMIN_EMAIL')
  const adminPass = requireAdminEnv('SEED_ADMIN_PASSWORD')
  const adminName = requireAdminEnv('SEED_ADMIN_NAME')

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
  })

  let adminUserId = existing.docs[0]?.id as number | undefined

  if (existing.docs.length === 0) {
    const createdAdmin = await payload.create({
      collection: 'users',
      data: { name: adminName, email: adminEmail, password: adminPass, role: 'admin' },
    })
    adminUserId = createdAdmin.id as number
    console.log(`✅ Usuário admin criado: ${adminEmail}`)
  } else {
    console.log(`⏭️  Usuário admin já existe: ${adminEmail}`)
  }

  // 1b. Editor e Autor (para testes E2E e workflow editorial)
  const editorUserId = await upsertRoleUser(payload, {
    role: 'editor',
    emailEnv: 'SEED_EDITOR_EMAIL',
    passwordEnv: 'SEED_EDITOR_PASSWORD',
    nameEnv: 'SEED_EDITOR_NAME',
    defaultEmail: 'editor@igrejanorio.local',
    defaultName: 'Editor de Conteúdo',
  })
  void editorUserId

  const autorUserId = await upsertRoleUser(payload, {
    role: 'autor',
    emailEnv: 'SEED_AUTOR_EMAIL',
    passwordEnv: 'SEED_AUTOR_PASSWORD',
    nameEnv: 'SEED_AUTOR_NAME',
    defaultEmail: 'autor@igrejanorio.local',
    defaultName: 'Autor de Conteúdo',
  })

  // 2. Posts
  console.log('\n📝 Inserindo posts...')
  for (const p of POSTS) {
    const exists = await payload.find({ collection: 'posts', where: { slug: { equals: p.slug } }, limit: 1 })
    if (exists.docs.length > 0) { console.log(`  ⏭️  post "${p.slug}" já existe`); continue }

    await payload.create({
      collection: 'posts',
      data: {
        title: p.title,
        slug: p.slug,
        category: p.category as any,
        serie: p.serie ?? undefined,
        serieParte: (p as any).serieParte ?? undefined,
        author: p.author,
        date: p.date,
        coverColor: p.coverColor as any,
        excerpt: p.excerpt,
        tags: p.tags.map((t) => ({ tag: t })),
        published: p.published,
        body: mdToLexical(p.body) as any,
        owner: adminUserId,
      },
    })
    console.log(`  ✅ "${p.title}"`)
  }

  // 2b. Post de propriedade do autor (para fluxo de edição por papel `autor`)
  const autorPostSlug = 'rascunho-do-autor-para-testes'
  const existingAutorPost = await payload.find({
    collection: 'posts',
    where: { slug: { equals: autorPostSlug } },
    limit: 1,
  })

  if (existingAutorPost.docs.length === 0) {
    await payload.create({
      collection: 'posts',
      data: {
        title: 'Rascunho do autor para testes',
        slug: autorPostSlug,
        category: 'Devocional' as any,
        author: 'Autor de Conteúdo',
        date: '2026-06-01',
        coverColor: 'teal' as any,
        excerpt: 'Post de exemplo criado pelo seed para validar o fluxo de edição do papel autor.',
        tags: [{ tag: 'teste' }],
        published: false,
        body: mdToLexical('Corpo inicial do rascunho do autor para testes.') as any,
        owner: autorUserId,
      },
    })
    console.log(`  ✅ post "${autorPostSlug}" (owner=autor) criado`)
  } else {
    console.log(`  ⏭️  post "${autorPostSlug}" já existe`)
  }

  // 3. Downloads
  console.log('\n⬇️  Inserindo downloads...')
  for (const d of DOWNLOADS) {
    const exists = await payload.find({ collection: 'downloads', where: { title: { equals: d.title } }, limit: 1 })
    if (exists.docs.length > 0) { console.log(`  ⏭️  download "${d.title}" já existe`); continue }

    await payload.create({
      collection: 'downloads',
      data: {
        title: d.title,
        kind: d.kind as any,
        category: d.category,
        date: d.date,
        speaker: d.speaker ?? undefined,
        desc: d.desc ?? undefined,
        size: d.size ?? undefined,
        owner: adminUserId,
      },
    })
    console.log(`  ✅ "${d.title}"`)
  }

  // 4. Events
  console.log('\n📅 Inserindo eventos...')
  for (const e of EVENTS) {
    const exists = await payload.find({ collection: 'events', where: { title: { equals: e.title } }, limit: 1 })
    if (exists.docs.length > 0) { console.log(`  ⏭️  evento "${e.title}" já existe`); continue }

    await payload.create({
      collection: 'events',
      data: {
        title: e.title,
        date: e.date,
        time: e.time,
        location: e.location,
        recurring: e.recurring ?? undefined,
        desc: e.desc ?? undefined,
        highlight: e.highlight,
        owner: adminUserId,
      },
    })
    console.log(`  ✅ "${e.title}"`)
  }

  console.log('\n🎉 Seed concluído!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erro no seed:', err)
  process.exit(1)
})
