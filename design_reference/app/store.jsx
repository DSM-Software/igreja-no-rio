// app/store.jsx — data layer: localStorage-backed store + seed content + hooks
const { useState, useEffect, useCallback, useRef, createContext, useContext } = React;

const STORE_KEY = 'inr_cms_v1';
const ADMIN_KEY = 'inr_admin_v1';
const ADMIN_PASS = 'familia';

// ---------- helpers ----------
const uid = () => Math.random().toString(36).slice(2, 9);
const slugify = (s) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);

const MONTHS = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const MONTHS_FULL = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
function fmtDate(iso, full) {
  if (!iso) return '';
  const d = new Date(iso + (iso.length <= 10 ? 'T12:00:00' : ''));
  if (isNaN(d)) return iso;
  const m = full ? MONTHS_FULL[d.getMonth()] : MONTHS[d.getMonth()];
  return `${d.getDate()} de ${m}${full ? ' de ' + d.getFullYear() : ''}`;
}
function readingTime(body) {
  const words = (body || '').split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}

// ---------- seed content ----------
const SEED = {
  posts: [
    {
      id: 'p1', slug: 'voce-e-parte-desse-proposito',
      title: 'Você é parte desse propósito',
      category: 'Devocional', serie: null,
      author: 'Pr. Daniel Moraes', date: '2026-05-24', cover: 'navy',
      excerpt: 'Antes de você procurar a igreja, o Pai já tinha procurado você. A comunhão que vivemos aqui começou no coração de Deus.',
      tags: ['propósito', 'família', 'comunhão'],
      published: true,
      body: `Existe um cansaço que não vem do corpo, mas da sensação de não pertencer a lugar nenhum. A gente passa a vida tentando ser aceito, e poucas vezes descansa em ser amado.\n\nO evangelho começa exatamente aí. Antes de qualquer esforço seu, antes de qualquer mérito, o Pai já tinha um propósito: reunir uma família de muitos filhos, conformes à imagem de Jesus.\n\n## Não é sobre frequência, é sobre pertencimento\nQuando você entra numa reunião da Igreja no Rio, não está visitando uma organização religiosa. Está entrando numa casa. E numa casa não se mede presença por crachá — se vive a vida junto.\n\n> "Porque os que dantes conheceu, também os predestinou para serem conformes à imagem de seu Filho." (Romanos 8:29)\n\n## Um convite, não uma cobrança\nVocê é parte desse propósito. Nós também. E é isso que nos reúne aqui — não a obrigação, mas a alegria de ser família.\n\nNesta semana, em vez de perguntar "o que eu preciso fazer pela igreja?", experimente perguntar "como eu posso amar mais de perto a família que Deus me deu?". A resposta quase sempre começa numa mesa, num abraço, num grupo caseiro.`,
    },
    {
      id: 'p2', slug: 'a-casa-antes-do-templo',
      title: 'A casa antes do templo',
      category: 'Estudo', serie: 'Somos a Igreja',
      serieParte: 1,
      author: 'Pr. Daniel Moraes', date: '2026-05-17', cover: 'teal',
      excerpt: 'Parte 1 — Por que a igreja do Novo Testamento se encontrava nas casas, e o que isso ensina sobre a nossa ênfase nos grupos caseiros.',
      tags: ['eclesiologia', 'grupos caseiros'],
      published: true,
      body: `Quando lemos o livro de Atos, encontramos uma igreja que crescia de duas maneiras complementares: no templo e nas casas.\n\n"E, perseverando unânimes todos os dias no templo, e partindo o pão em casa, comiam juntos com alegria e singeleza de coração." (Atos 2:46)\n\n## O grande e o pequeno\nO encontro no templo dava sentido de pertencer a algo maior. O encontro na casa dava rosto, nome e história a esse pertencimento.\n\nNa Igreja no Rio celebramos juntos aos domingos, mas a ênfase do nosso relacionamento está nos grupos caseiros — porque é ali que a fé deixa de ser um evento e vira convivência.\n\n## Três marcas da casa\n1. **Proximidade** — ninguém é anônimo numa sala de estar.\n2. **Cuidado mútuo** — as necessidades aparecem e são atendidas.\n3. **Discipulado real** — a vida é observada e moldada de perto.\n\nNa próxima parte da série, veremos como a mesa — o ato de comer juntos — se tornou central na formação dessa família.`,
    },
    {
      id: 'p3', slug: 'a-mesa-que-forma-familia',
      title: 'A mesa que forma família',
      category: 'Estudo', serie: 'Somos a Igreja',
      serieParte: 2,
      author: 'Pra. Lúcia Andrade', date: '2026-05-10', cover: 'sand',
      excerpt: 'Parte 2 — O partir do pão não era um detalhe da igreja primitiva. Era o coração da convivência cristã.',
      tags: ['comunhão', 'mesa', 'grupos caseiros'],
      published: true,
      body: `Há algo profundamente humano e profundamente espiritual em compartilhar uma refeição. Jesus sabia disso — boa parte do seu ministério aconteceu em torno de mesas.\n\n## Comer juntos é confiar\nQuando abrimos a nossa casa e a nossa mesa, estamos dizendo: "há lugar para você aqui". Não é por acaso que a igreja primitiva crescia partindo o pão de casa em casa.\n\n## Da mesa para a missão\nA intimidade da mesa prepara a coragem da missão. Quem aprende a amar de perto, aprende a servir de longe.\n\nNeste mês, convide alguém para a sua mesa. Pode ser um almoço simples. O Reino de Deus muitas vezes começa num prato compartilhado.`,
    },
    {
      id: 'p4', slug: 'quando-a-fe-encontra-a-cidade',
      title: 'Quando a fé encontra a cidade',
      category: 'Devocional', serie: null,
      author: 'Pr. Daniel Moraes', date: '2026-05-03', cover: 'teal',
      excerpt: 'Somos a igreja na cidade do Rio de Janeiro. O que significa amar uma cidade inteira a partir do Monte do Santíssimo?',
      tags: ['cidade', 'missão'],
      published: true,
      body: `Deus tem um povo em cada cidade. No Rio de Janeiro, esse povo tem o seu jeito — caloroso, resiliente, alegre mesmo na dificuldade.\n\n## A igreja não tem endereço, tem rosto\nEstar em Santíssimo é um ponto de partida, não de chegada. A igreja transborda para o trabalho, para a escola, para a fila do mercado.\n\n## Um chamado simples\nAme a sua rua. Conheça o nome do seu vizinho. Ore pelo seu bairro. A cidade muda quando a igreja deixa de ser um lugar aonde se vai e passa a ser um povo que vive.`,
    },
    {
      id: 'p5', slug: 'descanse-voce-ja-foi-encontrado',
      title: 'Descanse: você já foi encontrado',
      category: 'Devocional', serie: null,
      author: 'Pra. Lúcia Andrade', date: '2026-04-26', cover: 'navy',
      excerpt: 'Para quem está cansado de tentar provar valor. Uma palavra sobre graça, descanso e aceitação.',
      tags: ['graça', 'descanso'],
      published: true,
      body: `"Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei." (Mateus 11:28)\n\n## O fim da corrida pelo valor\nVocê não precisa ser impressionante para ser amado por Deus. Ele não está esperando a sua melhor versão — Ele já se entregou pela versão real de você.\n\n## Descanso é confiança\nDescansar não é parar de se importar. É confiar que Deus segura o que você não consegue carregar. Hoje, entregue uma preocupação específica a Ele e não a pegue de volta.`,
    },
  ],
  downloads: [
    { id: 'd1', title: 'Somos a Igreja — Parte 1: A casa antes do templo', kind: 'audio', category: 'Pregações', date: '2026-05-18', size: '38 min', speaker: 'Pr. Daniel Moraes', desc: 'Mensagem de domingo sobre a igreja que se encontrava nas casas.' },
    { id: 'd2', title: 'Somos a Igreja — Parte 2: A mesa que forma família', kind: 'audio', category: 'Pregações', date: '2026-05-11', size: '41 min', speaker: 'Pra. Lúcia Andrade', desc: 'O partir do pão como coração da convivência cristã.' },
    { id: 'd3', title: 'Guia do Grupo Caseiro — Semana 1', kind: 'pdf', category: 'Grupos Caseiros', date: '2026-05-19', size: '1,2 MB', speaker: null, desc: 'Roteiro de perguntas e dinâmica para o encontro da semana.' },
    { id: 'd4', title: 'Estudo: Romanos 8 — Filhos e herdeiros', kind: 'pdf', category: 'Estudos', date: '2026-05-05', size: '2,4 MB', speaker: null, desc: 'Apostila de 6 capítulos para estudo individual ou em grupo.' },
    { id: 'd5', title: 'Slides — Encontro de Grupos Caseiros', kind: 'slides', category: 'Grupos Caseiros', date: '2026-05-12', size: '5,8 MB', speaker: null, desc: 'Apresentação para conduzir o encontro na sua casa.' },
    { id: 'd6', title: 'Devocional de Maio — 31 dias na Graça', kind: 'pdf', category: 'Devocionais', date: '2026-05-01', size: '3,1 MB', speaker: null, desc: 'Um devocional curto para cada dia do mês.' },
    { id: 'd7', title: 'Você é parte desse propósito', kind: 'audio', category: 'Pregações', date: '2026-04-27', size: '35 min', speaker: 'Pr. Daniel Moraes', desc: 'Mensagem sobre pertencimento e propósito.' },
  ],
  events: [
    { id: 'e1', title: 'Reunião Geral de Domingo', date: '2026-05-31', time: '10:00', location: 'Rua Ivan Pessoa, 341 — Santíssimo', recurring: 'Todo domingo', desc: 'Nosso encontro de toda a família, com louvor, palavra e comunhão.', highlight: true },
    { id: 'e2', title: 'Grupos Caseiros', date: '2026-06-04', time: '19:30', location: 'Casas em diversos bairros', recurring: 'Toda quarta', desc: 'O coração da nossa convivência. Fale com a gente para encontrar um grupo perto de você.', highlight: false },
    { id: 'e3', title: 'Café com a Família — Novos por aqui', date: '2026-06-08', time: '09:00', location: 'Rua Ivan Pessoa, 341 — Santíssimo', recurring: null, desc: 'Um café simples para quem chegou há pouco conhecer a nossa história e fazer perguntas.', highlight: false },
    { id: 'e4', title: 'Encontro de Oração', date: '2026-06-13', time: '18:00', location: 'Online e presencial', recurring: 'Todo sábado', desc: 'Um tempo para orar juntos pela igreja e pela cidade.', highlight: false },
  ],
};

