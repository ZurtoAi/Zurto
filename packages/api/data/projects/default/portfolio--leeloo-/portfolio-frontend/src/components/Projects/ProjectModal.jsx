import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import styles from './ProjectModal.module.css'

/**
 * ProjectModal Component
 * Full-screen modal for detailed project information
 * Features:
 * - Animated modal entrance/exit with Framer Motion
 * - Tech stack display with category badges
 * - Performance metrics visualization
 * - Detailed description with smooth scrolling
 * - Image carousel for project screenshots
 * - Links to live demo and source code
 * - Responsive design with mobile support
 * - Accessibility features (escape to close, focus management)
 */
const ProjectModal = ({ project, isOpen, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)
  const contentRef = React.useRef(null)
  const modalRef = React.useRef(null)

  // Handle keyboard escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (modalRef.current) {
        modalRef.current.focus()
      }
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle scroll position tracking
  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollLeft)
  }

  // Animate image carousel slide
  const nextImage = () => {
    if (project?.images && project.images.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % project.images.length)
    }
  }

  const prevImage = () => {
    if (project?.images && project.images.length > 0) {
      setActiveImageIndex((prev) =>
        prev === 0 ? project.images.length - 1 : prev - 1
      )
    }
  }

  // Categorize tech stack
  const getTechByCategory = () => {
    const categories = {
      Frontend: [],
      Backend: [],
      Tools: [],
      Other: [],
    }

    if (project?.techStack) {
      project.techStack.forEach((tech) => {
        const category = tech.category || 'Other'
        if (categories[category]) {
          categories[category].push(tech)
        } else {
          categories.Other.push(tech)
        }
      })
    }

    return Object.entries(categories).filter(([_, techs]) => techs.length > 0)
  }

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  }

  const contentVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    exit: { y: 50, opacity: 0, transition: { duration: 0.2 } },
  }

  const techBadgeVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  }

  if (!project) return null

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            className={styles.modalContent}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            ref={contentRef}
          >
            {/* Close Button */}
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Project Header */}
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <h2 id="modal-title" className={styles.title}>
                  {project.title}
                </h2>
                <p className={styles.subtitle}>{project.category}</p>
                <p className={styles.description}>{project.description}</p>
              </div>
            </div>

            {/* Image Carousel */}
            {project.images && project.images.length > 0 && (
              <div className={styles.carouselContainer}>
                <div className={styles.carousel}>
                  <motion.img
                    key={activeImageIndex}
                    src={project.images[activeImageIndex]}
                    alt={`${project.title} screenshot ${activeImageIndex + 1}`}
                    className={styles.carouselImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Carousel Controls */}
                {project.images.length > 1 && (
                  <div className={styles.carouselControls}>
                    <button
                      className={styles.carouselButton}
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      ←
                    </button>
                    <div className={styles.carouselIndicators}>
                      {project.images.map((_, index) => (
                        <button
                          key={index}
                          className={`${styles.indicator} ${
                            index === activeImageIndex ? styles.active : ''
                          }`}
                          onClick={() => setActiveImageIndex(index)}
                          aria-label={`Go to image ${index + 1}`}
                          aria-current={index === activeImageIndex}
                        ></button>
                      ))}
                    </div>
                    <button
                      className={styles.carouselButton}
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Main Content */}
            <div className={styles.scrollContainer}>
              {/* Tech Stack Section */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Technology Stack</h3>
                <div className={styles.techCategories}>
                  {getTechByCategory().map(([category, techs]) => (
                    <div key={category} className={styles.techCategory}>
                      <h4 className={styles.categoryName}>{category}</h4>
                      <div className={styles.techBadges}>
                        {techs.map((tech, index) => (
                          <motion.div
                            key={`${tech.name}-${index}`}
                            className={styles.techBadge}
                            custom={index}
                            variants={techBadgeVariants}
                            initial="hidden"
                            animate="visible"
                            title={tech.description}
                          >
                            {tech.icon && (
                              <span className={styles.techIcon}>
                                {tech.icon}
                              </span>
                            )}
                            <span className={styles.techName}>{tech.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Performance Metrics Section */}
              {project.metrics && Object.keys(project.metrics).length > 0 && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Performance Metrics</h3>
                  <div className={styles.metricsGrid}>
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <motion.div
                        key={key}
                        className={styles.metricCard}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={styles.metricValue}>{value.value}</div>
                        <div className={styles.metricLabel}>{value.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Detailed Description Section */}
              {project.detailedDescription && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>About This Project</h3>
                  <p className={styles.detailedText}>
                    {project.detailedDescription}
                  </p>
                </section>
              )}

              {/* Key Features Section */}
              {project.features && project.features.length > 0 && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Key Features</h3>
                  <ul className={styles.featuresList}>
                    {project.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        className={styles.featureItem}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className={styles.featureBullet}>✓</span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Links Section */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Project Links</h3>
                <div className={styles.linksContainer}>
                  {project.liveLink && (
                    <motion.a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkButton}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 255, 0.6)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>View Live</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </motion.a>
                  )}
                  {project.sourceLink && (
                    <motion.a
                      href={project.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkButton}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 255, 0.6)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Source Code</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.375 3.375 0 0 0-.975-2.438A3.375 3.375 0 0 1 16.5 9c1.902 0 3.75.585 5.25 1.457A3.375 3.375 0 0 1 21 12.75V19M9 19c5 1.5 5-2.5 7-3"></path>
                      </svg>
                    </motion.a>
                  )}
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProjectModal