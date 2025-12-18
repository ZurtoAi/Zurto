import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import styles from './ProjectCard.module.css'

/**
 * ProjectCard Component
 * Individual project card with hover effects, animations, and tech stack display
 * Features:
 * - Hover scale and shadow effects with GSAP
 * - Animated tech stack badges
 * - Gradient border animation on hover
 * - Performance metrics display
 * - Smooth transitions and 3D perspective effects
 * - Responsive design with mobile optimization
 */
const ProjectCard = React.forwardRef(({
  id,
  title,
  description,
  image,
  technologies,
  metrics,
  link,
  featured = false,
  index = 0,
  onClick
}, ref) => {
  const cardRef = useRef(ref)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // GSAP hover animation
  useEffect(() => {
    if (!cardRef.current) return

    if (isHovered) {
      gsap.to(cardRef.current, {
        duration: 0.4,
        scale: 1.05,
        boxShadow: '0 20px 60px rgba(0, 255, 255, 0.3)',
        ease: 'power2.out',
        overwrite: 'auto'
      })
    } else {
      gsap.to(cardRef.current, {
        duration: 0.4,
        scale: 1,
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        ease: 'power2.out',
        overwrite: 'auto'
      })
    }
  }, [isHovered])

  // Handle mouse move for gradient border effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePosition({ x, y })

    // Update gradient position
    gsap.to(cardRef.current, {
      duration: 0.1,
      '--gradient-x': `${x}px`,
      '--gradient-y': `${y}px`,
      overwrite: 'auto'
    })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 0, y: 0 })
  }

  // Container animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut'
      }
    }
  }

  // Tech badge animation variants
  const badgeVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: (custom) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: index * 0.1 + custom * 0.05
      }
    }),
    hover: {
      scale: 1.1,
      backgroundColor: 'rgba(0, 255, 255, 0.2)',
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.projectCard} ${featured ? styles.featured : ''}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="article"
      tabIndex={0}
    >
      {/* Gradient border effect */}
      <div className={styles.borderGradient} />

      {/* Card content wrapper */}
      <div className={styles.cardContent}>
        {/* Image section */}
        {image && (
          <motion.div
            className={styles.imageContainer}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={image}
              alt={title}
              className={styles.projectImage}
              loading="lazy"
            />
            <div className={styles.imageOverlay} />
          </motion.div>
        )}

        {/* Project info section */}
        <div className={styles.infoContainer}>
          {/* Title */}
          <h3 className={styles.title}>{title}</h3>

          {/* Description */}
          {description && (
            <p className={styles.description}>{description}</p>
          )}

          {/* Metrics section */}
          {metrics && metrics.length > 0 && (
            <div className={styles.metricsContainer}>
              {metrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  className={styles.metric}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                >
                  <span className={styles.metricLabel}>{metric.label}</span>
                  <span className={styles.metricValue}>{metric.value}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Technologies section */}
          {technologies && technologies.length > 0 && (
            <div className={styles.technologiesContainer}>
              {technologies.map((tech, idx) => (
                <motion.span
                  key={idx}
                  className={styles.techBadge}
                  custom={idx}
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          )}

          {/* Action section */}
          <div className={styles.actionContainer}>
            {link && (
              <motion.a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                View Project
                <span className={styles.linkArrow}>→</span>
              </motion.a>
            )}
          </div>
        </div>
      </div>

      {/* Featured badge */}
      {featured && (
        <motion.div
          className={styles.featuredBadge}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          Featured
        </motion.div>
      )}
    </motion.div>
  )
})

ProjectCard.displayName = 'ProjectCard'

export default ProjectCard