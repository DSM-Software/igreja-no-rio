// app/pages.jsx — Quem Somos, Encontros (cultos/localização), Contato
const { useState: useStateP } = React;

// shared page header on dark
function PageHero({ eyebrow, title, sub, tone = 'navy' }) {
  const dark = tone === 'navy';
  const bg = dark
    ? 'var(--navy-800)'
    : 'linear-gradient(120deg, var(--teal-500), var(--teal-600))';
  return (
    <section style={{ background: bg, color: dark ? '#fff' : '#063b36', position: 'relative', overflow: 'hidden', marginTop: 'calc(-1 * var(--nav-h))', paddingTop: 'calc(var(--nav-h) + 56px)' }}>
      {dark && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(900px 460px at 82% -10%, rgba(69,192,180,.22), transparent)' }}></div>}
      <div style={{ position: 'absolute', right: -50, bottom: -70, opacity: dark ? .07 : .12 }}><LogoMark size={320} color={dark ? '#fff' : '#063b36'} /></div>
      <Container style={{ position: 'relative', padding: '12px 24px 64px' }}>
        <Eyebrow onDark={dark} tone={dark ? undefined : 'teal'}>{eyebrow}</Eyebrow>
        <h1 style={{ fontSize: 'clamp(38px,6vw,68px)', fontWeight: 800, lineHeight: .98, color: dark ? '#fff' : '#063b36', maxWidth: 820 }}>{title}</h1>
        {sub && <p style={{ marginTop: 20, fontSize: 'clamp(17px,2vw,21px)', lineHeight: 1.6, color: dark ? 'rgba(255,255,255,.76)' : 'rgba(6,59,54,.82)', maxWidth: 640 }}>{sub}</p>}
      </Container>
    </section>
  );
}

// ===================== QUEM SOMOS =====================
function QuemSomos() {
  const ref = useReveal();
  const valores = [
    { i: 'material-symbols:diversity-1-rounded', t: 'Família', d: 'Não somos uma organização que você frequenta. Somos uma casa onde você pertence.' },
    { i: 'material-symbols:menu-book-outline-rounded', t: 'Palavra', d: 'A Bíblia no centro — não como teoria, mas como vida que se vive perto.' },
    { i: 'material-symbols:home-outline-rounded', t: 'Casas', d: 'A ênfase do nosso relacionamento está nos grupos caseiros, durante a semana.' },
    { i: 'material-symbols:favorite-outline-rounded', t: 'Graça', d: 'Você não precisa ser impressionante para ser amado. Aqui se descansa em ser filho.' },
  ];
  return (
    <div ref={ref}>
      <PageHero tone="teal" eyebrow="Quem somos"
        title="Uma família de muitos filhos"
        sub="Somos parte da igreja na cidade do Rio de Janeiro, e celebramos nossos encontros no Monte do Santíssimo." />

      <section style={{ padding: '88px 0' }}>
        <Container>
          <div className="qs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
            <div className="reveal">
              <image-slot id="qs-photo" style={{ width: '100%', aspectRatio: '4/5' }} shape="rounded" radius="28" placeholder="Foto da congregação reunida"></image-slot>
            </div>
            <div className="reveal">
              <Eyebrow>Nossa história</Eyebrow>
              <h2 style={{ fontSize: 'clamp(28px,3.6vw,40px)', fontWeight: 800 }}>Você não está visitando uma organização. Está entre família.</h2>
              <p style={{ marginTop: 20, fontSize: 17.5, lineHeight: 1.7, color: 'var(--ink-2)' }}>
                Nascemos do desejo simples de viver a igreja como ela aparece no Novo Testamento: gente que se reúne no grande encontro e que parte o pão de casa em casa. No domingo celebramos juntos; durante a semana, a vida acontece nos grupos caseiros.
              </p>
              <p style={{ marginTop: 16, fontSize: 17.5, lineHeight: 1.7, color: 'var(--ink-2)' }}>
                <strong style={{ color: 'var(--ink)' }}>Não vamos à igreja — somos a igreja.</strong> E você também é parte dessa família. Por isso, está em casa.
              </p>
              <div style={{ marginTop: 28, padding: '22px 24px', background: 'var(--teal-50)', borderRadius: 'var(--r-lg)', borderLeft: '4px solid var(--teal-500)' }}>
                <p style={{ fontStyle: 'italic', fontSize: 16.5, lineHeight: 1.6, color: 'var(--accent-ink)' }}>
                  “Porque os que dantes conheceu, também os predestinou para serem conformes à imagem de seu Filho, a fim de que ele seja o primogênito entre muitos irmãos.”
                </p>
                <p style={{ marginTop: 10, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--teal-700)' }}>Romanos 8:29</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section style={{ background: '#fff', padding: '88px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <Container>
          <SectionHead center eyebrow="No que acreditamos viver" title="O que nos move" style={{ marginBottom: 48 }} />
          <div className="cards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
            {valores.map((v, i) => (
              <div key={i} className="reveal" style={{ background: 'var(--bg)', borderRadius: 'var(--r-xl)', padding: '30px 26px', border: '1px solid var(--border)' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--teal-50)', display: 'grid', placeItems: 'center' }}>
                  <iconify-icon icon={v.i} style={{ fontSize: 30, color: 'var(--teal-600)' }}></iconify-icon>
                </div>
                <h3 style={{ marginTop: 18, fontSize: 21, fontWeight: 700 }}>{v.t}</h3>
                <p style={{ marginTop: 9, fontSize: 15, lineHeight: 1.6, color: 'var(--muted)' }}>{v.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </div>
  );
}

// ===================== ENCONTROS / CULTOS =====================
function Cultos() {
  const ref = useReveal();
  const { data } = useStore();
  return (
    <div ref={ref}>
      <PageHero tone="navy" eyebrow="Nossos encontros"
        title="Onde e quando nos reunimos"
        sub="Um grande encontro aos domingos e a vida que acontece nas casas durante a semana." />

      <section style={{ padding: '80px 0 40px' }}>
        <Container>
          <div className="enc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="reveal" style={{ background: 'var(--navy-800)', color: '#fff', borderRadius: 'var(--r-2xl)', padding: 'clamp(28px,4vw,44px)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -30, top: -30, opacity: .1 }}><LogoMark size={200} color="#fff" /></div>
              <Tag tone="solid">Todo domingo</Tag>
              <h2 style={{ fontSize: 'clamp(28px,3.4vw,40px)', fontWeight: 800, color: '#fff', marginTop: 16 }}>Reunião Geral</h2>
              <p style={{ marginTop: 12, fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,.74)', maxWidth: 380 }}>
                Nosso encontro de toda a família — louvor, palavra e comunhão. Chegue como puder; há lugar para você.
              </p>
              <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[['material-symbols:schedule-outline-rounded', 'Domingos, às 10h'], ['material-symbols:location-on-outline-rounded', 'Rua Ivan Pessoa, 341 — Santíssimo'], ['material-symbols:directions-car-outline-rounded', 'Estacionamento nas proximidades']].map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 16 }}>
                    <iconify-icon icon={r[0]} style={{ fontSize: 24, color: 'var(--teal-400)' }}></iconify-icon> {r[1]}
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal" style={{ background: 'linear-gradient(135deg, var(--teal-500), var(--teal-600))', color: '#063b36', borderRadius: 'var(--r-2xl)', padding: 'clamp(28px,4vw,44px)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -24, bottom: -24, opacity: .14 }}><LogoMark size={200} color="#063b36" /></div>
              <Tag tone="navy">Durante a semana</Tag>
              <h2 style={{ fontSize: 'clamp(28px,3.4vw,40px)', fontWeight: 800, color: '#063b36', marginTop: 16 }}>Grupos Caseiros</h2>
              <p style={{ marginTop: 12, fontSize: 17, lineHeight: 1.6, color: 'rgba(6,59,54,.82)', maxWidth: 380 }}>
                O coração da nossa convivência. Encontros simples em casas espalhadas pela cidade. É onde a fé deixa de ser evento e vira família.
              </p>
              <div style={{ marginTop: 26 }}>
                <Btn to="/contato" variant="dark" icon="material-symbols:home-outline-rounded">Encontrar um grupo perto de mim</Btn>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Agenda */}
      <section style={{ padding: '40px 0 80px' }}>
        <Container>
          <SectionHead eyebrow="Agenda" title="Próximos encontros" style={{ marginBottom: 32 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {data.events.map((e) => (
              <div key={e.id} className="reveal ev-row" style={{
                display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24, alignItems: 'center',
                background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px 24px',
              }}>
                <div style={{ textAlign: 'center', background: 'var(--teal-50)', borderRadius: 'var(--r-md)', padding: '12px 8px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--teal-700)', lineHeight: 1 }}>{new Date(e.date + 'T12:00').getDate()}</div>
                  <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--teal-600)', marginTop: 4 }}>{MONTHS[new Date(e.date + 'T12:00').getMonth()]}</div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 19, fontWeight: 700 }}>{e.title}</h3>
                    {e.recurring && <Tag>{e.recurring}</Tag>}
                  </div>
                  <p style={{ marginTop: 6, fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.5 }}>{e.desc}</p>
                  <div style={{ marginTop: 8, display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--ink-2)' }}>
                    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><iconify-icon icon="material-symbols:schedule-outline-rounded" style={{ color: 'var(--teal-600)' }}></iconify-icon>{e.time}</span>
                    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><iconify-icon icon="material-symbols:location-on-outline-rounded" style={{ color: 'var(--teal-600)' }}></iconify-icon>{e.location}</span>
                  </div>
                </div>
                <Btn to="/contato" variant="outline" size="sm">Quero ir</Btn>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Localização */}
      <section style={{ background: '#fff', padding: '80px 0', borderTop: '1px solid var(--border)' }}>
        <Container>
          <div className="loc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div className="reveal">
              <Eyebrow>Como chegar</Eyebrow>
              <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 800 }}>Monte do Santíssimo</h2>
              <p style={{ marginTop: 16, fontSize: 17, lineHeight: 1.7, color: 'var(--ink-2)' }}>
                Rua Ivan Pessoa, 341 — Santíssimo, Rio de Janeiro/RJ. Um sítio acolhedor, no alto, onde a família se reúne para celebrar.
              </p>
              <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Btn to="/contato" icon="material-symbols:near-me-outline-rounded">Abrir no mapa</Btn>
                <Btn to="/contato" variant="outline" icon="mdi:whatsapp">Falar no WhatsApp</Btn>
              </div>
            </div>
            <div className="reveal" style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--r-2xl)', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-2)' }}>
              {/* stylised map placeholder */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '36px 36px', opacity: .7 }}></div>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50% 50% 50% 4px', background: 'var(--teal-500)', display: 'grid', placeItems: 'center', margin: '0 auto', transform: 'rotate(45deg)', boxShadow: 'var(--shadow-teal)' }}>
                    <iconify-icon icon="material-symbols:home-rounded" style={{ fontSize: 30, color: '#fff', transform: 'rotate(-45deg)' }}></iconify-icon>
                  </div>
                  <div style={{ marginTop: 18, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>Rua Ivan Pessoa, 341</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>Santíssimo — RJ</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

// ===================== CONTATO =====================
function Contato() {
  const ref = useReveal();
  const [sent, setSent] = useStateP(false);
  const [form, setForm] = useStateP({ nome: '', email: '', assunto: 'Quero visitar', msg: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const canais = [
    { i: 'mdi:whatsapp', t: 'WhatsApp', d: '(21) 90000-0000', tone: 'teal' },
    { i: 'material-symbols:mail-outline-rounded', t: 'E-mail', d: 'ola@igrejanorio.com.br', tone: 'navy' },
    { i: 'mdi:instagram', t: 'Instagram', d: '@igrejanorio', tone: 'teal' },
  ];
  return (
    <div ref={ref}>
      <PageHero tone="navy" eyebrow="Contato"
        title="Conte conosco!"
        sub="Desfrute da comunhão. E nos procure se precisar — seja para uma visita, uma oração ou uma dúvida." />

      <section style={{ padding: '80px 0' }}>
        <Container>
          <div className="contato-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 48 }}>
            <div className="reveal">
              <h2 style={{ fontSize: 'clamp(24px,3vw,32px)', fontWeight: 800 }}>Fale com a família</h2>
              <p style={{ marginTop: 14, fontSize: 16.5, lineHeight: 1.65, color: 'var(--ink-2)' }}>
                Quer visitar pela primeira vez, encontrar um grupo caseiro perto de você ou pedir oração? Escolha o canal que preferir.
              </p>
              <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {canais.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '18px 20px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
                    <div style={{ width: 50, height: 50, borderRadius: 14, display: 'grid', placeItems: 'center', background: c.tone === 'navy' ? 'var(--navy-800)' : 'var(--teal-50)' }}>
                      <iconify-icon icon={c.i} style={{ fontSize: 26, color: c.tone === 'navy' ? 'var(--teal-400)' : 'var(--teal-600)' }}></iconify-icon>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{c.t}</div>
                      <div style={{ fontSize: 14.5, color: 'var(--muted)' }}>{c.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 22, padding: '18px 20px', background: 'var(--teal-50)', borderRadius: 'var(--r-lg)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <iconify-icon icon="material-symbols:location-on-outline-rounded" style={{ fontSize: 24, color: 'var(--teal-600)', flexShrink: 0 }}></iconify-icon>
                <div style={{ fontSize: 14.5, lineHeight: 1.5, color: 'var(--accent-ink)' }}>
                  <strong>Rua Ivan Pessoa, 341</strong><br />Santíssimo — Rio de Janeiro/RJ<br />Domingos, 10h
                </div>
              </div>
            </div>

            <div className="reveal" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-2xl)', padding: 'clamp(26px,4vw,40px)', boxShadow: 'var(--shadow-md)' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                  <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--teal-50)', display: 'grid', placeItems: 'center', margin: '0 auto' }}>
                    <iconify-icon icon="material-symbols:check-rounded" style={{ fontSize: 44, color: 'var(--teal-600)' }}></iconify-icon>
                  </div>
                  <h3 style={{ marginTop: 22, fontSize: 26, fontWeight: 800 }}>Recebemos sua mensagem!</h3>
                  <p style={{ marginTop: 12, fontSize: 16, color: 'var(--muted)', maxWidth: 360, margin: '12px auto 0', lineHeight: 1.6 }}>
                    Em breve alguém da família vai te responder. Será uma alegria te receber.
                  </p>
                  <div style={{ marginTop: 24 }}><Btn variant="outline" onClick={() => { setSent(false); setForm({ nome: '', email: '', assunto: 'Quero visitar', msg: '' }); }}>Enviar outra</Btn></div>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Deixe uma mensagem</h3>
                  <p style={{ fontSize: 14.5, color: 'var(--muted)', marginBottom: 22 }}>Respondemos com carinho, no seu tempo.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Field label="Seu nome"><input required value={form.nome} onChange={set('nome')} placeholder="Como podemos te chamar?" style={inputStyle} /></Field>
                    <Field label="E-mail ou telefone"><input required value={form.email} onChange={set('email')} placeholder="Para a gente te responder" style={inputStyle} /></Field>
                    <Field label="Assunto">
                      <select value={form.assunto} onChange={set('assunto')} style={inputStyle}>
                        <option>Quero visitar</option>
                        <option>Encontrar um grupo caseiro</option>
                        <option>Pedido de oração</option>
                        <option>Outro assunto</option>
                      </select>
                    </Field>
                    <Field label="Mensagem"><textarea value={form.msg} onChange={set('msg')} rows={4} placeholder="Escreva à vontade…" style={{ ...inputStyle, resize: 'vertical' }} /></Field>
                  </div>
                  <div style={{ marginTop: 24 }}><Btn type="submit" size="lg" icon="material-symbols:send-outline-rounded" style={{ width: '100%' }}>Enviar mensagem</Btn></div>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '13px 16px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border-2)',
  background: 'var(--bg)', outline: 'none', fontSize: 15,
};
function Field({ label, children }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5, marginBottom: 7, color: 'var(--ink-2)' }}>{label}</span>
      {children}
    </label>
  );
}

Object.assign(window, { QuemSomos, Cultos, Contato, PageHero, Field, inputStyle });
