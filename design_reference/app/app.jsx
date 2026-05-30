// app/app.jsx — router, tweaks, responsive rules, mount
const { useEffect: useEffectM } = React;

// responsive + misc rules
const respStyle = document.createElement('style');
respStyle.textContent = `
  @media (max-width: 980px) {
    .hero1-grid, .grupos-grid, .qs-grid, .enc-grid, .loc-grid, .contato-grid,
    .feat-card { grid-template-columns: 1fr !important; }
    .cards-3 { grid-template-columns: repeat(2,1fr) !important; }
    .cards-4 { grid-template-columns: repeat(2,1fr) !important; }
    .hero1-grid > div:last-child { order: -1; max-width: 460px; }
    .feat-card > div:first-child { min-height: 240px !important; }
  }
  @media (max-width: 680px) {
    .cards-3, .cards-4, .dl-stats { grid-template-columns: 1fr !important; }
    .ev-row { grid-template-columns: 64px 1fr !important; }
    .ev-row > a { grid-column: 1 / -1; justify-self: start; }
    .hero3-collage { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; }
    .hero3-collage > *:first-child { grid-row: auto !important; grid-column: 1 / -1 !important; aspect-ratio: 16/10; }
    .hero3-collage > *:nth-child(2) { grid-column: 1 / -1 !important; aspect-ratio: 16/9; }
    :root { --nav-h: 64px; }
  }
`;
document.head.appendChild(respStyle);

const TONE_MAP = {
  turquesa: { 400: '#5CC8BD', 500: '#45C0B4', 600: '#2EA89C', 700: '#237F76' },
  profundo: { 400: '#3FB6AC', 500: '#2BA295', 600: '#1E867B', 700: '#16645C' },
  agua:     { 400: '#6BD0C0', 500: '#4FC8B0', 600: '#33A88E', 700: '#247A68' },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "homeVariant": "1",
  "brandTone": "turquesa",
  "roundness": "soft"
}/*EDITMODE-END*/;

function applyTone(tone) {
  const t = TONE_MAP[tone] || TONE_MAP.turquesa;
  const r = document.documentElement;
  r.style.setProperty('--teal-400', t[400]);
  r.style.setProperty('--teal-500', t[500]);
  r.style.setProperty('--teal-600', t[600]);
  r.style.setProperty('--teal-700', t[700]);
  r.style.setProperty('--accent', t[500]);
}
function applyRoundness(mode) {
  const r = document.documentElement;
  const map = mode === 'sharp'
    ? { '--r-md': '6px', '--r-lg': '8px', '--r-xl': '10px', '--r-2xl': '14px', '--r-pill': '8px' }
    : mode === 'round'
    ? { '--r-md': '16px', '--r-lg': '22px', '--r-xl': '30px', '--r-2xl': '40px', '--r-pill': '999px' }
    : { '--r-md': '12px', '--r-lg': '18px', '--r-xl': '26px', '--r-2xl': '34px', '--r-pill': '999px' };
  Object.entries(map).forEach(([k, v]) => r.style.setProperty(k, v));
}

function App() {
  const route = useRoute();
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffectM(() => { applyTone(t.brandTone); }, [t.brandTone]);
  useEffectM(() => { applyRoundness(t.roundness); }, [t.roundness]);

  const variant = Number(t.homeVariant) || 1;
  const parts = route.parts;
  const top = parts[0] || '';

  let page;
  if (top === '' ) page = <Home variant={variant} />;
  else if (top === 'quem-somos') page = <QuemSomos />;
  else if (top === 'cultos') page = <Cultos />;
  else if (top === 'blog' && parts[1]) page = <Post slug={parts[1]} />;
  else if (top === 'blog') page = <Blog />;
  else if (top === 'downloads') page = <Downloads />;
  else if (top === 'contato') page = <Contato />;
  else if (top === 'admin') page = <AdminPanel />;
  else page = <NotFoundInline label="Página não encontrada" to="/" cta="Voltar ao início" />;

  const isAdmin = top === 'admin';
  const lightHero = (top === '' && variant === 3);

  return (
    <React.Fragment>
      <Header route={route} lightHero={lightHero} />
      <main style={{ flex: 1 }}>{page}</main>
      {!isAdmin && <Footer />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Página inicial" />
        <TweakRadio label="Variação da Home" value={t.homeVariant}
          options={[{ value: '1', label: 'Acolhedora' }, { value: '2', label: 'Editorial' }, { value: '3', label: 'Comunidade' }]}
          onChange={(v) => setTweak('homeVariant', v)} />
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, margin: '-4px 2px 6px' }}>
          {variant === 1 && 'Hero escuro com foto e boas-vindas calorosas.'}
          {variant === 2 && 'Blocos de cor com tipografia gigante, no estilo das suas artes.'}
          {variant === 3 && 'Leve e clara, com colagem de fotos da comunidade.'}
        </div>
        <TweakSection label="Identidade" />
        <TweakRadio label="Tom da marca" value={t.brandTone}
          options={[{ value: 'turquesa', label: 'Turquesa' }, { value: 'profundo', label: 'Profundo' }, { value: 'agua', label: 'Verde-água' }]}
          onChange={(v) => setTweak('brandTone', v)} />
        <TweakRadio label="Cantos" value={t.roundness}
          options={[{ value: 'sharp', label: 'Retos' }, { value: 'soft', label: 'Suaves' }, { value: 'round', label: 'Bem redondos' }]}
          onChange={(v) => setTweak('roundness', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

function Root() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
