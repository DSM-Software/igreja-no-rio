'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoMark from '@/components/ui/LogoMark'

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/quem-somos', label: 'Quem Somos' },
  { href: '/cultos', label: 'Cultos' },
  { href: '/blog', label: 'Blog' },
  { href: '/downloads', label: 'Downloads' },
  { href: '/contato', label: 'Contato' },
]

// Pages where the hero is dark (navy) — header starts transparent/white text
const DARK_HERO_PATHS = ['/']

export default function Header() {
  const pathname = usePathname()
  const isDarkHero = DARK_HERO_PATHS.includes(pathname)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = !isDarkHero || scrolled
  const onLight = solid

  return (
    <header className={`site-header ${solid ? 'solid' : 'transparent'}`} role="banner">
      <div className="header-inner">
        <Link href="/" aria-label="Igreja no Rio — início">
          <LogoMark onLight={onLight} height={36} />
        </Link>

        <nav aria-label="Navegação principal">
          {NAV_LINKS.map(({ href, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link ${active ? 'active' : ''}`}
              >
                {label}
              </Link>
            )
          })}
          <Link href="/contato" className="btn btn-primary btn-sm" style={{ marginInlineStart: 8 }}>
            Fale conosco
          </Link>
        </nav>
      </div>
    </header>
  )
}
