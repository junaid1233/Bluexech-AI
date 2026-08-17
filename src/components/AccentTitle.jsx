export function splitAccent(text) {
  const words = String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (words.length === 0) return { lead: '', accent: '' }
  if (words.length <= 2) return { lead: '', accent: words.join(' ') }
  return {
    lead: words.slice(0, -2).join(' '),
    accent: words.slice(-2).join(' '),
  }
}

export function AccentText({ text }) {
  const { lead, accent } = splitAccent(text)
  return (
    <>
      {lead ? `${lead} ` : null}
      <span className="heading-accent">{accent}</span>
    </>
  )
}

export default function AccentTitle({ text, as: Tag = 'h3', className, id }) {
  return (
    <Tag className={className} id={id}>
      <AccentText text={text} />
    </Tag>
  )
}
