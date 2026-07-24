import './Hero.css'

export default function Hero() {
  return (
    <section id="home" className="hero" aria-label="Bluexche AI">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
      </div>

      <div className="container hero-layout">
        <div className="hero-copy">
          <p className="hero-brand">Bluexche AI</p>
          <h1>Stop Guessing. Start Growing with AI.</h1>
          <p className="hero-lead">
            We help teams automate workflows, improve efficiency, and move faster with production-grade AI systems.
          </p>
          <div className="hero-ctas">
            <a href="#contact" className="btn btn-primary">
              Book Free Strategy Call
            </a>
            <a href="#services" className="btn btn-ghost">
              Explore Services
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-media">
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Bluexche AI product showcase"
            >
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>

            <div className="hero-media-shade" aria-hidden="true" />

            <svg
              className="hero-neural"
              viewBox="0 0 560 420"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="neuralStroke" x1="40" y1="40" x2="520" y2="380" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#22D3EE" />
                  <stop offset="1" stopColor="#0A66FF" />
                </linearGradient>
                <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="2.5" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g className="neural-links" stroke="url(#neuralStroke)" strokeWidth="1.4" strokeLinecap="round">
                <path className="link link-a" d="M48 70 L140 110 L240 55" strokeDasharray="7 12" />
                <path className="link link-b" d="M480 80 L400 140 L520 200" strokeDasharray="6 11" />
                <path className="link link-c" d="M60 340 L150 300 L80 250" strokeDasharray="8 14" />
              </g>

              <ellipse
                className="orbit-ring"
                cx="280"
                cy="210"
                rx="200"
                ry="125"
                stroke="#0A66FF"
                strokeWidth="1"
                strokeDasharray="3 9"
                opacity="0.28"
              />

              <g filter="url(#nodeGlow)">
                <circle className="node node-a" cx="48" cy="70" r="4.5" fill="#22D3EE" />
                <circle className="node node-b" cx="140" cy="110" r="5.5" fill="#0A66FF" />
                <circle className="node node-c" cx="240" cy="55" r="4" fill="#22D3EE" />
                <circle className="node node-d" cx="480" cy="80" r="4.5" fill="#0A66FF" />
                <circle className="node node-e" cx="400" cy="140" r="5" fill="#22D3EE" />
                <circle className="node node-f" cx="520" cy="200" r="4" fill="#0A66FF" />
                <circle className="node node-g" cx="60" cy="340" r="4.5" fill="#22D3EE" />
                <circle className="node node-h" cx="150" cy="300" r="5" fill="#0A66FF" />
                <circle className="node node-i" cx="80" cy="250" r="4" fill="#22D3EE" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
