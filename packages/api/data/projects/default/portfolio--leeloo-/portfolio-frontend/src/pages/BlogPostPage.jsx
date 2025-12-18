import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '@styles/BlogPostPage.css'

/**
 * BlogPostPage Component
 * Individual blog post detail page with:
 * - Post metadata (author, date, reading time, tags)
 * - Animated content reveal
 * - Related posts suggestions
 * - Navigation to previous/next posts
 * - Share functionality
 */

gsap.registerPlugin(ScrollTrigger)

// Mock blog posts data (in production, fetch from API or props)
const BLOG_POSTS = [
  {
    id: 1,
    title: 'Building Interactive 3D Experiences with Three.js',
    author: 'LeeLoo',
    date: '2024-01-15',
    readingTime: 8,
    category: 'Web Development',
    tags: ['three.js', '3D', 'javascript', 'webgl'],
    excerpt: 'A comprehensive guide to creating stunning 3D visualizations on the web.',
    content: `
      # Building Interactive 3D Experiences with Three.js

      Three.js has revolutionized the way we create 3D graphics on the web. In this article, we'll explore how to leverage its powerful API to build immersive experiences.

      ## Getting Started

      Three.js abstracts WebGL complexities into an elegant API. The basic setup involves creating a scene, camera, renderer, and objects.

      \`\`\`javascript
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      \`\`\`

      ## Advanced Techniques

      - Lighting strategies for realistic rendering
      - Texture mapping and material systems
      - Animation loops and performance optimization
      - Interaction handlers for user engagement

      ## Real-World Applications

      From product visualizations to data representations, 3D web experiences continue to gain importance in modern web design.
    `,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=1200',
    relatedPosts: [2, 3],
  },
  {
    id: 2,
    title: 'Mastering Framer Motion Animations',
    author: 'LeeLoo',
    date: '2024-01-10',
    readingTime: 6,
    category: 'Animation',
    tags: ['framer-motion', 'react', 'animation', 'ui'],
    excerpt: 'Deep dive into declarative animations with Framer Motion.',
    content: `
      # Mastering Framer Motion Animations

      Framer Motion simplifies animation in React by providing a declarative API built on top of Popmotion.

      ## Core Concepts

      - Motion components and variants
      - Gesture animations
      - Layout animations
      - Exit animations and AnimatePresence

      ## Performance Tips

      Always consider GPU acceleration and use layout props efficiently to maintain 60fps performance.
    `,
    image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=1200',
    relatedPosts: [1, 4],
  },
  {
    id: 3,
    title: 'React Performance Optimization Strategies',
    author: 'LeeLoo',
    date: '2024-01-05',
    readingTime: 10,
    category: 'React',
    tags: ['react', 'performance', 'optimization', 'javascript'],
    excerpt: 'Techniques to maximize your React application performance.',
    content: `
      # React Performance Optimization Strategies

      Building performant React applications requires understanding component lifecycle and rendering behavior.

      ## Key Techniques

      - Code splitting and lazy loading
      - Memoization with useMemo and useCallback
      - Virtual scrolling for large lists
      - Bundle analysis and minification

      ## Monitoring Performance

      Use React DevTools Profiler and web vitals to identify bottlenecks.
    `,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
    relatedPosts: [1, 2],
  },
  {
    id: 4,
    title: 'CSS3 Modern Layout Techniques',
    author: 'LeeLoo',
    date: '2023-12-28',
    readingTime: 7,
    category: 'CSS',
    tags: ['css3', 'grid', 'flexbox', 'design'],
    excerpt: 'Explore modern CSS features for responsive design.',
    content: `
      # CSS3 Modern Layout Techniques

      CSS Grid and Flexbox have transformed how we approach layouts. Let's explore their capabilities.

      ## Flexbox vs Grid

      - Flexbox: one-dimensional, content-first
      - Grid: two-dimensional, layout-first

      ## Advanced Features

      - Subgrid for nested layouts
      - Named grid areas
      - CSS custom properties
      - Container queries
    `,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
    relatedPosts: [1, 3],
  },
]

