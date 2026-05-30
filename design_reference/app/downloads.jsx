// app/downloads.jsx — downloads / media library
const { useState: useStateD, useMemo: useMemoD } = React;

const KIND_META = {
  audio:  { label: 'Áudio', icon: 'material-symbols:headphones-outline-rounded', color: 'var(--teal-600)', bg: 'var(--teal-50)', action: 'Ouvir' },
  pdf:    { label: 'PDF', icon: 'material-symbols:picture-as-pdf-outline-rounded', color: '#C0492E', bg: '#FBEDE9', action: 'Baixar' },
  slides: { label: 'Slides', icon: 'material-symbols:slideshow-outline-rounded', color: '#B5851F', bg: '#FAF1DD', action: 'Baixar' },
};

function DownloadRow({ item }) {
  const [hover, setHover] = useStateD(false);
  const m = KIND_META[item.kind] || KIND_META.pdf;
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 20, alignItems: 'center',
      background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '18px 22px',
      boxShadow: hover ? 'var(--shadow-md)' : 'none', transition: 'box-shadow .2s',
    }}>
      <div style={{ width: 60, height: 60, borderRadius: 16, background: m.bg, display: 'grid', placeItems: 'center' }}>
        <iconify-icon icon={m.icon} style={{ fontSize: 30, color: m.color }}></iconify-icon>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5, flexWrap: 'wrap' }}>
          <Tag tone={item.kind === 'audio' ? 'teal' : item.kind === 'pdf' ? 'sand' : 'sand'}>{item.category}</Tag>
          <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{fmtDate(item.date)}</span>
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.25 }}>{item.title}</h3>
        <p style={{ marginTop: 5, fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</p>
        <div style={{ marginTop: 7, display: 'flex', gap: 16, fontSize: 13, color: 'var(--ink-2)', flexWrap: 'wrap' }}>
          {item.speaker && <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}><iconify-icon icon="material-symbols:person-outline-rounded" style={{ color: 'var(--teal-600)' }}></iconify-icon>{item.speaker}</span>}
          <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}><iconify-icon icon={m.icon} style={{ color: m.color }}></iconify-icon>{m.label} · {item.size}</span>
        </div>
      </div>
      <Btn variant={hover ? 'primary' : 'outline'} size="sm" icon={item.kind === 'audio' ? 'material-symbols:play-arrow-rounded' : 'material-symbols:download-rounded'} onClick={() => alert('Demonstração — o arquivo real será disponibilizado aqui.')}>{m.action}</Btn>
    </div>
  );
}

function Downloads() {
  const ref = useReveal();
  const { data } = useStore();
  const [kind, setKind] = useStateD('all');
  const [cat, setCat] = useStateD('Todas');
  const cats = ['Todas', ...Array.from(new Set(data.downloads.map((d) => d.category)))];
  const kinds = [
    { k: 'all', label: 'Tudo', icon: 'material-symbols:apps-rounded' },
    { k: 'audio', label: 'Pregações', icon: 'material-symbols:headphones-outline-rounded' },
    { k: 'pdf', label: 'PDFs', icon: 'material-symbols:picture-as-pdf-outline-rounded' },
    { k: 'slides', label: 'Slides', icon: 'material-symbols:slideshow-outline-rounded' },
  ];
  const filtered = data.downloads.filter((d) =>
    (kind === 'all' || d.kind === kind) && (cat === 'Todas' || d.category === cat)
  );
  const counts = { audio: data.downloads.filter((d) => d.kind === 'audio').length, pdf: data.downloads.filter((d) => d.kind === 'pdf').length, slides: data.downloads.filter((d) => d.kind === 'slides').length };

  return (
    <div ref={ref}>
      <PageHero tone="teal" eyebrow="Downloads"
        title="Materiais para levar com você"
        sub="Pregações, estudos, devocionais e materiais dos grupos caseiros — para ouvir e estudar a qualquer hora." />

      {/* quick stats */}
      <section style={{ padding: '0', marginTop: -36, position: 'relative', zIndex: 2 }}>
        <Container>
          <div className="dl-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[['audio', 'Pregações em áudio'], ['pdf', 'Estudos e devocionais'], ['slides', 'Materiais de células']].map(([k, label]) => {
              const m = KIND_META[k];
              return (
                <div key={k} className="reveal" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: m.bg, display: 'grid', placeItems: 'center' }}>
                    <iconify-icon icon={m.icon} style={{ fontSize: 28, color: m.color }}></iconify-icon>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, lineHeight: 1 }}>{counts[k]}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 3 }}>{label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section style={{ padding: '48px 0 96px' }}>
        <Container>
          {/* kind tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            {kinds.map((kk) => (
              <button key={kk.k} onClick={() => setKind(kk.k)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5,
                padding: '10px 18px', borderRadius: 99, border: '1.5px solid ' + (kind === kk.k ? 'transparent' : 'var(--border-2)'),
                background: kind === kk.k ? 'var(--navy-800)' : 'transparent', color: kind === kk.k ? '#fff' : 'var(--ink-2)', transition: 'all .2s',
              }}>
                <iconify-icon icon={kk.icon}></iconify-icon> {kk.label}
              </button>
            ))}
          </div>
          {/* category chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 30 }}>
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} style={{
                fontSize: 13.5, fontFamily: 'var(--font-display)', fontWeight: 600, padding: '7px 15px', borderRadius: 99,
                border: 'none', background: cat === c ? 'var(--teal-100)' : 'var(--bg-2)', color: cat === c ? 'var(--teal-700)' : 'var(--muted)', transition: 'all .2s',
              }}>{c}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map((item) => <DownloadRow key={item.id} item={item} />)}
          </div>
          {filtered.length === 0 && <EmptyHint icon="material-symbols:folder-open-outline-rounded" text="Nenhum material com esse filtro ainda." />}
        </Container>
      </section>
    </div>
  );
}

Object.assign(window, { Downloads, DownloadRow, KIND_META });
