import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { useSearchParams } from 'react-router-dom'
import BlogCard from '@components/BlogCard'
import '@styles/BlogPage.css'

/**
 * BlogPage Component
 * Displays blog posts in a paginated list with search functionality
 * Features:
 * - Full-text search across titles and descriptions
 * - Pagination with configurable items per page
 * - Animated card grid with stagger effects
 * - Active page indicator
 * - Responsive layout
 */

const POSTS_PER_PAGE = 6
const ANIMATION_DURATION = 0.3

// Mock blog posts data
const BLOG_POSTS = [
  {
    id: 1,
    title: 'Building Interactive 3D Experiences with Three.js',
    description: 'Explore techniques for creating engaging 3D scenes in the browser using Three.js and WebGL.',
    excerpt: 'Learn how to leverage Three.js for immersive web experiences...',
    date: '2024-01-15',
    category: 'Web Development',
    readTime: 8,
    tags: ['three.js', 'webgl', '3d', 'javascript'],
  },
  {
    id: 2,
    title: 'Mastering Animation with Framer Motion and GSAP',
    description: 'Deep dive into advanced animation techniques using Framer Motion and GSAP libraries.',
    excerpt: 'Discover the power of declarative animations in React...',
    date: '2024-01-10',
    category: 'Animation',
    readTime: 10,
    tags: ['framer-motion', 'gsap', 'react', 'animation'],
  },
  {
    id: 3,
    title: 'React Router v6: Navigation Best Practices',
    description: 'Navigate modern routing patterns and best practices with React Router v6.',
    excerpt: 'Master nested routes, dynamic parameters, and layout patterns...',
    date: '2024-01-05',
    category: 'React',
    readTime: 6,
    tags: ['react-router', 'routing', 'react', 'navigation'],
  },
  {
    id: 4,
    title: 'CSS3 Neon Effects and Dark Mode Design',
    description: 'Create stunning neon effects and implement dark mode with modern CSS3 techniques.',
    excerpt: 'Learn about box-shadows, filters, and blend modes for neon aesthetics...',
    date: '2023-12-28',
    category: 'CSS',
    readTime: 7,
    tags: ['css3', 'design', 'neon', 'dark-mode'],
  },
  {
    id: 5,
    title: 'Vite: Lightning-Fast Build Tool for Modern Web',
    description: 'Understand why Vite is revolutionizing web development with instant HMR and optimized builds.',
    excerpt: 'Experience the speed and developer experience improvements...',
    date: '2023-12-20',
    category: 'Build Tools',
    readTime: 5,
    tags: ['vite', 'build-tools', 'bundler', 'performance'],
  },
  {
    id: 6,
    title: 'Performance Optimization Techniques for React Apps',
    description: 'Optimize your React applications for speed with memoization, code splitting, and lazy loading.',
    excerpt: 'Achieve faster load times and smoother interactions...',
    date: '2023-12-15',
    category: 'Performance',
    readTime: 9,
    tags: ['react', 'performance', 'optimization', 'javascript'],
  },
  {
    id: 7,
    title: 'WebGL Fundamentals: From Shaders to Scenes',
    description: 'Get started with WebGL by understanding shaders, buffers, and rendering pipelines.',
    excerpt: 'Build the foundation for 3D graphics in the browser...',
    date: '2023-12-10',
    category: 'Web Development',
    readTime: 12,
    tags: ['webgl', '3d', 'graphics', 'javascript'],
  },
  {
    id: 8,
    title: 'State Management in React: Redux vs Context API',
    description: 'Compare popular state management solutions and choose the right approach for your project.',
    excerpt: 'Understand the tradeoffs between Redux, Context API, and Zustand...',
    date: '2023-12-05',
    category: 'React',
    readTime: 8,
    tags: ['react', 'state-management', 'redux', 'context-api'],
  },
  {
    id: 9,
    title: 'Responsive Design Patterns for Modern Layouts',
    description: 'Master CSS Grid, Flexbox, and media queries for truly responsive web design.',
    excerpt: 'Create layouts that adapt beautifully to any screen size...',
    date: '2023-11-30',
    category: 'CSS',
    readTime: 6,
    tags: ['css', 'responsive', 'grid', 'flexbox'],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: ANIMATION_DURATION },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION_DURATION },
  },
}

const pageIndicatorVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: ANIMATION_DURATION },
  },
}

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  )
  const containerRef = useRef(null)

  // Filter posts based on search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) {
      return BLOG_POSTS
    }

    const lowerSearchTerm = searchTerm.toLowerCase()
    return BLOG_POSTS.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerSearchTerm) ||
        post.description.toLowerCase().includes(lowerSearchTerm) ||
        post.category.toLowerCase().includes(lowerSearchTerm) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowerSearchTerm))
    )
  }, [searchTerm])

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages))
  const startIndex = (validCurrentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  // Update URL params when search or page changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (validCurrentPage > 1) params.set('page', validCurrentPage.toString())
    setSearchParams(params, { replace: true })
  }, [searchTerm, validCurrentPage, setSearchParams])

  // Reset to page 1 when search term changes
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }, [])

  // Handle pagination
  const handlePageChange = useCallback((pageNum) => {
    setCurrentPage(pageNum)
    // Scroll to top smoothly
    containerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handlePreviousPage = useCallback(() => {
    if (validCurrentPage > 1) {
      handlePageChange(validCurrentPage - 1)
    }
  }, [validCurrentPage, handlePageChange])

  const handleNextPage = useCallback(() => {
    if (validCurrentPage < totalPages) {
      handlePageChange(validCurrentPage + 1)
    }
  }, [validCurrentPage, totalPages, handlePageChange])

  return (
    <motion.div
      ref={containerRef}
      className="blog-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <motion.header
        className="blog-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1 className="blog-title">Blog & Articles</h1>
        <p className="blog-subtitle">
          Insights on web development, animation, and creative coding
        </p>
      </motion.header>

      {/* Search Section */}
      <motion.div
        className="blog-search-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search posts by title, category, or tags..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search blog posts"
          />
          <span className="search-icon">🔍</span>
        </div>
        <p className="search-results-count">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
        </p>
      </motion.div>

      {/* Posts Grid */}
      <AnimatePresence mode="wait">
        {currentPosts.length > 0 ? (
          <motion.div
            key={`page-${validCurrentPage}`}
            className="blog-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {currentPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                layout
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="no-results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: ANIMATION_DURATION }}
          >
            <p className="no-results-text">
              No posts found matching "{searchTerm}"
            </p>
            <button
              className="reset-search-btn"
              onClick={() => {
                setSearchTerm('')
                setCurrentPage(1)
              }}
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination Section */}
      {filteredPosts.length > 0 && totalPages > 1 && (
        <motion.div
          className="pagination-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Previous Button */}
          <button
            className="pagination-btn pagination-prev"
            onClick={handlePreviousPage}
            disabled={validCurrentPage === 1}
            aria-label="Previous page"
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => {
                const isCurrentPage = pageNum === validCurrentPage
                const isNearCurrent = Math.abs(pageNum - validCurrentPage) <= 1
                const showEllipsis =
                  pageNum > 1 &&
                  pageNum < totalPages &&
                  !isNearCurrent &&
                  pageNum === validCurrentPage - 2

                if (totalPages > 7 && !isNearCurrent && pageNum !== 1 && pageNum !== totalPages && !showEllipsis) {
                  return null
                }

                return (
                  <motion.button
                    key={pageNum}
                    className={`page-number ${isCurrentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                    variants={pageIndicatorVariants}
                    initial="hidden"
                    animate="visible"
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={isCurrentPage ? 'page' : undefined}
                  >
                    {pageNum}
                  </motion.button>
                )
              }
            )}
          </div>

          {/* Next Button */}
          <button
            className="pagination-btn pagination-next"
            onClick={handleNextPage}
            disabled={validCurrentPage === totalPages}
            aria-label="Next page"
          >
            Next →
          </button>

          {/* Page Info */}
          <div className="pagination-info">
            <span>
              Page <strong>{validCurrentPage}</strong> of <strong>{totalPages}</strong>
            </span>
          </div>
        </motion.div>
      )}

      {/* Load More Info */}
      {filteredPosts.length > POSTS_PER_PAGE && (
        <motion.div
          className="pagination-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>
            Showing <strong>{startIndex + 1}</strong> to{' '}
            <strong>{Math.min(endIndex, filteredPosts.length)}</strong> of{' '}
            <strong>{filteredPosts.length}</strong> posts
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}