import Link from 'next/link'
import LogoMark from '@/components/ui/LogoMark'

const NAV = [
  { href: '/quem-somos', label: 'Quem Somos' },
  { href: '/cultos', label: 'Cultos' },
  { href: '/blog', label: 'Blog' },
  { href: '/downloads', label: 'Downloads' },
  { href: '/contato', label: 'Contato' },
]

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-col">
            <LogoMark onLight={false} height={32} />
            <p style={{ marginTop: 16, fontSize: 14, lineHeight: 1.7 }}>
              Uma comunidade cristã no coração de Santíssimo, Rio de Janeiro.
            </p>
          </div>

          {/* Links */}
          <div className="footer-col">
            <h4>Navegação</h4>
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </div>

          {/* Contato */}
          <div className="footer-col">
            <h4>Endereço</h4>
            <p>Rua Ivan Pessoa, 341</p>
            <p>Santíssimo — Rio de Janeiro, RJ</p>
            <p style={{ marginTop: 12 }}>
              <a href="mailto:contato@igrejanorio.com">contato@igrejanorio.com</a>
            </p>
            <p style={{ marginTop: 4 }}>
              Domingos às 10h
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Igreja no Rio. Todos os direitos reservados.</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,.3)' }}>Santíssimo, RJ</span>
        </div>
      </div>
    </footer>
  )
}
