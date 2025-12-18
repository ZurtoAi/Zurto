import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@components/Navigation'
import Footer from '@components/Footer'
import '@styles/Layout.css'

/**
 * Layout Component
 * Main wrapper component that provides consistent structure across all pages
 * Features:
 * - Navigation header with smooth animations
 * - Dynamic page content with fade transitions
 * - Footer with social links and info
 * - Responsive layout for all screen sizes
 * - Page transition animations
 * - Scroll-to-top on route change
 */
const Layout = ({ children }) => {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Page transition animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4,
        ease: 'easeIn',
      },
    },
  }

  return (
    <div className="layout">
      {/* Navigation Header */}
      <Navigation />

      {/* Main Content Area */}
      <main className="layout__main">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="layout__content"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Layout