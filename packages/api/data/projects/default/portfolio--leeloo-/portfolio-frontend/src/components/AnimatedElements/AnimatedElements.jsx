import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

/**
 * AnimatedElements Component
 * Reusable wrapper component providing Framer Motion and GSAP animation capabilities
 * Features:
 * - Flexible animation variants (fade, slide, scale, rotate)
 * - GSAP timeline support for complex sequences
 * - Automatic scroll-trigger animations
 * - Stagger effects for child elements
 * - Customizable timing and easing functions
 * - Support for both enter and exit animations
 */

const AnimatedElements = ({
  children,
  variant = 'fadeIn',
  duration = 0.6,
  delay = 0,
  stagger = 0.1,
  useGsap = false,
  triggerOnScroll = false,
  className = '',
  onAnimationComplete = null,
  customVariants = null,
}) => {
  const elementRef = useRef(null)

  // Predefined animation variants for Framer Motion
  const variants = customVariants || {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideInLeft: {
      initial: { opacity: 0, x: -100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 },
    },
    slideInRight: {
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 100 },
    },
    slideInUp: {
      initial: { opacity: 0, y: 100 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 100 },
    },
    slideInDown: {
      initial: { opacity: 0, y: -100 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -100 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
    rotateIn: {
      initial: { opacity: 0, rotate: -10 },
      animate: { opacity: 1, rotate: 0 },
      exit: { opacity: 0, rotate: -10 },
    },
    popIn: {
      initial: { opacity: 0, scale: 0 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
    blurIn: {
      initial: { opacity: 0, filter: 'blur(10px)' },
      animate: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(10px)' },
    },
  }

  // Get the selected variant
  const selectedVariant = variants[variant] || variants.fadeIn

  // Easing functions for smooth animations
  const easingOptions = {
    easeInOut: [0.42, 0, 0.58, 1],
    easeOut: [0.34, 1.56, 0.64, 1],
    easeIn: [0.42, 0, 1, 1],
    spring: { type: 'spring', stiffness: 100, damping: 15 },
  }

  // Initialize GSAP animation with scroll trigger
  useEffect(() => {
    if (!useGsap || !elementRef.current) return

    const element = elementRef.current
    const timeline = gsap.timeline({
      scrollTrigger: triggerOnScroll
        ? {
            trigger: element,
            start: 'top 80%',
            end: 'top 20%',
            scrub: false,
            once: true,
          }
        : undefined,
    })

    // Set initial state
    gsap.set(element, {
      opacity: 0,
      y: 50,
    })

    // Animate to final state
    timeline.to(element, {
      opacity: 1,
      y: 0,
      duration: duration,
      delay: delay,
      ease: 'power2.out',
      onComplete: onAnimationComplete,
    })

    return () => {
      if (timeline) timeline.kill()
    }
  }, [useGsap, triggerOnScroll, duration, delay, onAnimationComplete])

  // Framer Motion animation configuration
  const transitionConfig = {
    duration: duration,
    delay: delay,
    ease: 'easeInOut',
  }

  // Stagger effect for child elements
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: stagger * 0.5,
      },
    },
  }

  // Use GSAP or Framer Motion based on prop
  if (useGsap) {
    return (
      <div ref={elementRef} className={className}>
        {children}
      </div>
    )
  }

  // Framer Motion wrapper
  return (
    <motion.div
      ref={elementRef}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={selectedVariant}
      transition={transitionConfig}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  )
}

/**
 * AnimatedContainer Component
 * Wrapper for animating multiple children with stagger effect
 * Used for lists, grids, and grouped elements
 */
export const AnimatedContainer = ({
  children,
  stagger = 0.1,
  duration = 0.6,
  delay = 0,
  className = '',
  onAnimationComplete = null,
}) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: stagger * 0.5,
        staggerDirection: -1,
      },
    },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: duration * 0.5 },
    },
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onAnimationComplete={onAnimationComplete}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  )
}

/**
 * useAnimationTrigger Hook
 * Custom hook for triggering animations based on scroll position or other events
 */
export const useAnimationTrigger = (shouldAnimate = true) => {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!shouldAnimate || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [shouldAnimate])

  return { ref, isInView }
}

export default AnimatedElements