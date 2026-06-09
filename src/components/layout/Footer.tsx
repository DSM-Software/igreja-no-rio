import Link from "next/link";
import LogoMark from "@/components/ui/LogoMark";

const NAV = [
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/agenda", label: "Agenda" },
  { href: "/blog", label: "Blog" },
  { href: "/downloads", label: "Downloads" },
  { href: "/contato", label: "Contato" },
  { href: "/privacidade", label: "Privacidade" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg py-14" role="contentinfo">
      <div className="mx-auto w-full max-w-content px-4 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <Link
              href="/"
              aria-label="Igreja no Rio — início"
              className="inline-flex"
            >
              <LogoMark onLight={true} height={32} />
            </Link>
            <p className="max-w-sm text-sm leading-7 text-ink-2">
              Uma comunidade cristã no coração de Santíssimo, Rio de Janeiro.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-ink">
              Navegação
            </h4>
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block text-sm text-ink-2 transition-colors hover:text-brand-700"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="space-y-2 text-sm leading-7 text-ink-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-ink">
              Endereço
            </h4>
            <p>Rua Ivan Pessoa, 341</p>
            <p>Santíssimo — Rio de Janeiro, RJ</p>
            <p className="pt-1">
              <a href="mailto:contato@igrejanorio.com">
                contato@igrejanorio.com
              </a>
            </p>
            <p>Domingos às 10h</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} Igreja no Rio. Todos os direitos
            reservados.
          </span>
          <span>
            <Link
              href="/privacidade"
              className="transition-colors hover:text-brand-700"
            >
              Política de Privacidade
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