const BlogPostPage = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const contentRef = useRef(null)
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate fetching post data
    const numPostId = parseInt(postId, 10)
    const foundPost = BLOG_POSTS.find((p) => p.id === numPostId)

    if (foundPost) {
      setPost(foundPost)
      setRelatedPosts(
        foundPost.relatedPosts.map((id) => BLOG_POSTS.find((p) => p.id === id))
      )
    }

    setLoading(false)
  }, [postId])

  useEffect(() => {
    if (!post || !contentRef.current) return

    // Animate content on load
    gsap.from(contentRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
    })

    // Animate headings and paragraphs with scroll trigger
    gsap.utils.toArray('h2, h3').forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    })
  }, [post])

  const handleShare = async (platform) => {
    const url = window.location.href
    const text = post.title

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    }

    if (platform === 'copy') {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer')
    }
  }

  const handleNavigate = (direction) => {
    const currentIndex = BLOG_POSTS.findIndex((p) => p.id === post.id)
    let nextIndex

    if (direction === 'prev') {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : BLOG_POSTS.length - 1
    } else {
      nextIndex = currentIndex < BLOG_POSTS.length - 1 ? currentIndex + 1 : 0
    }

    navigate(`/blog/${BLOG_POSTS[nextIndex].id}`)
  }

  if (loading) {
    return (
      <div className="blog-post-page loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-post-page not-found">
        <h1>Post not found</h1>
        <button onClick={() => navigate('/blog')}>Back to Blog</button>
      </div>
    )
  }

  return (
    <div className="blog-post-page">
      {/* Hero Section */}
      <motion.section
        className="blog-post-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-image-container">
          <img src={post.image} alt={post.title} className="hero-image" />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <motion.div
            className="breadcrumb"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="category">{post.category}</span>
          </motion.div>

          <motion.h1
            className="post-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {post.title}
          </motion.h1>

          <motion.div
            className="post-metadata"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="author">By {post.author}</span>
            <span className="separator">•</span>
            <span className="date">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="separator">•</span>
            <span className="reading-time">{post.readingTime} min read</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.article
        ref={contentRef}
        className="blog-post-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="content-wrapper">
          <div className="post-body">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('#')) {
                const level = paragraph.match(/^#+/)[0].length
                const text = paragraph.replace(/^#+\s/, '')
                const Tag = `h${Math.min(level + 1, 6)}`
                return <Tag key={idx}>{text}</Tag>
              }
              if (paragraph.startsWith('```')) {
                return (
                  <pre key={idx} className="code-block">
                    <code>{paragraph}</code>
                  </pre>
                )
              }
              if (paragraph.startsWith('-')) {
                return (
                  <ul key={idx}>
                    {paragraph
                      .split('\n')
                      .map((item, i) => (
                        <li key={i}>{item.replace(/^-\s/, '')}</li>
                      ))}
                  </ul>
                )
              }
              return <p key={idx}>{paragraph}</p>
            })}
          </div>

          {/* Sidebar */}
          <aside className="post-sidebar">
            {/* Tags */}
            <div className="sidebar-section tags-section">
              <h3>Tags</h3>
              <div className="tags-list">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="sidebar-section share-section">
              <h3>Share</h3>
              <div className="share-buttons">
                <motion.button
                  className="share-btn twitter"
                  onClick={() => handleShare('twitter')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Share on Twitter"
                >
                  𝕏
                </motion.button>
                <motion.button
                  className="share-btn linkedin"
                  onClick={() => handleShare('linkedin')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Share on LinkedIn"
                >
                  in
                </motion.button>
                <motion.button
                  className="share-btn facebook"
                  onClick={() => handleShare('facebook')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Share on Facebook"
                >
                  f
                </motion.button>
                <motion.button
                  className="share-btn copy"
                  onClick={() => handleShare('copy')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Copy link"
                >
                  {copied ? '✓' : '🔗'}
                </motion.button>
              </div>
            </div>

            {/* Author */}
            <div className="sidebar-section author-section">
              <h3>About Author</h3>
              <p>{post.author} is a passionate developer and creative technologist.</p>
            </div>
          </aside>
        </div>
      </motion.article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <motion.section
          className="related-posts"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Related Articles</h2>
          <div className="related-posts-grid">
            {relatedPosts.map((relatedPost, idx) => (
              <motion.article
                key={relatedPost.id}
                className="related-post-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/blog/${relatedPost.id}`)}
              >
                <div className="card-image">
                  <img src={relatedPost.image} alt={relatedPost.title} />
                </div>
                <div className="card-content">
                  <h3>{relatedPost.title}</h3>
                  <p className="card-date">
                    {new Date(relatedPost.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>
      )}

      {/* Navigation */}
      <motion.section
        className="post-navigation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <button
          className="nav-button prev"
          onClick={() => handleNavigate('prev')}
          aria-label="Previous post"
        >
          <span className="arrow">←</span>
          <span>Previous</span>
        </button>

        <button
          className="nav-button back-to-blog"
          onClick={() => navigate('/blog')}
        >
          Back to Blog
        </button>

        <button
          className="nav-button next"
          onClick={() => handleNavigate('next')}
          aria-label="Next post"
        >
          <span>Next</span>
          <span className="arrow">→</span>
        </button>
      </motion.section>
    </div>
  )
}

export default BlogPostPage