// ---------- store ----------
function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return JSON.parse(JSON.stringify(SEED));
}
function saveStore(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) {}
}

const StoreContext = createContext(null);

function StoreProvider({ children }) {
  const [data, setData] = useState(loadStore);
  const [isAdmin, setIsAdmin] = useState(() => {
    try { return sessionStorage.getItem(ADMIN_KEY) === '1'; } catch (e) { return false; }
  });

  useEffect(() => { saveStore(data); }, [data]);

  const update = useCallback((fn) => {
    setData((d) => {
      const next = JSON.parse(JSON.stringify(d));
      fn(next);
      return next;
    });
  }, []);

  // ---- posts ----
  const savePost = useCallback((post) => update((d) => {
    const slug = slugify(post.slug || post.title);
    if (post.id) {
      const i = d.posts.findIndex((p) => p.id === post.id);
      if (i >= 0) d.posts[i] = { ...d.posts[i], ...post, slug };
      else d.posts.unshift({ ...post, slug });
    } else {
      d.posts.unshift({ ...post, id: uid(), slug });
    }
  }), [update]);
  const deletePost = useCallback((id) => update((d) => { d.posts = d.posts.filter((p) => p.id !== id); }), [update]);

  // ---- downloads ----
  const saveDownload = useCallback((dl) => update((d) => {
    if (dl.id) {
      const i = d.downloads.findIndex((x) => x.id === dl.id);
      if (i >= 0) d.downloads[i] = { ...d.downloads[i], ...dl };
      else d.downloads.unshift(dl);
    } else d.downloads.unshift({ ...dl, id: uid() });
  }), [update]);
  const deleteDownload = useCallback((id) => update((d) => { d.downloads = d.downloads.filter((x) => x.id !== id); }), [update]);

  // ---- events ----
  const saveEvent = useCallback((ev) => update((d) => {
    if (ev.id) {
      const i = d.events.findIndex((x) => x.id === ev.id);
      if (i >= 0) d.events[i] = { ...d.events[i], ...ev };
      else d.events.unshift(ev);
    } else d.events.unshift({ ...ev, id: uid() });
  }), [update]);
  const deleteEvent = useCallback((id) => update((d) => { d.events = d.events.filter((x) => x.id !== id); }), [update]);

  const login = useCallback((pass) => {
    if (pass === ADMIN_PASS) {
      setIsAdmin(true);
      try { sessionStorage.setItem(ADMIN_KEY, '1'); } catch (e) {}
      return true;
    }
    return false;
  }, []);
  const logout = useCallback(() => {
    setIsAdmin(false);
    try { sessionStorage.removeItem(ADMIN_KEY); } catch (e) {}
  }, []);

  const resetSeed = useCallback(() => setData(JSON.parse(JSON.stringify(SEED))), []);
  const importData = useCallback((obj) => {
    if (obj && obj.posts && obj.downloads && obj.events) { setData(obj); return true; }
    return false;
  }, []);

  const value = {
    data, isAdmin,
    savePost, deletePost,
    saveDownload, deleteDownload,
    saveEvent, deleteEvent,
    login, logout, resetSeed, importData,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
const useStore = () => useContext(StoreContext);

Object.assign(window, {
  StoreProvider, useStore, StoreContext,
  uid, slugify, fmtDate, readingTime, MONTHS, MONTHS_FULL, SEED, ADMIN_PASS,
});
