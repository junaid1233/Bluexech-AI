import './Footer.css'

const LINKEDIN_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8.5h5V24H0V8.5zM8.5 8.5H13v2.1h.06c.63-1.2 2.17-2.46 4.47-2.46 4.78 0 5.66 3.15 5.66 7.24V24h-5v-7.3c0-1.74-.03-3.98-2.43-3.98-2.43 0-2.8 1.9-2.8 3.86V24h-5V8.5z" />
  </svg>
)

const FACEBOOK_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.37 1.41-3.68 3.57-3.68 1.03 0 2.12.18 2.12.18v2.33h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.91h-2.22V22c4.78-.75 8.44-4.91 8.44-9.93z" />
  </svg>
)

const INSTAGRAM_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.52.01-4.76.07-2.24.1-3.27 1.17-3.37 3.37-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.1 2.2 1.13 3.27 3.37 3.37 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c2.23-.1 3.27-1.17 3.37-3.37.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.1-2.2-1.14-3.27-3.37-3.37-1.24-.06-1.61-.07-4.76-.07z" />
    <path d="M12 6.86A5.14 5.14 0 1 0 12 17.14 5.14 5.14 0 0 0 12 6.86zm0 8.47a3.33 3.33 0 1 1 0-6.66 3.33 3.33 0 0 1 0 6.66z" />
    <circle cx="17.34" cy="6.66" r="1.2" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#home" className="footer-logo">
            <img
              className="footer-logo-mark"
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt=""
              width={24}
              height={24}
              decoding="async"
            />
            <span>
              luexech <em>AI</em>
            </span>
          </a>
          <p>Unique AI solutions for modern business - chatbots, document AI, vision, forecasting, and agentic automation.</p>
          <p className="footer-address">Gulshan Hadeed, Karachi, Pakistan</p>
          <div className="socials" aria-label="Social links">
            <a
              href="https://www.linkedin.com/company/bluexech-ai/"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              {LINKEDIN_ICON}
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61586923501415"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              aria-label="Facebook"
              title="Facebook"
            >
              {FACEBOOK_ICON}
            </a>
            <a
              href="https://www.instagram.com/bluexech_ai/"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              aria-label="Instagram"
              title="Instagram"
            >
              {INSTAGRAM_ICON}
            </a>
          </div>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#features">Why Bluexech</a>
            </li>
            <li>
              <a href="#process">How We Work</a>
            </li>
            <li>
              <a href="#testimonials">Testimonials</a>
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
              <a href="#service-ai-chatbots">AI Chatbots</a>
            </li>
            <li>
              <a href="#service-generative-ai">Generative AI</a>
            </li>
            <li>
              <a href="#service-document-ai">Document AI</a>
            </li>
            <li>
              <a href="#service-agentic-automation">Agentic Automation</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li>
              <a href="#portfolio">Portfolio</a>
            </li>
            <li>
              <a href="#blog">Blog</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
            <li>
              <a href="#contact">Privacy Policy</a>
            </li>
            <li>
              <a href="#contact">Terms</a>
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
              <a href="tel:+923092547332">+92 309 2547332</a>
            </li>
            <li>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Gulshan-e-Hadeed%2C+Karachi%2C+Pakistan"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gulshan Hadeed, Karachi, Pakistan
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Bluexech AI. All rights reserved.</p>
      </div>
    </footer>
  )
}
