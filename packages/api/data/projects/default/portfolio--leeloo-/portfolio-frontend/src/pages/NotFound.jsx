import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import '@styles/NotFound.css'

/**
 * NotFound Component
 * 404 error page with animated elements and navigation back
 * Features:
 * - Animated 404 text with glitch effect
 * - Interactive navigation buttons
 * - Particle/floating elements background
 * - Smooth transitions with Framer Motion
 */
const NotFound = () => {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    // Animate 404 text with GSAP
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, scale: 0.5, rotationZ: -10 },
        {
          opacity: 1,
          scale: 1,
          rotationZ: 0,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
        }
      )

      // Add continuous subtle floating animation
      gsap.to(textRef.current, {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }

    // Create floating particles background
    const particles = containerRef.current?.querySelectorAll('.particle')
    if (particles) {
      particles.forEach((particle, index) => {
        gsap.to(particle, {
          y: -200,
          opacity: 0,
          duration: Math.random() * 3 + 2,
          delay: index * 0.1,
          repeat: -1,
          ease: 'none',
        })
      })
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <div className="not-found-container" ref={containerRef}>
      {/* Animated background particles */}
      <div className="particles-wrapper">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="not-found-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Text */}
        <motion.div
          ref={textRef}
          className="error-code"
          variants={itemVariants}
        >
          <h1>404</h1>
        </motion.div>

        {/* Error message */}
        <motion.div className="error-message" variants={itemVariants}>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div className="error-actions" variants={itemVariants}>
          <motion.button
            className="btn btn-primary"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </motion.button>
          <motion.button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>
        </motion.div>

        {/* Animated background text */}
        <motion.div
          className="background-text"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2, repeat: Infinity, yoyo: true }}
        >
          404 • Page Not Found • 404 • Page Not Found
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound