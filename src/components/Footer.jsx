import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#home" className="footer-logo">
            Bluexche <em>AI</em>
          </a>
          <p>Intelligent IT solutions for modern business — AI, cloud, security, and custom software.</p>
          <div className="socials" aria-label="Social links">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a
              href="https://wa.me/15550188200"
              target="_blank"
              rel="noreferrer"
              className="social-wa"
            >
              WhatsApp
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
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
              <a href="mailto:hello@bluexche.ai">hello@bluexche.ai</a>
            </li>
            <li>
              <a href="tel:+15550188200">+1 (555) 018-8200</a>
            </li>
            <li>120 Innovation Drive, Austin, TX</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>Bluexche AI</p>
      </div>
    </footer>
  )
}
