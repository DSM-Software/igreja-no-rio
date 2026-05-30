// app/admin.jsx — in-browser CMS: login gate + CRUD + export/import
const { useState: useStateA, useRef: useRefA } = React;

// ---------- form primitives ----------
const aInput = {
  width: '100%', padding: '11px 14px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border-2)',
  background: 'var(--paper)', outline: 'none', fontSize: 14.5, color: 'var(--ink)',
};
function AField({ label, hint, children, wide }) {
  return (
    <label style={{ display: 'block', gridColumn: wide ? '1 / -1' : 'auto' }}>
      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, marginBottom: 6, color: 'var(--ink-2)' }}>{label}</span>
      {children}
      {hint && <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>{hint}</span>}
    </label>
  );
}
function Seg({ value, options, onChange }) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--bg-2)', borderRadius: 'var(--r-md)', padding: 4, gap: 4, flexWrap: 'wrap' }}>
      {options.map((o) => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)} style={{
          border: 'none', borderRadius: 8, padding: '8px 14px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5,
          background: value === o.v ? '#fff' : 'transparent', color: value === o.v ? 'var(--teal-700)' : 'var(--muted)',
          boxShadow: value === o.v ? 'var(--shadow-sm)' : 'none', cursor: 'pointer',
        }}>{o.label}</button>
      ))}
    </div>
  );
}
function Toggle({ value, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!value)} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', padding: 0 }}>
      <span style={{ width: 44, height: 26, borderRadius: 99, background: value ? 'var(--teal-500)' : 'var(--border-2)', position: 'relative', transition: 'background .2s' }}>
        <span style={{ position: 'absolute', top: 3, left: value ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: 'var(--shadow-sm)' }}></span>
      </span>
      {label && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{label}</span>}
    </button>
  );
}

// ---------- login gate ----------
function AdminGate() {
  const { login } = useStore();
  const [pass, setPass] = useStateA('');
  const [err, setErr] = useStateA(false);
  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-h))', display: 'grid', placeItems: 'center', padding: 24, marginTop: 'calc(-1 * var(--nav-h))', paddingTop: 'var(--nav-h)', background: 'var(--navy-800)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(800px 500px at 50% 0%, rgba(69,192,180,.18), transparent)', pointerEvents: 'none' }}></div>
      <form onSubmit={(e) => { e.preventDefault(); if (!login(pass.trim())) { setErr(true); setPass(''); } }} style={{
        position: 'relative', background: '#fff', borderRadius: 'var(--r-2xl)', padding: '42px 38px', width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-lg)', textAlign: 'center',
      }}>
        <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--teal-50)', display: 'grid', placeItems: 'center', margin: '0 auto' }}>
          <LogoMark size={42} color="var(--teal-600)" />
        </div>
        <h2 style={{ marginTop: 22, fontSize: 26, fontWeight: 800 }}>Painel da Igreja</h2>
        <p style={{ marginTop: 8, fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.5 }}>Área para gerenciar blog, downloads e eventos.</p>
        <input type="password" value={pass} autoFocus onChange={(e) => { setPass(e.target.value); setErr(false); }}
          placeholder="Senha de acesso" style={{ ...aInput, marginTop: 24, textAlign: 'center', borderColor: err ? 'var(--color-danger, #d44)' : 'var(--border-2)' }} />
        {err && <p style={{ color: '#c0392b', fontSize: 13, marginTop: 8 }}>Senha incorreta. Tente novamente.</p>}
        <div style={{ marginTop: 18 }}><Btn type="submit" size="lg" icon="material-symbols:lock-open-outline-rounded" style={{ width: '100%' }}>Entrar</Btn></div>
        <p style={{ marginTop: 18, fontSize: 12.5, color: 'var(--muted-2)' }}>Demonstração · senha: <strong style={{ color: 'var(--ink-2)' }}>familia</strong></p>
      </form>
    </div>
  );
}

// ---------- editors ----------
const EMPTY_POST = { title: '', category: 'Devocional', serie: '', serieParte: '', author: 'Pr. Daniel Moraes', date: new Date().toISOString().slice(0, 10), cover: 'teal', excerpt: '', tags: '', body: '', published: true };
const EMPTY_DL = { title: '', kind: 'audio', category: 'Pregações', date: new Date().toISOString().slice(0, 10), size: '', speaker: '', desc: '' };
const EMPTY_EV = { title: '', date: new Date().toISOString().slice(0, 10), time: '19:30', location: '', recurring: '', desc: '', highlight: false };

