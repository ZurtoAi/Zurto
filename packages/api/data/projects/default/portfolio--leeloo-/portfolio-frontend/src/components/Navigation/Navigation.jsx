import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import '@styles/Navigation.css'

/**
 * Navigation Component
 * Header navigation with animated menu and logo
 * Features:
 * - Animated hamburger menu toggle
 * - Smooth navigation links with active state
 * - Logo animation on load
 * - Mobile-responsive design
 * - Neon glow effects on hover
 * - Sticky header with scroll awareness
 */
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const menuRef = useRef(null)

  // Navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ]

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animate logo on mount
  useEffect(() => {
    if (logoRef.current) {
      gsap.from(logoRef.current, {
        duration: 0.8,
        opacity: 0,
        y: -20,
        ease: 'power2.out',
      })
    }
  }, [])

  // Animate menu items on open
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      gsap.to(menuRef.current, {
        duration: 0.3,
        opacity: 1,
        y: 0,
        ease: 'power2.out',
      })
    }
  }, [isMenuOpen])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path
  }

  // Menu button variants for animation
  const menuButtonVariants = {
    closed: {
      rotate: 0,
    },
    open: {
      rotate: 45,
    },
  }

  // Hamburger line variants
  const lineVariants = {
    closed: (i) => ({
      rotate: 0,
      y: 0,
      opacity: 1,
    }),
    open: (i) => {
      if (i === 0) return { rotate: 45, y: 8, opacity: 1 }
      if (i === 1) return { rotate: -45, y: -8, opacity: 1 }
      return { opacity: 0 }
    },
  }

  // Menu container variants
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      pointerEvents: 'none',
    },
    open: {
      opacity: 1,
      y: 0,
      pointerEvents: 'auto',
    },
  }

  // Menu item variants
  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: -20,
    },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  }

  return (
    <nav
      ref={navRef}
      className={`navigation ${isScrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}
    >
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" ref={logoRef}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="logo-text"
          >
            <span className="logo-bracket">&lt;</span>
            <span className="logo-name">LeeLoo</span>
            <span className="logo-bracket">/&gt;</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              <motion.span
                whileHover={{ color: '#00ff88' }}
                transition={{ duration: 0.2 }}
              >
                {link.name}
              </motion.span>
              {isActive(link.path) && (
                <motion.div
                  className="nav-link-underline"
                  layoutId="underline"
                  transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger Menu Button */}
        <motion.button
          className="hamburger-menu"
          onClick={toggleMenu}
          variants={menuButtonVariants}
          animate={isMenuOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3 }}
          aria-label="Toggle menu"
        >
          <motion.span
            className="hamburger-line line-1"
            custom={0}
            variants={lineVariants}
            animate={isMenuOpen ? 'open' : 'closed'}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="hamburger-line line-2"
            custom={1}
            variants={lineVariants}
            animate={isMenuOpen ? 'open' : 'closed'}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="hamburger-line line-3"
            custom={2}
            variants={lineVariants}
            animate={isMenuOpen ? 'open' : 'closed'}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            className="nav-menu-mobile"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3 }}
          >
            <div className="nav-menu-content">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  custom={i}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <Link
                    to={link.path}
                    className={`nav-menu-link ${isActive(link.path) ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                    {isActive(link.path) && (
                      <motion.span
                        className="menu-link-indicator"
                        layoutId="menu-indicator"
                        transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                      >
                        •
                      </motion.span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navigation