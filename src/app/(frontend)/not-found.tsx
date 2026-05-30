import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--nav-h)' }}>
      <div style={{ textAlign: 'center', padding: 32 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 96, color: 'var(--border-2)', lineHeight: 1 }}>404</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginTop: 16, marginBottom: 12 }}>
          Página não encontrada
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>
          Essa página não existe ou foi movida.
        </p>
        <Link href="/" className="btn btn-primary btn-md">
          Voltar para o início
        </Link>
      </div>
    </div>
  )
}
