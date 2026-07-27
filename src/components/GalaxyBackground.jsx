import './GalaxyBackground.css'

/** Soft site-wide dark base only — AI network lives in Hero only */
export default function GalaxyBackground() {
  return (
    <div className="galaxy" aria-hidden="true">
      <div className="galaxy-orb galaxy-orb-primary" />
      <div className="galaxy-orb galaxy-orb-accent" />
      <div className="galaxy-orb galaxy-orb-purple" />
    </div>
  )
}