function Drawer({ title, onClose, onSave, children, saveLabel = 'Salvar' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(22,29,41,.45)', backdropFilter: 'blur(2px)' }}></div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(); }} style={{
        position: 'relative', width: 'min(560px, 100%)', background: 'var(--bg)', height: '100%', overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ position: 'sticky', top: 0, background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800 }}>{title}</h3>
          <button type="button" onClick={onClose} style={{ width: 38, height: 38, borderRadius: 10, border: 'none', background: 'var(--bg-2)', display: 'grid', placeItems: 'center' }}>
            <iconify-icon icon="material-symbols:close-rounded" style={{ fontSize: 22 }}></iconify-icon>
          </button>
        </div>
        <div style={{ padding: 28, flex: 1 }}>{children}</div>
        <div style={{ position: 'sticky', bottom: 0, background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '16px 28px', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Btn type="button" variant="outline" onClick={onClose}>Cancelar</Btn>
          <Btn type="submit" icon="material-symbols:check-rounded">{saveLabel}</Btn>
        </div>
      </form>
    </div>
  );
}

function PostEditor({ initial, onClose }) {
  const { savePost } = useStore();
  const [f, setF] = useStateA(initial);
  const s = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Drawer title={initial.id ? 'Editar texto' : 'Novo texto'} onClose={onClose}
      onSave={() => { savePost({ ...f, serieParte: f.serieParte ? Number(f.serieParte) : null, serie: f.serie || null, tags: typeof f.tags === 'string' ? f.tags.split(',').map((t) => t.trim()).filter(Boolean) : f.tags }); onClose(); }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <AField label="Título" wide><input required value={f.title} onChange={s('title')} style={aInput} placeholder="Título do texto" /></AField>
        <AField label="Categoria"><Seg value={f.category} onChange={(v) => setF({ ...f, category: v })} options={[{ v: 'Devocional', label: 'Devocional' }, { v: 'Estudo', label: 'Estudo' }]} /></AField>
        <AField label="Capa (cor)"><Seg value={f.cover} onChange={(v) => setF({ ...f, cover: v })} options={[{ v: 'teal', label: 'Turquesa' }, { v: 'navy', label: 'Marinho' }, { v: 'sand', label: 'Areia' }]} /></AField>
        <AField label="Série (opcional)"><input value={f.serie || ''} onChange={s('serie')} style={aInput} placeholder="Ex.: Somos a Igreja" /></AField>
        <AField label="Parte nº"><input type="number" min="1" value={f.serieParte || ''} onChange={s('serieParte')} style={aInput} placeholder="1" /></AField>
        <AField label="Autor"><input value={f.author} onChange={s('author')} style={aInput} /></AField>
        <AField label="Data"><input type="date" value={f.date} onChange={s('date')} style={aInput} /></AField>
        <AField label="Resumo (chamada)" wide><textarea value={f.excerpt} onChange={s('excerpt')} rows={2} style={{ ...aInput, resize: 'vertical' }} placeholder="Frase de abertura que aparece nos cards." /></AField>
        <AField label="Conteúdo" hint="Use ## para subtítulos, > para citação, **negrito**, e 1. 2. para listas." wide>
          <textarea value={f.body} onChange={s('body')} rows={12} style={{ ...aInput, resize: 'vertical', fontFamily: 'var(--font-body)', lineHeight: 1.6 }} placeholder="Escreva o texto aqui…" />
        </AField>
        <AField label="Tags (separadas por vírgula)" wide><input value={typeof f.tags === 'string' ? f.tags : (f.tags || []).join(', ')} onChange={s('tags')} style={aInput} placeholder="graça, família" /></AField>
        <AField label="" wide><Toggle value={f.published} onChange={(v) => setF({ ...f, published: v })} label={f.published ? 'Publicado (visível no site)' : 'Rascunho (oculto)'} /></AField>
      </div>
    </Drawer>
  );
}

function DownloadEditor({ initial, onClose }) {
  const { saveDownload } = useStore();
  const [f, setF] = useStateA(initial);
  const s = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Drawer title={initial.id ? 'Editar material' : 'Novo material'} onClose={onClose} onSave={() => { saveDownload(f); onClose(); }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <AField label="Título" wide><input required value={f.title} onChange={s('title')} style={aInput} /></AField>
        <AField label="Tipo"><Seg value={f.kind} onChange={(v) => setF({ ...f, kind: v })} options={[{ v: 'audio', label: 'Áudio' }, { v: 'pdf', label: 'PDF' }, { v: 'slides', label: 'Slides' }]} /></AField>
        <AField label="Categoria"><input value={f.category} onChange={s('category')} style={aInput} placeholder="Pregações, Estudos…" /></AField>
        <AField label="Data"><input type="date" value={f.date} onChange={s('date')} style={aInput} /></AField>
        <AField label="Tamanho / duração"><input value={f.size} onChange={s('size')} style={aInput} placeholder="38 min · 2,4 MB" /></AField>
        <AField label="Pregador (opcional)" wide><input value={f.speaker || ''} onChange={s('speaker')} style={aInput} placeholder="Pr. Daniel Moraes" /></AField>
        <AField label="Descrição" wide><textarea value={f.desc} onChange={s('desc')} rows={3} style={{ ...aInput, resize: 'vertical' }} /></AField>
      </div>
    </Drawer>
  );
}

