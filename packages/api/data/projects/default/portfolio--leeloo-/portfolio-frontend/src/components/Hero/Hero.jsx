import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ThreeScene from '@components/ThreeScene'
import TextEffects from '@components/TextEffects'
import '@styles/Hero.css'

/**
 * Hero Component
 * Full-screen hero section with 3D interactive scene and text effects
 * Features:
 * - Three.js 3D scene with manipulable elements
 * - Animated text with typing, morphing, and glitch effects
 * - Parallax scrolling effects
 * - Smooth entry animations with Framer Motion
 * - Responsive design for mobile/tablet/desktop
 * - Call-to-action buttons with hover effects
 * - Neon aesthetic with dark theme
 */
const Hero = () => {
  const heroRef = useRef(null)
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Initial load animation
  useEffect(() => {
    setIsLoaded(true)

    // Create GSAP timeline for entrance animations
    const tl = gsap.timeline()

    tl.from(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
    .from(
      containerRef.current?.querySelectorAll('[data-animate]'),
      {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      },
      '-=0.4'
    )
  }, [])

  // Parallax effect for background elements
  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.5}px)`,
  }

  return (
    <section
      ref={heroRef}
      className="hero-container"
      role="region"
      aria-label="Hero section with 3D scene and introduction"
    >
      {/* Background 3D Scene */}
      <div className="hero-background" style={parallaxStyle}>
        <ThreeScene />
      </div>

      {/* Content Container */}
      <motion.div
        ref={containerRef}
        className="hero-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Text Section */}
        <div className="hero-text-wrapper" data-animate>
          <motion.div
            className="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="hero-title">
              <span className="neon-text">Creative</span>
              <span className="text-effects-wrapper">
                <TextEffects />
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Full-stack developer crafting interactive digital experiences with
            modern web technologies and immersive design
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="hero-cta-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.a
              href="#projects"
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-text">View My Work</span>
              <span className="btn-arrow">→</span>
            </motion.a>

            <motion.a
              href="#contact"
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-text">Get In Touch</span>
              <span className="btn-icon">✉</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="hero-scroll-indicator"
          data-animate
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5V19M19 12L12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Scroll to explore</span>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="hero-decorative">
        <motion.div
          className="glow-orb glow-orb-1"
          animate={{
            x: [0, 30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="glow-orb glow-orb-2"
          animate={{
            x: [0, -30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </section>
  )
}

export default Hero