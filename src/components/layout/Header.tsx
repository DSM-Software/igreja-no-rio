"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "@/components/ui/LogoMark";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/cultos", label: "Cultos" },
  { href: "/blog", label: "Blog" },
  { href: "/downloads", label: "Downloads" },
  { href: "/contato", label: "Contato" },
];

// Pages where the hero is dark (navy) — header starts transparent/white text
const DARK_HERO_PATHS = ["/"];

export default function Header() {
  const pathname = usePathname();
  const isDarkHero = DARK_HERO_PATHS.includes(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileNavigationId = "mobile-navigation";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = !isDarkHero || scrolled;
  const onLight = solid;

  return (
    <header
      className={`site-header ${solid ? "solid" : "transparent"}`}
      role="banner"
    >
      <div className="header-inner">
        <Link
          href="/"
          aria-label="Igreja no Rio — início"
          className="header-brand"
        >
          <LogoMark onLight={onLight} height={36} />
        </Link>

        <nav aria-label="Navegação principal" className="nav-desktop">
          {NAV_LINKS.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link ${active ? "active" : ""}`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/contato"
            className="btn btn-primary btn-sm"
            style={{ marginInlineStart: 8 }}
          >
            Fale conosco
          </Link>
        </nav>

        <button
          type="button"
          className="nav-burger"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls={mobileNavigationId}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <Icon
            icon={
              menuOpen
                ? "material-symbols:close-rounded"
                : "material-symbols:menu-rounded"
            }
          />
        </button>
      </div>

      <nav
        id={mobileNavigationId}
        className={`nav-mobile ${menuOpen ? "open" : ""}`}
        aria-label="Navegação principal mobile"
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map(({ href, label }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={`mobile-${href}`}
              href={href}
              className={`nav-mobile-link ${active ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          );
        })}
        <Link
          href="/contato"
          className="btn btn-primary btn-sm nav-mobile-cta"
          onClick={() => setMenuOpen(false)}
        >
          Fale conosco
        </Link>
      </nav>
    </header>
  );
}