function EventEditor({ initial, onClose }) {
  const { saveEvent } = useStore();
  const [f, setF] = useStateA(initial);
  const s = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Drawer title={initial.id ? 'Editar evento' : 'Novo evento'} onClose={onClose} onSave={() => { saveEvent({ ...f, recurring: f.recurring || null }); onClose(); }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <AField label="Título" wide><input required value={f.title} onChange={s('title')} style={aInput} /></AField>
        <AField label="Data"><input type="date" value={f.date} onChange={s('date')} style={aInput} /></AField>
        <AField label="Horário"><input value={f.time} onChange={s('time')} style={aInput} placeholder="10:00" /></AField>
        <AField label="Local" wide><input value={f.location} onChange={s('location')} style={aInput} placeholder="Rua Ivan Pessoa, 341 — Santíssimo" /></AField>
        <AField label="Recorrência (opcional)"><input value={f.recurring || ''} onChange={s('recurring')} style={aInput} placeholder="Todo domingo" /></AField>
        <AField label=""><div style={{ paddingTop: 24 }}><Toggle value={f.highlight} onChange={(v) => setF({ ...f, highlight: v })} label="Destaque na home" /></div></AField>
        <AField label="Descrição" wide><textarea value={f.desc} onChange={s('desc')} rows={3} style={{ ...aInput, resize: 'vertical' }} /></AField>
      </div>
    </Drawer>
  );
}

