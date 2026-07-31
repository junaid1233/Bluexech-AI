import { useReveal } from '../hooks/useReveal'
import { blogPosts } from '../data/content'
import './Blog.css'

export default function Blog() {
  const ref = useReveal()

  return (
    <section id="blog" className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Blog</span>
          <h2>Insights for builders and founders</h2>
          <p>Practical guides on AI, SaaS, web development, and automation.</p>
        </div>
        <div className="blog-grid reveal" ref={ref}>
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
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
          ))}
        </div>
      </div>
    </section>
  )
}
