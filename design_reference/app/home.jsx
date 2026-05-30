// app/home.jsx — Home page with 3 switchable variations + shared sections
const { useMemo: useMemoH } = React;

// ============ shared section pieces ============

function GruposFeature({ accent }) {
  return (
    <section style={{ padding: '92px 0' }}>
      <Container>
        <div className="grupos-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 56, alignItems: 'center' }}>
          <div className="reveal">
            <Eyebrow>O coração da nossa convivência</Eyebrow>
            <h2 style={{ fontSize: 'clamp(30px,4.2vw,48px)', fontWeight: 800, lineHeight: 1.02 }}>
              A fé não cabe<br />numa fileira.<br /><span style={{ color: 'var(--teal-600)' }}>Cabe numa mesa.</span>
            </h2>
            <p style={{ marginTop: 22, fontSize: 18, lineHeight: 1.65, color: 'var(--ink-2)', maxWidth: 480 }}>
              Celebramos juntos aos domingos, mas a ênfase do nosso relacionamento está nos <strong style={{ color: 'var(--ink)' }}>grupos caseiros</strong> — encontros simples, em casas espalhadas pela cidade, onde ninguém é anônimo.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
              <Btn to="/cultos" icon="material-symbols:home-outline-rounded">Encontrar um grupo</Btn>
              <Btn to="/quem-somos" variant="outline" iconRight="material-symbols:arrow-forward-rounded">Nossa história</Btn>
            </div>
          </div>
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon: 'material-symbols:groups-2-outline-rounded', t: 'Proximidade', d: 'Ninguém é número numa sala de estar.' },
              { icon: 'material-symbols:volunteer-activism-outline-rounded', t: 'Cuidado mútuo', d: 'As necessidades aparecem e são atendidas.' },
              { icon: 'material-symbols:menu-book-outline-rounded', t: 'Palavra viva', d: 'A Bíblia estudada perto da vida real.' },
              { icon: 'material-symbols:diversity-1-rounded', t: 'Família', d: 'Você não visita. Você pertence.' },
            ].map((c, i) => (
              <div key={i} style={{
                background: i % 3 === 0 ? 'var(--navy-800)' : '#fff', color: i % 3 === 0 ? '#fff' : 'var(--ink)',
                borderRadius: 'var(--r-xl)', padding: '26px 22px', boxShadow: 'var(--shadow-md)',
                border: i % 3 === 0 ? 'none' : '1px solid var(--border)',
                marginTop: i % 2 === 1 ? 28 : 0,
              }}>
                <iconify-icon icon={c.icon} style={{ fontSize: 34, color: i % 3 === 0 ? 'var(--teal-400)' : 'var(--teal-600)' }}></iconify-icon>
                <h4 style={{ marginTop: 14, fontSize: 19, fontWeight: 700, color: i % 3 === 0 ? '#fff' : 'var(--ink)' }}>{c.t}</h4>
                <p style={{ marginTop: 7, fontSize: 14.5, lineHeight: 1.55, color: i % 3 === 0 ? 'rgba(255,255,255,.72)' : 'var(--muted)' }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function HorariosStrip() {
  const { data } = useStore();
  const main = data.events.find((e) => e.highlight) || data.events[0];
  return (
    <section style={{ padding: '0 0 92px' }}>
      <Container>
        <div className="reveal" style={{
          background: 'linear-gradient(120deg, var(--teal-500), var(--teal-600))',
          borderRadius: 'var(--r-2xl)', padding: 'clamp(34px,5vw,60px)', color: '#063b36',
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center',
          boxShadow: 'var(--shadow-teal)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -40, top: -40, opacity: .12 }}>
            <LogoMark size={260} color="#063b36" />
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .7 }}>Nos vemos por aqui</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, marginTop: 12, color: '#063b36' }}>
              Reunião geral<br />todo domingo, 10h
            </h2>
            <p style={{ marginTop: 14, fontSize: 17, lineHeight: 1.5, maxWidth: 420, color: 'rgba(6,59,54,.82)' }}>
              Rua Ivan Pessoa, 341 — Santíssimo, Rio de Janeiro. Chegue como puder. Você estará entre família.
            </p>
            <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Btn to="/cultos" variant="dark" icon="material-symbols:map-outline-rounded">Como chegar</Btn>
              <Btn to="/contato" variant="light" iconRight="material-symbols:arrow-forward-rounded">Quero uma visita</Btn>
            </div>
          </div>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.events.slice(0, 3).map((e) => (
              <div key={e.id} style={{ background: 'rgba(255,255,255,.92)', borderRadius: 'var(--r-lg)', padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--teal-50)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <iconify-icon icon="material-symbols:calendar-month-outline-rounded" style={{ fontSize: 24, color: 'var(--teal-600)' }}></iconify-icon>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--ink)' }}>{e.title}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>{e.recurring || fmtDate(e.date)} · {e.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function UltimasDoBlog() {
  const { data } = useStore();
  const posts = data.posts.filter((p) => p.published).slice(0, 3);
  return (
    <section style={{ padding: '0 0 96px' }}>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 36 }} className="reveal">
          <SectionHead eyebrow="Palavra para a semana" title="Do nosso blog" />
          <Btn to="/blog" variant="ghost" iconRight="material-symbols:arrow-forward-rounded">Ver tudo</Btn>
        </div>
        <div className="cards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {posts.map((p) => <PostCard key={p.id} post={p} className="reveal" />)}
        </div>
      </Container>
    </section>
  );
}

function CtaBand() {
  return (
    <section style={{ background: 'var(--navy-800)', color: '#fff', padding: '88px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(900px 420px at 80% -10%, rgba(69,192,180,.22), transparent)' }}></div>
      <Container style={{ position: 'relative', textAlign: 'center' }}>
        <div className="reveal" style={{ maxWidth: 720, margin: '0 auto' }}>
          <LogoMark size={56} color="#fff" />
          <h2 style={{ fontSize: 'clamp(30px,4.6vw,52px)', fontWeight: 800, marginTop: 24, color: '#fff' }}>
            Você é parte<br />desse propósito.
          </h2>
          <p style={{ marginTop: 18, fontSize: 19, lineHeight: 1.6, color: 'rgba(255,255,255,.74)' }}>
            Não vamos à igreja — somos a igreja. E você também é parte dessa família. Por isso, está em casa.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 34, flexWrap: 'wrap' }}>
            <Btn to="/contato" size="lg" icon="material-symbols:waving-hand-outline-rounded">Quero visitar</Btn>
            <Btn to="/cultos" size="lg" variant="outline-light" iconRight="material-symbols:arrow-forward-rounded">Ver os encontros</Btn>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ============ HERO variants ============

function HeroV1() {
  return (
    <section style={{ position: 'relative', background: 'var(--navy-800)', color: '#fff', overflow: 'hidden', minHeight: 'calc(100vh - var(--nav-h))', display: 'flex', alignItems: 'center', marginTop: 'calc(-1 * var(--nav-h))', paddingTop: 'var(--nav-h)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(1100px 600px at 78% 0%, rgba(69,192,180,.26), transparent 60%)' }}></div>
      <Container style={{ position: 'relative', padding: '64px 24px' }}>
        <div className="hero1-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 56, alignItems: 'center' }}>
          <div>
            <div className="reveal in"><Eyebrow onDark>Igreja no Rio · Santíssimo</Eyebrow></div>
            <h1 className="reveal in" style={{ fontSize: 'clamp(40px,6.4vw,76px)', fontWeight: 800, lineHeight: .98, color: '#fff', transitionDelay: '.05s' }}>
              Você é parte<br />desse propósito.<br /><span style={{ color: 'var(--teal-400)' }}>Nós também.</span>
            </h1>
            <p className="reveal in" style={{ marginTop: 24, fontSize: 'clamp(17px,2vw,21px)', lineHeight: 1.6, color: 'rgba(255,255,255,.78)', maxWidth: 520, transitionDelay: '.1s' }}>
              Somos uma família de muitos filhos, na cidade do Rio de Janeiro. Aqui você não visita uma organização — você chega em casa.
            </p>
            <div className="reveal in" style={{ display: 'flex', gap: 14, marginTop: 34, flexWrap: 'wrap', transitionDelay: '.15s' }}>
              <Btn to="/cultos" size="lg" icon="material-symbols:schedule-outline-rounded">Domingos, 10h</Btn>
              <Btn to="/quem-somos" size="lg" variant="outline-light" iconRight="material-symbols:arrow-forward-rounded">Quem somos</Btn>
            </div>
          </div>
          <div className="reveal in" style={{ position: 'relative', transitionDelay: '.1s' }}>
            <image-slot id="home-hero-v1" style={{ width: '100%', aspectRatio: '4/5', display: 'block' }} shape="rounded" radius="28" placeholder="Foto de um encontro / abraço (arraste aqui)"></image-slot>
            <div style={{ position: 'absolute', left: -18, bottom: 28, background: '#fff', color: 'var(--ink)', borderRadius: 'var(--r-lg)', padding: '16px 20px', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <LogoMark size={40} color="var(--teal-600)" />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, lineHeight: 1 }}>#TodosSomosFamília</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>Seja bem-vindo</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroV2() {
  // Editorial color-block style (mirrors brand slides)
  return (
    <section style={{ marginTop: 'calc(-1 * var(--nav-h))' }}>
      <div style={{ background: 'var(--teal-500)', color: '#063b36', paddingTop: 'calc(var(--nav-h) + 40px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -60, bottom: -80, opacity: .14 }}><LogoMark size={420} color="#063b36" /></div>
        <Container style={{ position: 'relative', padding: '40px 24px 60px' }}>
          <div className="reveal in" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, letterSpacing: '.16em', textTransform: 'uppercase', opacity: .68 }}>Igreja no Rio</div>
          <h1 className="reveal in" style={{ fontSize: 'clamp(54px,11vw,150px)', fontWeight: 800, lineHeight: .86, color: '#fff', marginTop: 18, transitionDelay: '.05s' }}>
            Seja<br />bem-vindo.
          </h1>
          <p className="reveal in" style={{ marginTop: 26, fontSize: 'clamp(18px,2.4vw,26px)', fontWeight: 600, maxWidth: 640, lineHeight: 1.35, color: '#063b36', transitionDelay: '.1s' }}>
            Não vamos à igreja — <span style={{ color: '#fff' }}>somos a igreja</span>. E você também é parte dessa família.
          </p>
          <div className="reveal in" style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap', transitionDelay: '.15s' }}>
            <Btn to="/cultos" size="lg" variant="dark" icon="material-symbols:schedule-outline-rounded">Nossos encontros</Btn>
            <Btn to="/quem-somos" size="lg" variant="light" iconRight="material-symbols:arrow-forward-rounded">Quem somos</Btn>
          </div>
        </Container>
      </div>
      <div style={{ background: 'var(--navy-800)', color: '#fff' }}>
        <Container style={{ padding: '44px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 28 }}>
            {[
              { k: 'Domingos · 10h', v: 'Reunião geral', i: 'material-symbols:schedule-outline-rounded' },
              { k: 'Santíssimo', v: 'Rua Ivan Pessoa, 341', i: 'material-symbols:location-on-outline-rounded' },
              { k: 'Durante a semana', v: 'Grupos caseiros', i: 'material-symbols:home-outline-rounded' },
            ].map((x, i) => (
              <div key={i} className="reveal in" style={{ display: 'flex', gap: 14, alignItems: 'center', transitionDelay: (i * .06) + 's' }}>
                <iconify-icon icon={x.i} style={{ fontSize: 30, color: 'var(--teal-400)' }}></iconify-icon>
                <div>
                  <div style={{ fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>{x.k}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{x.v}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

function HeroV3() {
  // Image-led, airy & light
  return (
    <section style={{ background: 'var(--bg)', paddingTop: 'calc(var(--nav-h) + 24px)', marginTop: 'calc(-1 * var(--nav-h))' }}>
      <Container style={{ padding: '40px 24px 16px', textAlign: 'center' }}>
        <div className="reveal in" style={{ display: 'flex', justifyContent: 'center' }}><Eyebrow>Igreja no Rio · uma família no Rio de Janeiro</Eyebrow></div>
        <h1 className="reveal in" style={{ fontSize: 'clamp(38px,6.6vw,82px)', fontWeight: 800, lineHeight: .98, maxWidth: 1000, margin: '0 auto', transitionDelay: '.05s' }}>
          É a comunhão que<br />nos <span style={{ color: 'var(--teal-600)' }}>reúne aqui.</span>
        </h1>
        <p className="reveal in" style={{ marginTop: 22, fontSize: 'clamp(17px,2vw,21px)', lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: 600, margin: '22px auto 0', transitionDelay: '.1s' }}>
          Celebramos juntos no Monte do Santíssimo e vivemos a fé de perto, nos grupos caseiros. Venha conhecer a família.
        </p>
        <div className="reveal in" style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap', transitionDelay: '.15s' }}>
          <Btn to="/contato" size="lg" icon="material-symbols:waving-hand-outline-rounded">Quero visitar</Btn>
          <Btn to="/blog" size="lg" variant="outline" iconRight="material-symbols:arrow-forward-rounded">Ler o blog</Btn>
        </div>
      </Container>
      <Container style={{ padding: '34px 24px 0' }}>
        <div className="hero3-collage reveal in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '220px 160px', gap: 16, transitionDelay: '.12s' }}>
          <image-slot id="home-hero-v3-a" style={{ gridRow: '1 / span 2', width: '100%', height: '100%' }} shape="rounded" radius="26" placeholder="Foto vertical do culto"></image-slot>
          <image-slot id="home-hero-v3-b" style={{ gridColumn: '2 / span 2', width: '100%', height: '100%' }} shape="rounded" radius="26" placeholder="Foto panorâmica da congregação"></image-slot>
          <image-slot id="home-hero-v3-c" style={{ width: '100%', height: '100%' }} shape="rounded" radius="26" placeholder="Grupo caseiro"></image-slot>
          <div style={{ background: 'var(--teal-500)', borderRadius: 'var(--r-xl)', display: 'grid', placeItems: 'center', color: '#063b36', padding: 20, textAlign: 'center' }}>
            <div>
              <LogoMark size={44} color="#063b36" />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, marginTop: 10 }}>#TodosSomosFamília</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ============ Home ============
function Home({ variant }) {
  const ref = useReveal();
  const Hero = variant === 2 ? HeroV2 : variant === 3 ? HeroV3 : HeroV1;
  return (
    <div ref={ref}>
      <Hero />
      <QuemSomosIntro />
      <GruposFeature />
      <HorariosStrip />
      <UltimasDoBlog />
      <CtaBand />
    </div>
  );
}

function QuemSomosIntro() {
  return (
    <section style={{ padding: '92px 0 0' }}>
      <Container>
        <div className="reveal" style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto' }}>
          <Eyebrow>Quem somos</Eyebrow>
          <p style={{ fontSize: 'clamp(22px,3vw,34px)', fontFamily: 'var(--font-display)', fontWeight: 600, lineHeight: 1.3, color: 'var(--ink)' }}>
            “O Pai tem um propósito eterno: uma família, de muitos filhos, conformes à imagem de Jesus, para o louvor da Sua glória.”
          </p>
          <p style={{ marginTop: 18, fontSize: 15, color: 'var(--muted)', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '.04em' }}>Romanos 8:29</p>
        </div>
      </Container>
    </section>
  );
}

Object.assign(window, { Home, GruposFeature, HorariosStrip, UltimasDoBlog, CtaBand, QuemSomosIntro });
