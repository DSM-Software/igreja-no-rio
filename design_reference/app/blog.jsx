// app/blog.jsx — blog list, post card, single post (lightweight markdown)
const { useState: useStateB, useMemo: useMemoB } = React;

// ---- tiny markdown -> elements (## h, > quote, paragraphs) ----
function renderBody(body) {
  const blocks = (body || '').split(/\n\n+/);
  return blocks.map((b, i) => {
    const t = b.trim();
    if (t.startsWith('## ')) return <h3 key={i} style={{ fontSize: 26, fontWeight: 800, marginTop: 14, color: 'var(--ink)' }}>{t.slice(3)}</h3>;
    if (t.startsWith('> ')) return (
      <blockquote key={i} style={{ margin: 0, padding: '18px 24px', background: 'var(--teal-50)', borderLeft: '4px solid var(--teal-500)', borderRadius: 'var(--r-md)', fontStyle: 'italic', fontSize: 19, lineHeight: 1.55, color: 'var(--accent-ink)' }}>
        {t.slice(2)}
      </blockquote>
    );
    if (/^\d+\.\s/.test(t)) {
      const items = t.split('\n').map((l) => l.replace(/^\d+\.\s/, ''));
      return <ol key={i} style={{ margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 18, lineHeight: 1.6, color: 'var(--ink-2)' }}>{items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ol>;
    }
    return <p key={i} style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--ink-2)' }}>{renderInline(t)}</p>;
  });
}
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => p.startsWith('**') && p.endsWith('**')
    ? <strong key={i} style={{ color: 'var(--ink)', fontWeight: 700 }}>{p.slice(2, -2)}</strong>
    : p);
}

function catTone(cat) { return cat === 'Estudo' ? 'navy' : 'teal'; }

// ---- post card ----
function PostCard({ post, className = '', horizontal }) {
  const [hover, setHover] = useStateB(false);
  return (
    <a href={'#/blog/' + post.slug} className={className}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{
         display: horizontal ? 'grid' : 'flex', gridTemplateColumns: horizontal ? '260px 1fr' : undefined,
         flexDirection: 'column', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)',
         overflow: 'hidden', boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
         transform: hover ? 'translateY(-4px)' : 'none', transition: 'transform .25s ease, box-shadow .25s ease', height: '100%',
       }}>
      <div style={{ position: 'relative' }}>
        <CoverArt cover={post.cover} aspect={horizontal ? '4/3' : '16/10'} radius="0" />
      </div>
      <div style={{ padding: '22px 22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
          <Tag tone={catTone(post.category)}>{post.category}</Tag>
          {post.serie && <span style={{ fontSize: 12.5, color: 'var(--muted)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Série · {post.serie}</span>}
        </div>
        <h3 style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.2, color: hover ? 'var(--teal-700)' : 'var(--ink)', transition: 'color .2s' }}>{post.title}</h3>
        <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.6, color: 'var(--muted)', flex: 1 }}>{post.excerpt}</p>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
          <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{post.author}</span>
          <span>·</span>
          <span>{fmtDate(post.date)}</span>
          <span>·</span>
          <span>{readingTime(post.body)} min</span>
        </div>
      </div>
    </a>
  );
}

