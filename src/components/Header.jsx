import { useEffect, useState } from 'react'
import AuthModal from './AuthModal'
import './Header.css'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#features', label: 'Features' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bluexche_user') || 'null')
    } catch {
      return null
    }
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const sync = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('bluexche_user') || 'null'))
      } catch {
        setUser(null)
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const close = () => setOpen(false)

  const openAuth = (mode) => {
    setAuthMode(mode)
    setAuthOpen(true)
    setOpen(false)
  }

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
        <div className="container header-inner">
          <a href="#home" className="logo" onClick={close} aria-label="Bluexche AI home">
            <span className="logo-mark" aria-hidden="true">
              B
            </span>
            <span className="logo-text">
              Bluexche <em>AI</em>
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
            {user ? (
              <button type="button" className="btn btn-ghost header-login" onClick={() => openAuth('login')}>
                {user.name.split(' ')[0]}
              </button>
            ) : (
              <>
                <button type="button" className="btn btn-ghost header-login" onClick={() => openAuth('login')}>
                  Log in
                </button>
                <button type="button" className="btn btn-primary header-contact" onClick={() => openAuth('signup')}>
                  Sign up
                </button>
              </>
            )}
            <a href="#contact" className="btn btn-ghost header-contact-link">
              Contact
            </a>
            <button
              type="button"
              className={`menu-toggle ${open ? 'is-active' : ''}`}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="menu-line menu-line-thick" />
              <span className="menu-line menu-line-thin" />
            </button>
          </div>
        </div>

        <div id="mobile-nav" className={`mobile-nav ${open ? 'is-open' : ''}`} hidden={!open}>
          <nav aria-label="Mobile">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={close}>
                {link.label}
              </a>
            ))}
            {user ? (
              <button type="button" className="mobile-auth-btn" onClick={() => openAuth('login')}>
                Account ({user.name.split(' ')[0]})
              </button>
            ) : (
              <>
                <button type="button" className="mobile-auth-btn" onClick={() => openAuth('login')}>
                  Log in
                </button>
                <button type="button" className="mobile-auth-btn is-primary" onClick={() => openAuth('signup')}>
                  Sign up
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => {
          setAuthOpen(false)
          try {
            setUser(JSON.parse(localStorage.getItem('bluexche_user') || 'null'))
          } catch {
            setUser(null)
          }
        }}
      />
    </>
  )
}
