import './Hero.css'

export default function Hero() {
  return (
    <section id="home" className="hero" aria-label="Bluexche AI">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
      </div>

      <div className="container hero-layout">
        <div className="hero-copy">
          <p className="hero-brand">Bluexche AI</p>
          <h1>Intelligent IT Solutions for Modern Business</h1>
          <p className="hero-lead">
            We design, build, and secure digital systems that help teams move faster with clarity and confidence.
          </p>
          <div className="hero-ctas">
            <a href="#services" className="btn btn-primary">
              Get Started
            </a>
            <a href="#contact" className="btn btn-ghost">
              Contact
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <svg className="hero-art" viewBox="0 0 560 480" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="panel" x1="80" y1="40" x2="480" y2="440" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0A66FF" />
                <stop offset="1" stopColor="#063A9E" />
              </linearGradient>
              <linearGradient id="screen" x1="160" y1="120" x2="400" y2="320" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E8F0FF" />
                <stop offset="1" stopColor="#9EC0FF" />
              </linearGradient>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="18" />
              </filter>
            </defs>
            <ellipse cx="300" cy="400" rx="180" ry="28" fill="#0A66FF" opacity="0.18" filter="url(#soft)" />
            <rect x="90" y="70" width="380" height="300" rx="28" fill="url(#panel)" />
            <rect x="118" y="98" width="324" height="210" rx="16" fill="url(#screen)" />
            <path d="M160 280h80M160 250h140M160 220h110" stroke="#0A66FF" strokeWidth="8" strokeLinecap="round" opacity="0.55" />
            <circle cx="390" cy="160" r="36" fill="#0A66FF" opacity="0.9" />
            <path d="M378 160h24M390 148v24" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            <rect x="150" y="130" width="120" height="54" rx="12" fill="#fff" opacity="0.85" />
            <rect x="170" y="146" width="56" height="8" rx="4" fill="#0A66FF" opacity="0.35" />
            <rect x="170" y="162" width="80" height="8" rx="4" fill="#0A66FF" opacity="0.2" />
            <path
              className="orbit"
              d="M280 40c90 0 160 50 160 112s-70 112-160 112-160-50-160-112S190 40 280 40z"
              stroke="#0A66FF"
              strokeWidth="2"
              strokeDasharray="6 10"
              opacity="0.35"
            />
            <circle className="node node-a" cx="430" cy="90" r="8" fill="#0A66FF" />
            <circle className="node node-b" cx="120" cy="180" r="6" fill="#084ECC" />
            <circle className="node node-c" cx="460" cy="260" r="7" fill="#0A66FF" />
          </svg>
        </div>
      </div>
    </section>
  )
}