// ---------- list rows ----------
function AdminRow({ left, title, meta, badges, onEdit, onDelete }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'center', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '14px 18px' }}>
      {left}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>{badges}{meta}</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onEdit} title="Editar" style={iconBtn}><iconify-icon icon="material-symbols:edit-outline-rounded" style={{ fontSize: 20 }}></iconify-icon></button>
        <button onClick={onDelete} title="Excluir" style={{ ...iconBtn, color: '#c0392b' }}><iconify-icon icon="material-symbols:delete-outline-rounded" style={{ fontSize: 20 }}></iconify-icon></button>
      </div>
    </div>
  );
}
const iconBtn = { width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', display: 'grid', placeItems: 'center', color: 'var(--ink-2)', cursor: 'pointer' };

// ---------- admin panel ----------
function AdminPanel() {
  const { data, isAdmin, logout, deletePost, deleteDownload, deleteEvent, resetSeed, importData } = useStore();
  const [tab, setTab] = useStateA('posts');
  const [editor, setEditor] = useStateA(null); // {type, initial}
  const fileRef = useRefA(null);

  if (!isAdmin) return <AdminGate />;

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'igreja-no-rio-conteudo.json'; a.click();
    URL.revokeObjectURL(url);
  };
  const onImport = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => { try { if (!importData(JSON.parse(r.result))) alert('Arquivo inválido.'); } catch (x) { alert('Não foi possível ler o arquivo.'); } };
    r.readAsText(file); e.target.value = '';
  };

  const tabs = [
    { k: 'posts', label: 'Blog', icon: 'material-symbols:article-outline-rounded', n: data.posts.length },
    { k: 'downloads', label: 'Downloads', icon: 'material-symbols:download-rounded', n: data.downloads.length },
    { k: 'events', label: 'Eventos', icon: 'material-symbols:event-outline-rounded', n: data.events.length },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - var(--nav-h))' }}>
      {/* admin bar */}
      <div style={{ background: 'var(--navy-800)', color: '#fff', marginTop: 'calc(-1 * var(--nav-h))', paddingTop: 'calc(var(--nav-h) + 32px)' }}>
        <Container style={{ padding: '0 24px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', background: 'rgba(69,192,180,.18)', color: 'var(--teal-300)', padding: '5px 12px', borderRadius: 99, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12.5, letterSpacing: '.04em' }}>
                <iconify-icon icon="material-symbols:shield-person-outline-rounded"></iconify-icon> Painel administrativo
              </div>
              <h1 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#fff', marginTop: 14 }}>Gerencie o conteúdo</h1>
              <p style={{ marginTop: 8, color: 'rgba(255,255,255,.7)', fontSize: 15.5 }}>Tudo que você publicar aqui aparece no site na hora. Salvo neste navegador.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Btn variant="outline-light" size="sm" icon="material-symbols:upload-rounded" onClick={() => fileRef.current && fileRef.current.click()}>Importar</Btn>
              <Btn variant="outline-light" size="sm" icon="material-symbols:download-rounded" onClick={exportJSON}>Exportar</Btn>
              <Btn variant="outline-light" size="sm" icon="material-symbols:logout-rounded" onClick={logout}>Sair</Btn>
              <input ref={fileRef} type="file" accept="application/json" onChange={onImport} style={{ display: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
            {tabs.map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15,
                padding: '11px 20px', borderRadius: 'var(--r-md) var(--r-md) 0 0', border: 'none',
                background: tab === t.k ? 'var(--bg)' : 'rgba(255,255,255,.08)', color: tab === t.k ? 'var(--ink)' : 'rgba(255,255,255,.82)',
              }}>
                <iconify-icon icon={t.icon}></iconify-icon> {t.label}
                <span style={{ background: tab === t.k ? 'var(--teal-100)' : 'rgba(255,255,255,.16)', color: tab === t.k ? 'var(--teal-700)' : '#fff', borderRadius: 99, fontSize: 12, padding: '1px 8px', fontWeight: 700 }}>{t.n}</span>
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Container style={{ padding: '32px 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>
            {tab === 'posts' ? 'Textos do blog' : tab === 'downloads' ? 'Materiais para download' : 'Eventos e agenda'}
          </h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="ghost" size="sm" icon="material-symbols:restart-alt-rounded" onClick={() => { if (confirm('Restaurar o conteúdo de exemplo? Suas alterações locais serão perdidas.')) resetSeed(); }}>Restaurar exemplo</Btn>
            <Btn size="sm" icon="material-symbols:add-rounded" onClick={() => setEditor({ type: tab, initial: tab === 'posts' ? { ...EMPTY_POST } : tab === 'downloads' ? { ...EMPTY_DL } : { ...EMPTY_EV } })}>
              {tab === 'posts' ? 'Novo texto' : tab === 'downloads' ? 'Novo material' : 'Novo evento'}
            </Btn>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tab === 'posts' && data.posts.map((p) => (
            <AdminRow key={p.id}
              left={<div style={{ width: 54, height: 54, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}><CoverArt cover={p.cover} aspect="1/1" radius="0" /></div>}
              title={p.title}
              badges={<>
                <Tag tone={catTone(p.category)}>{p.category}</Tag>
                {!p.published && <Tag tone="navy">Rascunho</Tag>}
                {p.serie && <span style={{ color: 'var(--muted)' }}>Série {p.serie}</span>}
              </>}
              meta={<span>· {fmtDate(p.date)}</span>}
              onEdit={() => setEditor({ type: 'posts', initial: { ...p, tags: (p.tags || []).join(', ') } })}
              onDelete={() => { if (confirm('Excluir “' + p.title + '”?')) deletePost(p.id); }} />
          ))}

          {tab === 'downloads' && data.downloads.map((d) => {
            const m = KIND_META[d.kind] || KIND_META.pdf;
            return (
              <AdminRow key={d.id}
                left={<div style={{ width: 54, height: 54, borderRadius: 12, background: m.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}><iconify-icon icon={m.icon} style={{ fontSize: 26, color: m.color }}></iconify-icon></div>}
                title={d.title}
                badges={<><Tag tone="teal">{d.category}</Tag><span style={{ color: 'var(--muted)' }}>{m.label} · {d.size}</span></>}
                meta={<span>· {fmtDate(d.date)}</span>}
                onEdit={() => setEditor({ type: 'downloads', initial: { ...d } })}
                onDelete={() => { if (confirm('Excluir “' + d.title + '”?')) deleteDownload(d.id); }} />
            );
          })}

          {tab === 'events' && data.events.map((e) => (
            <AdminRow key={e.id}
              left={<div style={{ width: 54, height: 54, borderRadius: 12, background: 'var(--teal-50)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <div style={{ textAlign: 'center', lineHeight: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, color: 'var(--teal-700)' }}>{new Date(e.date + 'T12:00').getDate()}</div>
                  <div style={{ fontSize: 9.5, textTransform: 'uppercase', color: 'var(--teal-600)' }}>{MONTHS[new Date(e.date + 'T12:00').getMonth()]}</div>
                </div>
              </div>}
              title={e.title}
              badges={<>{e.highlight && <Tag tone="solid">Destaque</Tag>}{e.recurring && <Tag tone="teal">{e.recurring}</Tag>}</>}
              meta={<span>· {e.time} · {e.location}</span>}
              onEdit={() => setEditor({ type: 'events', initial: { ...e } })}
              onDelete={() => { if (confirm('Excluir “' + e.title + '”?')) deleteEvent(e.id); }} />
          ))}
        </div>
      </Container>

      {editor && editor.type === 'posts' && <PostEditor initial={editor.initial} onClose={() => setEditor(null)} />}
      {editor && editor.type === 'downloads' && <DownloadEditor initial={editor.initial} onClose={() => setEditor(null)} />}
      {editor && editor.type === 'events' && <EventEditor initial={editor.initial} onClose={() => setEditor(null)} />}
    </div>
  );
}

Object.assign(window, { AdminPanel, AdminGate });
