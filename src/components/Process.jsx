import { useReveal } from '../hooks/useReveal'
import './Process.css'

const steps = [
  { title: 'Discover', desc: 'We map goals, constraints, and success metrics with your stakeholders.' },
  { title: 'Design', desc: 'Architecture, UX, and delivery plan are shaped before code ships.' },
  { title: 'Build', desc: 'Iterative sprints with demos, quality gates, and clear ownership.' },
  { title: 'Scale', desc: 'Launch support, monitoring, and continuous improvement after go-live.' },
]

export default function Process() {
  const ref = useReveal()

  return (
    <section id="process" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">How We Work</span>
          <h2>A clear path from idea to impact</h2>
          <p>Four focused stages keep projects moving without surprises.</p>
        </div>
        <ol className="process-list reveal" ref={ref}>
          {steps.map((step, i) => (
            <li key={step.title}>
              <span className="process-index">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
