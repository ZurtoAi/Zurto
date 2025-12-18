import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import '@styles/Footer.css'

/**
 * Footer Component
 * Footer with navigation links, social media, and contact information
 * Features:
 * - Animated social media icons with hover effects
 * - Quick navigation links
 * - Email contact link
 * - Neon glow effects on hover
 * - Responsive design
 * - Back to top button with smooth scroll animation
 */
const Footer = () => {
  const footerRef = useRef(null)
  const socialLinksRef = useRef([])

  useEffect(() => {
    // Animate social links on mount
    if (socialLinksRef.current.length > 0) {
      gsap.from(socialLinksRef.current, {
        duration: 0.6,
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: 'back.out',
      })
    }

    // Add hover animation to social links
    socialLinksRef.current.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          duration: 0.3,
          scale: 1.2,
          textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
          ease: 'power2.out',
        })
      })

      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          duration: 0.3,
          scale: 1,
          textShadow: '0 0 5px rgba(0, 255, 255, 0.3)',
          ease: 'power2.out',
        })
      })
    })
  }, [])

  const scrollToTop = () => {
    gsap.to(window, {
      duration: 0.8,
      scrollTo: 0,
      ease: 'power2.inOut',
    })
  }

  const currentYear = new Date().getFullYear()

  const navigationLinks = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ]

  const socialLinks = [
    {
      label: 'GitHub',
      url: 'https://github.com',
      icon: '◎',
    },
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: '⚡',
    },
    {
      label: 'Twitter',
      url: 'https://twitter.com',
      icon: '✦',
    },
    {
      label: 'Email',
      url: 'mailto:contact@example.com',
      icon: '✉',
    },
  ]

  return (
    <footer ref={footerRef} className="footer">
      <motion.div
        className="footerContent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Main Footer Grid */}
        <div className="footerGrid">
          {/* Branding Section */}
          <motion.div
            className="footerSection brandSection"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="brandName">LeeLoo</h3>
            <p className="brandTagline">Full Stack Developer & Creative Technologist</p>
            <p className="brandDescription">
              Crafting immersive digital experiences with modern web technologies.
            </p>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            className="footerSection linksSection"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="sectionTitle">Navigation</h4>
            <nav className="footerNav">
              {navigationLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="footerLink"
                  ref={(el) => (socialLinksRef.current[index] = el)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="footerSection socialSection"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="sectionTitle">Connect</h4>
            <div className="socialLinks">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="socialLink"
                  title={social.label}
                  ref={(el) => (socialLinksRef.current[navigationLinks.length + index] = el)}
                  aria-label={social.label}
                >
                  <span className="socialIcon">{social.icon}</span>
                  <span className="socialLabel">{social.label}</span>
                </a>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Divider */}
        <motion.div
          className="footerDivider"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        />

        {/* Bottom Footer */}
        <div className="footerBottom">
          <motion.div
            className="footerCopyright"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p>
              © {currentYear} LeeLoo Portfolio. All rights reserved. Designed & Built with
              <span className="heartIcon">💜</span>
            </p>
          </motion.div>

          {/* Back to Top Button */}
          <motion.button
            className="backToTopBtn"
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            aria-label="Back to top"
          >
            ↑
          </motion.button>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer