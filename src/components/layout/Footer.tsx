import Link from "next/link";
import LogoMark from "@/components/ui/LogoMark";

const NAV = [
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/cultos", label: "Cultos" },
  { href: "/blog", label: "Blog" },
  { href: "/downloads", label: "Downloads" },
  { href: "/contato", label: "Contato" },
  { href: "/privacidade", label: "Privacidade" },
];

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <Link
              href="/"
              aria-label="Igreja no Rio — início"
              className="footer-brand-link"
            >
              <LogoMark onLight={false} height={32} />
            </Link>
            <p className="footer-body-copy">
              Uma comunidade cristã no coração de Santíssimo, Rio de Janeiro.
            </p>
          </div>

          <div className="footer-col">
            <h4>Navegação</h4>
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h4>Endereço</h4>
            <p>Rua Ivan Pessoa, 341</p>
            <p>Santíssimo — Rio de Janeiro, RJ</p>
            <p className="footer-contact-line footer-contact-top">
              <a href="mailto:contato@igrejanorio.com">
                contato@igrejanorio.com
              </a>
            </p>
            <p className="footer-contact-line">Domingos às 10h</p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Igreja no Rio. Todos os direitos
            reservados.
          </span>
          <span className="footer-meta">
            <Link href="/privacidade">Política de Privacidade</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
