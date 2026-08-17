import { useCallback, useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { AccentText } from './AccentTitle'
import { blogPosts } from '../data/content'
import './Blog.css'

const SLIDE_MS = 5000

function visibleCount() {
  if (typeof window === 'undefined') return 1
  if (window.innerWidth >= 1000) return 3
  if (window.innerWidth >= 700) return 2
  return 1
}

export default function Blog() {
  const ref = useReveal()
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(1)
  const [dir, setDir] = useState('next')
  const dragX = useRef(null)
  const paused = useRef(false)

  useEffect(() => {
    const update = () => setVisible(visibleCount())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxIndex = Math.max(0, blogPosts.length - visible)

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  const go = useCallback(
    (nextIndex, nextDir) => {
      const clamped = ((nextIndex % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1)
      setDir(nextDir)
      setIndex(clamped)
    },
    [maxIndex]
  )

  const next = useCallback(() => go(index + 1, 'next'), [go, index])
  const prev = useCallback(() => go(index - 1, 'prev'), [go, index])

  useEffect(() => {
    if (maxIndex === 0) return undefined
    const id = window.setInterval(() => {
      if (paused.current) return
      setIndex((i) => (i >= maxIndex ? 0 : i + 1))
      setDir('next')
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [maxIndex, index])

  const onPointerDown = (e) => {
    dragX.current = e.clientX
  }
  const onPointerUp = (e) => {
    if (dragX.current == null) return
    const dx = e.clientX - dragX.current
    dragX.current = null
    if (Math.abs(dx) < 40) return
    if (dx < 0) next()
    else prev()
  }

  return (
    <section id="blog" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Blog</span>
          <h2>
            <AccentText text="Insights for builders and founders" />
          </h2>
          <p>Practical guides on AI chatbots, document AI, agents, and automation.</p>
        </div>

        <div
          className="blog-carousel reveal"
          ref={ref}
          style={{ '--visible': String(visible), '--index': String(index) }}
          onMouseEnter={() => {
            paused.current = true
          }}
          onMouseLeave={() => {
            paused.current = false
          }}
        >
          <div className="blog-stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            <div className="blog-viewport">
              <div className={`blog-track is-${dir}`}>
                {blogPosts.map((post) => (
                  <div key={post.id} className="blog-slide">
                    <article className="blog-card">
                      <div className="blog-meta">
                        <span className="blog-tag">{post.tag}</span>
                        <span className="blog-time">{post.readTime}</span>
                      </div>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <a href="#contact" className="blog-cta">
                        Talk to us about this →
                      </a>
                    </article>
                  </div>
                ))}
              </div>
            </div>

            <button type="button" className="blog-nav blog-prev" onClick={prev} aria-label="Previous posts">
              ‹
            </button>
            <button type="button" className="blog-nav blog-next" onClick={next} aria-label="Next posts">
              ›
            </button>
          </div>

          <div className="blog-dots" role="tablist" aria-label="Blog slides">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Blog group ${i + 1} of ${maxIndex + 1}`}
                className={`blog-dot ${i === index ? 'is-active' : ''}`}
                onClick={() => go(i, i > index ? 'next' : 'prev')}
              >
                <span key={`fill-${index}-${i}`} className="blog-dot-fill" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
