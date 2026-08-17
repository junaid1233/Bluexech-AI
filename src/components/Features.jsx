import { useReveal } from '../hooks/useReveal'
import { AccentText } from './AccentTitle'
import './Features.css'

const features = [
  {
    num: '01',
    title: 'Outcome-first delivery',
    desc: 'Every engagement is tied to measurable business results – not vanity demos.',
    icon: 'target',
  },
  {
    num: '02',
    title: 'Senior AI specialists',
    desc: 'AI, automation, vision, and data experts who ship production AI systems.',
    icon: 'users',
  },
  {
    num: '03',
    title: 'Safe AI by default',
    desc: 'Guardrails, human-in-the-loop checks, and data privacy baked into every build.',
    icon: 'shield',
  },
  {
    num: '04',
    title: 'Transparent communication',
    desc: 'Clear milestones, demos, and ownership so you always know what’s next.',
    icon: 'chat',
  },
  {
    num: '05',
    title: 'Scalable AI architecture',
    desc: 'Pipelines and agents designed to grow with data volume, channels, and use cases.',
    icon: 'layers',
  },
  {
    num: '06',
    title: 'Long-term partnership',
    desc: 'Support, iteration, and guidance after launch – not a one-and-done handoff.',
    icon: 'handshake',
  },
]

const proofs = [
  {
    title: 'Measurable impact',
    desc: 'Results you can track and prove.',
    icon: 'chart',
  },
  {
    title: 'Faster time to value',
    desc: 'Proven frameworks that move quickly.',
    icon: 'clock',
  },
  {
    title: 'Secure & compliant',
    desc: 'Enterprise-grade security and privacy.',
    icon: 'lock',
  },
  {
    title: 'Partner, not vendor',
    desc: 'We win when you win.',
    icon: 'users',
  },
]

function Icon({ name }) {
  const common = {
    className: 'why-glyph',
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    preserveAspectRatio: 'xMidYMid meet',
    'aria-hidden': true,
  }

  switch (name) {
    case 'target':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2v2.5M22 12h-2.5M12 22v-2.5M2 12h2.5" />
        </svg>
      )
    case 'users':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="16.2" cy="9" r="2.3" />
          <path d="M3.6 19a5.4 5.4 0 0 1 10.8 0" />
          <path d="M14.2 19a4.4 4.4 0 0 1 6.2 0" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 20 7v5c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V7l8-4z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    case 'chat':
      return (
        <svg {...common}>
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          <circle cx="9" cy="11" r="0.85" fill="currentColor" stroke="none" />
          <circle cx="12" cy="11" r="0.85" fill="currentColor" stroke="none" />
          <circle cx="15" cy="11" r="0.85" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'layers':
      return (
        <svg {...common}>
          <path d="m12 3 8.5 4.8L12 12.6 3.5 7.8 12 3z" />
          <path d="m3.5 12 8.5 4.8L20.5 12" />
          <path d="m3.5 16.2 8.5 4.8 8.5-4.8" />
        </svg>
      )
    case 'handshake':
      return (
        <svg {...common}>
          <path d="M8 13 5.2 10.2A2.4 2.4 0 0 1 8.6 6.8L12 10.2l3.4-3.4a2.4 2.4 0 0 1 3.4 3.4L16 13" />
          <path d="m8 13 2.4 2.4a2 2 0 0 0 2.8 0L16 13" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...common}>
          <path d="M4 18V6" />
          <path d="M4 18h16" />
          <path d="m5 13 4.2-4.2 3.2 2.6L19 6" />
          <path d="M15 6h4v4" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...common}>
          <rect x="5.5" y="11" width="13" height="9.5" rx="2" />
          <path d="M8.5 11V8.2a3.5 3.5 0 0 1 7 0V11" />
        </svg>
      )
    default:
      return null
  }
}

export default function Features() {
  const ref = useReveal()

  return (
    <section id="features" className="section why-section" aria-labelledby="why-heading">
      <div className="why-wrap">
        <div className="section-head center">
          <span className="eyebrow">Why Choose Bluexech</span>
          <h2 id="why-heading">
            <AccentText text="Built for teams that need real results" />
          </h2>
          <p>Reliable craft, sharp strategy, and partners who stay accountable after launch.</p>
        </div>

        <div className="why-grid reveal" ref={ref}>
          {features.map((f) => (
            <article key={f.num} className="why-card">
              <div className="why-card-top">
                <span className="why-icon">
                  <Icon name={f.icon} />
                </span>
                <span className="why-num">{f.num}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <div className="why-card-foot">
                <span className="why-line" />
                <span className="why-arrow" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="why-proofs">
          {proofs.map((p) => (
            <div key={p.title} className="why-proof">
              <span className="why-proof-icon">
                <Icon name={p.icon} />
              </span>
              <div>
                <strong>{p.title}</strong>
                <span>{p.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
