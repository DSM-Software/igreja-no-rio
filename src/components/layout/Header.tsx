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
  { href: "/agenda", label: "Agenda" },
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
    const closeMenu = window.setTimeout(() => {
      setMenuOpen(false);
    }, 0);

    return () => window.clearTimeout(closeMenu);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = !isDarkHero || scrolled;
  const onLight = solid;
  const desktopNavLink =
    "font-display text-sm font-semibold transition-colors duration-200";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-200 ${
        solid
          ? "border-border bg-white/95 shadow-soft backdrop-blur"
          : "border-transparent bg-transparent"
      }`}
      role="banner"
    >
      <div className="mx-auto flex h-[76px] w-full max-w-content items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          aria-label="Igreja no Rio — início"
          className="inline-flex shrink-0 items-center"
        >
          <LogoMark onLight={onLight} height={36} />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-6 lg:flex"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`${desktopNavLink} ${
                  active
                    ? "text-brand-600"
                    : solid
                      ? "text-ink hover:text-brand-600"
                      : "text-white/90 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/contato"
            className="ml-2 inline-flex h-10 items-center rounded-full bg-brand-500 px-4 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            Fale conosco
          </Link>
        </nav>

        <button
          type="button"
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden ${
            solid
              ? "border-border bg-white text-ink"
              : "border-white/30 bg-white/10 text-white"
          }`}
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
        className={`${
          menuOpen ? "grid" : "hidden"
        } gap-2 border-t border-border bg-white px-4 py-4 lg:hidden`}
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
              className={`rounded-xl px-3 py-2 font-display text-base font-semibold transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink hover:bg-bg hover:text-brand-700"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          );
        })}
        <Link
          href="/contato"
          className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-brand-500 px-4 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          onClick={() => setMenuOpen(false)}
        >
          Fale conosco
        </Link>
      </nav>
    </header>
  );
}
