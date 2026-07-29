import './Footer.css'

const WA_ICON = (
  <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.3l-.4-.2-4.1.8.8-4-.3-.4A8.7 8.7 0 0 1 7.2 15c0-4.9 4-8.8 8.8-8.8S24.8 10.1 24.8 15 20.9 24.8 16 24.8z" />
    <path d="M21.2 18.4c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.2 7.2 0 0 1-3.5-3.1c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3s-1 1-1 2.4 1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 1.8.8 2.2.7 2.6.6.4-.1 1.3-.5 1.5-1.1.2-.5.2-1 .1-1.1s-.3-.2-.6-.3z" />
  </svg>
)

const LINKEDIN_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8.5h5V24H0V8.5zM8.5 8.5H13v2.1h.06c.63-1.2 2.17-2.46 4.47-2.46 4.78 0 5.66 3.15 5.66 7.24V24h-5v-7.3c0-1.74-.03-3.98-2.43-3.98-2.43 0-2.8 1.9-2.8 3.86V24h-5V8.5z" />
  </svg>
)

const GITHUB_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.55-3.88-1.55-.53-1.36-1.3-1.72-1.3-1.72-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.21 1.79 1.21 1.04 1.8 2.73 1.28 3.4.98.1-.76.41-1.28.74-1.57-2.55-.29-5.23-1.29-5.23-5.73 0-1.27.45-2.3 1.2-3.11-.12-.3-.52-1.5.11-3.12 0 0 .97-.31 3.18 1.19a10.9 10.9 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.64 1.62.24 2.82.12 3.12.75.81 1.2 1.84 1.2 3.11 0 4.45-2.69 5.43-5.25 5.72.42.37.79 1.1.79 2.22 0 1.6-.01 2.89-.01 3.28 0 .31.21.67.8.56A10.53 10.53 0 0 0 23.5 12C23.5 5.74 18.27.5 12 .5z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#home" className="footer-logo">
            Bluexech <em>AI</em>
          </a>
          <p>Intelligent IT solutions for modern business — AI, cloud, security, and custom software.</p>
          <div className="socials" aria-label="Social links">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              {LINKEDIN_ICON}
            </a>
            <a
              href="https://wa.me/923092547332"
              target="_blank"
              rel="noreferrer"
              className="social-icon social-wa"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              {WA_ICON}
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              aria-label="GitHub"
              title="GitHub"
            >
              {GITHUB_ICON}
            </a>
          </div>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#features">Why Us</a>
            </li>
            <li>
              <a href="#portfolio">Portfolio</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Services</h4>
          <ul>
            <li>
              <a href="#services">AI Solutions</a>
            </li>
            <li>
              <a href="#services">Web Development</a>
            </li>
            <li>
              <a href="#services">Cloud & DevOps</a>
            </li>
            <li>
              <a href="#services">Cybersecurity</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Resources</h4>
          <ul>
            <li>
              <a href="#process">How We Work</a>
            </li>
            <li>
              <a href="#pricing">Packages</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
            <li>
              <a href="#testimonials">Testimonials</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li>
              <a href="mailto:support@bluexech.com">support@bluexech.com</a>
            </li>
            <li>
              <a href="tel:+923092547332">03092547332</a>
            </li>
            <li>120 Innovation Drive, Austin, TX</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>Bluexech AI</p>
      </div>
    </footer>
  )
}
