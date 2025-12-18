import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import ThreeScene from '@components/ThreeScene'
import TextEffect from '@components/TextEffect'
import '@styles/HomePage.css'

/**
 * HomePage Component
 * Hero page featuring:
 * - Full-screen 3D interactive scene with Three.js
 * - Animated text effects (typing, morphing, glitch)
 * - Call-to-action buttons
 * - Smooth scroll animations
 * - Neon dark-modern aesthetic
 */

export default function HomePage() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse position for 3D parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Initialize page animations on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)

    if (contentRef.current && !isLoading) {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
      })

      // Stagger child animations
      gsap.from(contentRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      })
    }

    return () => clearTimeout(timer)
  }, [isLoading])

  // Handle navigation with smooth transitions
  const handleNavigation = (path) => {
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => navigate(path),
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4 },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
      transition: {
        duration: 0.3,
      },
    },
    tap: {
      scale: 0.95,
    },
  }

  return (
    <motion.div
      ref={containerRef}
      className="home-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* 3D Background Scene */}
      <div className="hero-scene-container">
        <ThreeScene mousePosition={mousePosition} />
      </div>

      {/* Content Overlay */}
      <div className="hero-content-overlay">
        <motion.div
          ref={contentRef}
          className="hero-content"
          initial="hidden"
          animate={!isLoading ? 'visible' : 'hidden'}
        >
          {/* Main Heading with Text Effect */}
          <motion.div className="hero-heading" variants={textVariants}>
            <h1>
              <TextEffect
                text="Creative Developer"
                effect="typing"
                speed={0.05}
              />
            </h1>
            <div className="heading-accent">
              <motion.span
                className="accent-line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              />
            </div>
          </motion.div>

          {/* Subtitle with Morphing Effect */}
          <motion.div
            className="hero-subtitle"
            variants={textVariants}
            transition={{ delay: 0.3 }}
          >
            <TextEffect
              text="Building immersive digital experiences with React, Three.js, and creative animations"
              effect="fade"
              speed={0.03}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            className="hero-description"
            variants={textVariants}
            transition={{ delay: 0.6 }}
          >
            Specializing in full-stack development with a passion for interactive design,
            performance optimization, and pushing the boundaries of web technology.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="hero-cta"
            variants={textVariants}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              className="cta-button primary"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleNavigation('/projects')}
            >
              <span>View My Work</span>
              <motion.span
                className="button-arrow"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>

            <motion.button
              className="cta-button secondary"
              variants={buttonVariants}
              transition={{ delay: 0.1 }}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleNavigation('/contact')}
            >
              <span>Get In Touch</span>
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="scroll-indicator"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => {
              gsap.to(window, { scrollTo: '+=500', duration: 0.8 })
            }}
          >
            <div className="scroll-dot" />
            <p>Scroll to explore</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Background Elements */}
      <div className="hero-bg-elements">
        <motion.div
          className="bg-element element-1"
          animate={{
            x: mousePosition.x * 20,
            y: mousePosition.y * 20,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        />
        <motion.div
          className="bg-element element-2"
          animate={{
            x: mousePosition.x * -15,
            y: mousePosition.y * -15,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        />
        <motion.div
          className="bg-element element-3"
          animate={{
            x: mousePosition.x * 25,
            y: mousePosition.y * 25,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        />
      </div>

      {/* Neon Grid Background */}
      <div className="neon-grid" />
    </motion.div>
  )
}