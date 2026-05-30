// app/ui.jsx — brand mark, navigation, footer, buttons, shared primitives
const { useState: useStateU, useEffect: useEffectU, useRef: useRefU, useCallback: useCallbackU } = React;

// ---------- routing (hash based) ----------
function parseHash() {
  let h = (window.location.hash || '#/').replace(/^#/, '');
  if (!h.startsWith('/')) h = '/' + h;
  const parts = h.split('/').filter(Boolean);
  return { path: h, parts };
}
function useRoute() {
  const [route, setRoute] = useStateU(parseHash());
  useEffectU(() => {
    const on = () => { setRoute(parseHash()); window.scrollTo({ top: 0, behavior: 'auto' }); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
function go(path) { window.location.hash = path; }
function Link({ to, children, className, style, onClick, ...rest }) {
  return (
    <a href={'#' + to} className={className} style={style}
       onClick={(e) => { if (onClick) onClick(e); }} {...rest}>
      {children}
    </a>
  );
}

// ---------- scroll reveal ----------
function useReveal() {
  const ref = useRefU(null);
  useEffectU(() => {
    const els = ref.current ? ref.current.querySelectorAll('.reveal') : [];
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return ref;
}

// ---------- logo ----------
function LogoMark({ size = 40, color = 'currentColor', ring = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      {ring && <circle cx="32" cy="32" r="29" stroke={color} strokeWidth="3.4" />}
      {/* i */}
      <circle cx="24.5" cy="20.5" r="3.4" fill={color} />
      <rect x="21.6" y="27" width="5.8" height="20" rx="2.9" fill={color} />
      {/* heart */}
      <path d="M40.4 47.2c-.5 0-.9-.2-1.2-.5-3.6-3.3-7.8-6.9-7.8-12 0-3 2.3-5.2 5.1-5.2 1.7 0 3.1.8 3.9 2.1.8-1.3 2.2-2.1 3.9-2.1 2.8 0 5.1 2.2 5.1 5.2 0 5.1-4.2 8.7-7.8 12-.3.3-.7.5-1.2.5z" fill={color} />
    </svg>
  );
}
function Logo({ variant = 'dark', stacked = false, size = 40, onLight }) {
  // color resolves: on dark surfaces use white; on light use ink/teal
  const markColor = onLight ? 'var(--teal-600)' : '#fff';
  const word1 = onLight ? 'var(--ink)' : '#fff';
  return (
    <Link to="/" className="logo" style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }} aria-label="Igreja no Rio — início">
      <LogoMark size={size} color={markColor} />
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: .94,
        letterSpacing: '.02em', fontSize: size * 0.42, color: word1, textTransform: 'uppercase',
        display: 'flex', flexDirection: 'column',
      }}>
        <span>Igreja</span>
        <span style={{ color: onLight ? 'var(--teal-600)' : '#fff', opacity: onLight ? 1 : .92 }}>no Rio</span>
      </span>
    </Link>
  );
}

// ---------- buttons ----------
function Btn({ children, to, onClick, variant = 'primary', size = 'md', icon, iconRight, className = '', style, type, disabled }) {
  const sizes = {
    sm: { padding: '9px 16px', fontSize: 14 },
    md: { padding: '13px 24px', fontSize: 15.5 },
    lg: { padding: '17px 32px', fontSize: 17 },
  };
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
    fontFamily: 'var(--font-display)', fontWeight: 600, borderRadius: 'var(--r-pill)',
    border: '2px solid transparent', transition: 'transform .15s ease, box-shadow .2s ease, background .2s ease, color .2s ease',
    textDecoration: 'none', whiteSpace: 'nowrap', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? .55 : 1, ...sizes[size],
  };
  const variants = {
    primary: { background: 'var(--accent)', color: '#063b36', boxShadow: 'var(--shadow-teal)' },
    dark:    { background: 'var(--navy-800)', color: '#fff' },
    light:   { background: '#fff', color: 'var(--ink)', boxShadow: 'var(--shadow-sm)' },
    outline: { background: 'transparent', color: 'var(--ink)', borderColor: 'var(--border-2)' },
    'outline-light': { background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,.45)' },
    ghost:   { background: 'transparent', color: 'var(--teal-700)' },
  };
  const [hover, setHover] = useStateU(false);
  const hoverStyle = hover && !disabled ? { transform: 'translateY(-2px)' } : {};
  const inner = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      {icon && <iconify-icon icon={icon} style={{ fontSize: '1.2em' }}></iconify-icon>}
      {children}
      {iconRight && <iconify-icon icon={iconRight} style={{ fontSize: '1.15em' }}></iconify-icon>}
    </span>
  );
  const props = {
    className, style: { ...base, ...variants[variant], ...hoverStyle, ...style },
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
  };
  if (to) return <a href={'#' + to} {...props}>{inner}</a>;
  return <button type={type || 'button'} onClick={onClick} disabled={disabled} {...props}>{inner}</button>;
}

// ---------- cover art (placeholder imagery driven by a key) ----------
const COVER_STYLES = {
  teal: { bg: 'linear-gradient(135deg, var(--teal-400), var(--teal-600))', fg: '#063b36', icon: 'material-symbols:diversity-3-rounded' },
  navy: { bg: 'linear-gradient(135deg, var(--navy-700), var(--navy-900))', fg: 'rgba(255,255,255,.9)', icon: 'material-symbols:auto-stories-outline-rounded' },
  sand: { bg: 'linear-gradient(135deg, #F3E7D6, #E7D2B6)', fg: '#7a5a2e', icon: 'material-symbols:coffee-outline-rounded' },
};
function CoverArt({ cover = 'teal', label, aspect = '16/10', radius = 'var(--r-lg)', icon }) {
  const s = COVER_STYLES[cover] || COVER_STYLES.teal;
  return (
    <div style={{
      position: 'relative', aspectRatio: aspect, borderRadius: radius, overflow: 'hidden',
      background: s.bg, display: 'grid', placeItems: 'center',
    }}>
      <LogoMark size={'34%'} color={cover === 'sand' ? 'rgba(122,90,46,.22)' : 'rgba(255,255,255,.2)'} ring />
      <iconify-icon icon={icon || s.icon} style={{ position: 'absolute', fontSize: 'min(15vw, 64px)', color: s.fg, opacity: .55 }}></iconify-icon>
      {label && <span style={{
        position: 'absolute', left: 14, bottom: 12, fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: s.fg,
        background: 'rgba(255,255,255,.65)', padding: '4px 10px', borderRadius: 99,
      }}>{label}</span>}
    </div>
  );
}

// ---------- chips / tags ----------
function Tag({ children, tone = 'teal' }) {
  const tones = {
    teal: { bg: 'var(--teal-50)', fg: 'var(--teal-700)' },
    navy: { bg: 'rgba(29,37,50,.07)', fg: 'var(--navy-700)' },
    sand: { bg: '#F4EADA', fg: '#8a6a36' },
    solid: { bg: 'var(--accent)', fg: '#063b36' },
  };
  const t = tones[tone] || tones.teal;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, background: t.bg, color: t.fg,
      fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, letterSpacing: '.03em',
      padding: '5px 12px', borderRadius: 99,
    }}>{children}</span>
  );
}

// ---------- eyebrow heading ----------
function Eyebrow({ children, onDark, tone }) {
  const onTeal = tone === 'teal';
  const txt = onTeal ? 'var(--accent-ink)' : onDark ? 'var(--teal-300)' : 'var(--teal-600)';
  const line = onTeal ? 'var(--accent-ink)' : onDark ? 'var(--teal-400)' : 'var(--teal-500)';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <span style={{ width: 26, height: 2, background: line, borderRadius: 2 }}></span>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: '.14em',
        textTransform: 'uppercase', color: txt,
      }}>{children}</span>
    </div>
  );
}

// ---------- container ----------
function Container({ children, style, narrow }) {
  return <div style={{ width: '100%', maxWidth: narrow ? 760 : 'var(--maxw)', margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>;
}

// ---------- header / nav ----------
const NAV = [
  { to: '/', label: 'Início' },
  { to: '/quem-somos', label: 'Quem Somos' },
  { to: '/cultos', label: 'Encontros' },
  { to: '/blog', label: 'Blog' },
  { to: '/downloads', label: 'Downloads' },
  { to: '/contato', label: 'Contato' },
];
function Header({ route, lightHero }) {
  const [scrolled, setScrolled] = useStateU(false);
  const [open, setOpen] = useStateU(false);
  const { isAdmin } = useStore();
  useEffectU(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffectU(() => { setOpen(false); }, [route.path]);

  const active = (to) => to === '/' ? route.path === '/' : route.path.startsWith(to);
  const onLight = scrolled || lightHero;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50, height: 'var(--nav-h)',
      display: 'flex', alignItems: 'center',
      background: scrolled ? 'rgba(255,255,255,.86)' : 'transparent',
      backdropFilter: scrolled ? 'saturate(160%) blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'background .3s ease, border-color .3s ease',
    }}>
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={38} onLight={onLight} />
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
          {NAV.map((n) => (
            <a key={n.to} href={'#' + n.to} style={{
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15,
              padding: '9px 15px', borderRadius: 99, position: 'relative',
              color: active(n.to) ? (onLight ? 'var(--teal-700)' : '#fff') : (onLight ? 'var(--ink-2)' : 'rgba(255,255,255,.82)'),
              background: active(n.to) ? (onLight ? 'var(--teal-50)' : 'rgba(255,255,255,.14)') : 'transparent',
              transition: 'color .2s, background .2s',
            }}>{n.label}</a>
          ))}
          <a href="#/admin" title="Painel" style={{
            marginLeft: 8, width: 40, height: 40, borderRadius: 99, display: 'grid', placeItems: 'center',
            color: onLight ? 'var(--muted)' : 'rgba(255,255,255,.8)',
            border: '1.5px solid ' + (onLight ? 'var(--border-2)' : 'rgba(255,255,255,.3)'),
          }}>
            <iconify-icon icon={isAdmin ? 'material-symbols:shield-person-outline-rounded' : 'material-symbols:settings-outline-rounded'} style={{ fontSize: 20 }}></iconify-icon>
          </a>
        </nav>
        <button className="nav-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" style={{
          display: 'none', width: 46, height: 46, borderRadius: 12, border: 'none',
          background: onLight ? 'var(--teal-50)' : 'rgba(255,255,255,.16)',
          color: onLight ? 'var(--ink)' : '#fff', placeItems: 'center',
        }}>
          <iconify-icon icon={open ? 'material-symbols:close-rounded' : 'material-symbols:menu-rounded'} style={{ fontSize: 26 }}></iconify-icon>
        </button>
      </Container>

      {open && (
        <div className="nav-mobile" style={{
          position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0, bottom: 0, zIndex: 49,
          background: 'rgba(255,255,255,.98)', backdropFilter: 'blur(8px)', padding: 24,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {NAV.map((n) => (
            <a key={n.to} href={'#' + n.to} style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, padding: '14px 8px',
              color: active(n.to) ? 'var(--teal-600)' : 'var(--ink)',
              borderBottom: '1px solid var(--border)',
            }}>{n.label}</a>
          ))}
          <a href="#/admin" style={{ marginTop: 14, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--muted)', display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <iconify-icon icon="material-symbols:settings-outline-rounded"></iconify-icon> Painel administrativo
          </a>
        </div>
      )}
    </header>
  );
}

// ---------- footer ----------
function Footer() {
  return (
    <footer style={{ background: 'var(--navy-900)', color: 'rgba(255,255,255,.78)', marginTop: 'auto' }}>
      <Container style={{ padding: '64px 24px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          <div style={{ maxWidth: 320 }}>
            <Logo size={42} />
            <p style={{ marginTop: 18, fontSize: 14.5, lineHeight: 1.6, color: 'rgba(255,255,255,.62)' }}>
              Somos parte da igreja na cidade do Rio de Janeiro. Não vamos à igreja — somos a igreja. E você também é parte dessa família.
            </p>
            <p style={{ marginTop: 16, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--teal-400)', letterSpacing: '.02em' }}>#TodosSomosFamília</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: 15, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Navegue</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {NAV.filter((n) => n.to !== '/').map((n) => (
                <a key={n.to} href={'#' + n.to} style={{ fontSize: 14.5, color: 'rgba(255,255,255,.7)' }}
                   onMouseEnter={(e) => e.currentTarget.style.color = 'var(--teal-300)'}
                   onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,.7)'}>{n.label}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: 15, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Encontre-nos</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14.5, color: 'rgba(255,255,255,.7)' }}>
              <span style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <iconify-icon icon="material-symbols:location-on-outline-rounded" style={{ color: 'var(--teal-400)', fontSize: 20, flexShrink: 0 }}></iconify-icon>
                Rua Ivan Pessoa, 341<br />Santíssimo — Rio de Janeiro/RJ
              </span>
              <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <iconify-icon icon="material-symbols:schedule-outline-rounded" style={{ color: 'var(--teal-400)', fontSize: 20 }}></iconify-icon>
                Domingos, 10h
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              {['mdi:instagram', 'mdi:whatsapp', 'mdi:youtube'].map((ic) => (
                <a key={ic} href="#/contato" style={{
                  width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center',
                  background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.85)',
                }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--teal-600)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; }}>
                  <iconify-icon icon={ic} style={{ fontSize: 22 }}></iconify-icon>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.1)', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,.45)' }}>
          <span>© {new Date().getFullYear()} Igreja no Rio. Feito com carinho.</span>
          <span>Rio de Janeiro · Brasil</span>
        </div>
      </Container>
    </footer>
  );
}

// ---------- section header ----------
function SectionHead({ eyebrow, title, sub, onDark, center, style }) {
  return (
    <div style={{ maxWidth: center ? 720 : 640, margin: center ? '0 auto' : 0, textAlign: center ? 'center' : 'left', ...style }}>
      {eyebrow && <div style={{ display: 'flex', justifyContent: center ? 'center' : 'flex-start' }}><Eyebrow onDark={onDark}>{eyebrow}</Eyebrow></div>}
      <h2 style={{ fontSize: 'clamp(30px, 4.4vw, 46px)', fontWeight: 800, color: onDark ? '#fff' : 'var(--ink)' }}>{title}</h2>
      {sub && <p style={{ marginTop: 16, fontSize: 18, lineHeight: 1.6, color: onDark ? 'rgba(255,255,255,.72)' : 'var(--ink-2)' }}>{sub}</p>}
    </div>
  );
}

const css = document.createElement('style');
css.textContent = `
  @media (max-width: 860px) {
    .nav-desktop { display: none !important; }
    .nav-burger { display: grid !important; }
  }
`;
document.head.appendChild(css);

Object.assign(window, {
  useRoute, go, Link, useReveal, LogoMark, Logo, Btn, CoverArt, COVER_STYLES,
  Tag, Eyebrow, Container, Header, Footer, SectionHead, NAV,
});
