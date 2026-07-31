import { useEffect, useState } from 'react'
import './Header.css'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    if (open) window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)
  const toggle = () => setOpen((v) => !v)

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container header-inner">
        <a href="#home" className="logo" onClick={close} aria-label="Bluexech AI home">
          <span className="logo-mark" aria-hidden="true">
            <img
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt=""
              width={40}
              height={40}
              decoding="async"
            />
          </span>
          <span className="logo-text">
            Bluexech <em>AI</em>
          </span>
        </a>

        <nav className="nav-desktop" aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a href="#contact" className="btn btn-primary header-contact">
            Contact
          </a>
          <button
            type="button"
            className={`menu-toggle ${open ? 'is-active' : ''}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={toggle}
          >
            <span className="menu-line menu-line-thick" />
            <span className="menu-line menu-line-thin" />
          </button>
        </div>
      </div>

      <div
        className={`mobile-nav-overlay ${open ? 'is-open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      <div
        id="mobile-nav"
        className={`mobile-nav ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        aria-label="Mobile menu"
      >
        <nav aria-label="Mobile">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