// ---- blog list ----
function Blog() {
  const ref = useReveal();
  const { data } = useStore();
  const [filter, setFilter] = useStateB('Todos');
  const published = data.posts.filter((p) => p.published);
  const cats = ['Todos', 'Devocional', 'Estudo'];
  const filtered = filter === 'Todos' ? published : published.filter((p) => p.category === filter);
  const featured = published[0];
  const rest = filtered.filter((p) => filter !== 'Todos' || p.id !== (featured && featured.id));

  return (
    <div ref={ref}>
      <PageHero tone="navy" eyebrow="Blog"
        title="Palavra para a caminhada"
        sub="Devocionais para a semana e estudos bíblicos em série, escritos para a família da Igreja no Rio." />

      {/* featured */}
      {featured && (
        <section style={{ padding: '64px 0 0' }}>
          <Container>
            <a href={'#/blog/' + featured.slug} className="reveal feat-card" style={{
              display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 0, background: 'var(--navy-800)',
              borderRadius: 'var(--r-2xl)', overflow: 'hidden', color: '#fff',
            }}>
              <div style={{ minHeight: 320 }}><CoverArt cover={featured.cover} aspect="auto" radius="0" /></div>
              <div style={{ padding: 'clamp(28px,4vw,48px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                  <Tag tone="solid">Em destaque</Tag>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>{fmtDate(featured.date, true)}</span>
                </div>
                <h2 style={{ fontSize: 'clamp(28px,3.6vw,42px)', fontWeight: 800, color: '#fff', lineHeight: 1.05 }}>{featured.title}</h2>
                <p style={{ marginTop: 16, fontSize: 17, lineHeight: 1.65, color: 'rgba(255,255,255,.74)' }}>{featured.excerpt}</p>
                <div style={{ marginTop: 24 }}><Btn variant="primary" iconRight="material-symbols:arrow-forward-rounded">Ler agora</Btn></div>
              </div>
            </a>
          </Container>
        </section>
      )}

      {/* filters + grid */}
      <section style={{ padding: '56px 0 96px' }}>
        <Container>
          <div style={{ display: 'flex', gap: 10, marginBottom: 34, flexWrap: 'wrap' }}>
            {cats.map((c) => (
              <button key={c} onClick={() => setFilter(c)} style={{
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, padding: '10px 22px',
                borderRadius: 99, border: '1.5px solid ' + (filter === c ? 'transparent' : 'var(--border-2)'),
                background: filter === c ? 'var(--accent)' : 'transparent', color: filter === c ? '#063b36' : 'var(--ink-2)',
                transition: 'all .2s',
              }}>{c}{c !== 'Todos' ? 's' : ''}</button>
            ))}
          </div>
          <div className="cards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {rest.map((p) => <PostCard key={p.id} post={p} className="reveal" />)}
          </div>
          {rest.length === 0 && <EmptyHint icon="material-symbols:menu-book-outline-rounded" text="Nenhum texto nesta categoria ainda." />}
        </Container>
      </section>
    </div>
  );
}

// ---- single post ----
function Post({ slug }) {
  const ref = useReveal();
  const { data } = useStore();
  const post = data.posts.find((p) => p.slug === slug);
  if (!post) return <NotFoundInline label="Texto não encontrado" to="/blog" cta="Voltar ao blog" />;
  const related = data.posts.filter((p) => p.published && p.id !== post.id && (p.serie === post.serie ? !!post.serie : p.category === post.category)).slice(0, 3);
  const seriePosts = post.serie ? data.posts.filter((p) => p.serie === post.serie && p.published).sort((a, b) => (a.serieParte || 0) - (b.serieParte || 0)) : [];

  return (
    <div ref={ref}>
      <article>
        <section style={{ background: 'var(--navy-800)', color: '#fff', marginTop: 'calc(-1 * var(--nav-h))', paddingTop: 'calc(var(--nav-h) + 48px)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(800px 420px at 80% -10%, rgba(69,192,180,.2), transparent)' }}></div>
          <Container narrow style={{ position: 'relative', padding: '12px 24px 56px' }}>
            <a href="#/blog" style={{ display: 'inline-flex', gap: 8, alignItems: 'center', fontSize: 14.5, color: 'rgba(255,255,255,.7)', marginBottom: 26 }}>
              <iconify-icon icon="material-symbols:arrow-back-rounded"></iconify-icon> Blog
            </a>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
              <Tag tone="solid">{post.category}</Tag>
              {post.serie && <Tag tone="navy"><span style={{ color: 'var(--teal-300)' }}>Série · {post.serie}{post.serieParte ? ' · Parte ' + post.serieParte : ''}</span></Tag>}
            </div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, color: '#fff', lineHeight: 1.02 }}>{post.title}</h1>
            <div style={{ marginTop: 22, display: 'flex', gap: 14, alignItems: 'center', fontSize: 14.5, color: 'rgba(255,255,255,.72)' }}>
              <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--teal-500)', color: '#063b36', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{post.author.split(' ').slice(-1)[0][0]}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff' }}>{post.author}</div>
                <div>{fmtDate(post.date, true)} · {readingTime(post.body)} min de leitura</div>
              </div>
            </div>
          </Container>
        </section>

        <section style={{ padding: '56px 0 40px' }}>
          <Container narrow>
            <div className="reveal in" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {renderBody(post.body)}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid var(--border)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {post.tags.map((t) => <Tag key={t} tone="navy">#{t}</Tag>)}
              </div>
            )}
          </Container>
        </section>

        {seriePosts.length > 1 && (
          <section style={{ padding: '20px 0 40px' }}>
            <Container narrow>
              <div style={{ background: 'var(--teal-50)', borderRadius: 'var(--r-xl)', padding: '28px 30px' }}>
                <Eyebrow>Série completa</Eyebrow>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>{post.serie}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {seriePosts.map((sp) => (
                    <a key={sp.id} href={'#/blog/' + sp.slug} style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 'var(--r-md)',
                      background: sp.id === post.id ? '#fff' : 'transparent', border: '1px solid ' + (sp.id === post.id ? 'var(--teal-200)' : 'transparent'),
                    }}>
                      <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--teal-500)', color: '#063b36', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{sp.serieParte}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15.5, color: sp.id === post.id ? 'var(--teal-700)' : 'var(--ink)' }}>{sp.title}</span>
                      {sp.id === post.id && <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--teal-600)', fontWeight: 600 }}>Você está aqui</span>}
                    </a>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        {related.length > 0 && (
          <section style={{ padding: '40px 0 96px', background: '#fff', borderTop: '1px solid var(--border)' }}>
            <Container>
              <SectionHead eyebrow="Continue lendo" title="Talvez você goste" style={{ marginBottom: 32 }} />
              <div className="cards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                {related.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
            </Container>
          </section>
        )}
      </article>
    </div>
  );
}

function EmptyHint({ icon, text }) {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--muted)' }}>
      <iconify-icon icon={icon} style={{ fontSize: 52, color: 'var(--border-2)' }}></iconify-icon>
      <p style={{ marginTop: 12, fontSize: 16 }}>{text}</p>
    </div>
  );
}
function NotFoundInline({ label, to, cta }) {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 40 }}>
      <div>
        <LogoMark size={64} color="var(--border-2)" />
        <h2 style={{ marginTop: 20, fontSize: 28, fontWeight: 800 }}>{label}</h2>
        <div style={{ marginTop: 20 }}><Btn to={to}>{cta}</Btn></div>
      </div>
    </div>
  );
}

Object.assign(window, { Blog, Post, PostCard, renderBody, EmptyHint, NotFoundInline, catTone });
