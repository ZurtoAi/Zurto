import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import styles from './BlogCard.module.css'

/**
 * BlogCard Component
 * Individual blog post card with excerpt, metadata, and hover animations
 * Features:
 * - Hover scale and shadow effects with GSAP
 * - Animated category badge
 * - Reading time estimation
 * - Author and publish date display
 * - Smooth transition to full post
 * - Gradient border animation on hover
 */

const BlogCard = ({ post, index = 0 }) => {
  const cardRef = useRef(null)
  const borderRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut'
      }
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  }

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.1 + 0.2
      }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.1 + 0.1
      }
    }
  }

  // GSAP hover effects
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const onMouseEnter = () => {
      setIsHovered(true)
      gsap.to(card, {
        boxShadow: '0 20px 40px rgba(0, 255, 255, 0.2)',
        duration: 0.3,
        ease: 'power2.out'
      })

      // Animate border gradient
      if (borderRef.current) {
        gsap.to(borderRef.current, {
          opacity: 1,
          duration: 0.3
        })
      }
    }

    const onMouseLeave = () => {
      setIsHovered(false)
      gsap.to(card, {
        boxShadow: '0 10px 30px rgba(0, 255, 255, 0.1)',
        duration: 0.3,
        ease: 'power2.out'
      })

      if (borderRef.current) {
        gsap.to(borderRef.current, {
          opacity: 0.3,
          duration: 0.3
        })
      }
    }

    card.addEventListener('mouseenter', onMouseEnter)
    card.addEventListener('mouseleave', onMouseLeave)

    return () => {
      card.removeEventListener('mouseenter', onMouseEnter)
      card.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  // Calculate reading time
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return readingTime
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const readingTime = calculateReadingTime(post.content || post.excerpt)

  return (
    <motion.div
      ref={cardRef}
      className={styles.blogCard}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: '-50px' }}
    >
      {/* Animated border gradient */}
      <div
        ref={borderRef}
        className={styles.borderGradient}
        style={{
          opacity: 0.3
        }}
      />

      {/* Card content wrapper */}
      <Link to={`/blog/${post.slug}`} className={styles.cardLink}>
        <motion.div
          className={styles.cardContent}
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Header section with category and reading time */}
          <div className={styles.header}>
            <motion.span
              className={`${styles.category} ${styles[`category-${post.category?.toLowerCase()}`]}`}
              variants={badgeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {post.category}
            </motion.span>
            <span className={styles.readingTime}>
              {readingTime} min read
            </span>
          </div>

          {/* Title */}
          <h3 className={styles.title}>{post.title}</h3>

          {/* Excerpt */}
          <p className={styles.excerpt}>{post.excerpt}</p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer with author and date */}
          <div className={styles.footer}>
            <div className={styles.meta}>
              <span className={styles.author}>{post.author}</span>
              <span className={styles.date}>{formatDate(post.date)}</span>
            </div>
            <motion.div
              className={styles.readMore}
              animate={isHovered ? { x: 5 } : { x: 0 }}
              transition={{ duration: 0.2 }}
            >
              Read More →
            </motion.div>
          </div>
        </motion.div>
      </Link>

      {/* Hover overlay effect */}
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

BlogCard.displayName = 'BlogCard'

export default BlogCard