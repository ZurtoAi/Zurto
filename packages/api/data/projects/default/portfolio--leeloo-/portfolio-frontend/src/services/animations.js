// src/services/animations.js

/**
 * Animation Configurations and Utilities Service
 * Provides Framer Motion and GSAP animation presets, variants, and helper functions
 * Coordinates complex animation sequences across the portfolio
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Framer Motion Variants for Common Animation Patterns
 */
export const animationVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  // Slide animations
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  scaleInCenter: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
    transition: { duration: 0.7, ease: 'easeOut' },
  },

  // Rotate animations
  rotateIn: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: -10 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  // Blur animations (using filter)
  blurIn: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  // Stagger container for children
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  // Stagger item
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
}

/**
 * Page transition variants
 */
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

/**
 * Hero section animation variants
 */
export const heroVariants = {
  container: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  },
  titleLine: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' },
  },
  subtitle: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
  },
  ctaButton: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.4 },
    hover: { scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)' },
  },
}

/**
 * Project card animation variants
 */
export const projectCardVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 40 },
  transition: { duration: 0.6, ease: 'easeOut' },
  hover: {
    y: -10,
    boxShadow: '0 20px 40px rgba(0, 255, 255, 0.2)',
    transition: { duration: 0.3 },
  },
}

/**
 * Blog card animation variants
 */
export const blogCardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.5, ease: 'easeOut' },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3 },
  },
}

/**
 * Modal animation variants
 */
export const modalVariants = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  content: {
    initial: { opacity: 0, scale: 0.9, y: 50 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 50 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

/**
 * Text animation variants (typing, morphing effects)
 */
export const textVariants = {
  container: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  character: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
  },
}

/**
 * Form field animation variants
 */
export const formFieldVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

/**
 * Loading spinner animation variants
 */
export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: 'linear' },
  },
}

/**
 * GSAP Timeline Configurations
 */
export const gsapTimelines = {
  /**
   * Creates a hero entrance timeline
   */
  heroEntrance: (elements) => {
    const tl = gsap.timeline()

    tl.fromTo(
      elements.title,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0
    )
      .fromTo(
        elements.subtitle,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        0.2
      )
      .fromTo(
        elements.button,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out' },
        0.4
      )

    return tl
  },

  /**
   * Creates a stagger animation for list items
   */
  staggerItems: (items, duration = 0.5, stagger = 0.1) => {
    const tl = gsap.timeline()

    tl.fromTo(
      items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration, stagger, ease: 'power2.out' }
    )

    return tl
  },

  /**
   * Creates a scroll-triggered animation
   */
  scrollTrigger: (target, animation = {}) => {
    return gsap.to(target, {
      scrollTrigger: {
        trigger: target,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        markers: false,
      },
      ...animation,
    })
  },
}

/**
 * Easing functions library
 */
export const easingFunctions = {
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  fastSmooth: 'cubic-bezier(0.43, 0.13, 0.15, 0.96)',
  slowSmooth: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
}

/**
 * Helper function to create custom animation timeline
 */
export const createCustomTimeline = (config = {}) => {
  const {
    delay = 0,
    repeat = 0,
    repeatDelay = 0,
    ease = 'power2.out',
  } = config

  return {
    delay,
    repeat,
    repeatDelay,
    ease,
  }
}

/**
 * Helper function to animate element on scroll with GSAP ScrollTrigger
 */
export const animateOnScroll = (element, animationProps = {}) => {
  if (!element) return

  const {
    fromValues = { opacity: 0, y: 50 },
    toValues = { opacity: 1, y: 0 },
    duration = 0.8,
    triggerStart = 'top 80%',
    triggerEnd = 'bottom 20%',
    markers = false,
  } = animationProps

  gsap.fromTo(
    element,
    fromValues,
    {
      ...toValues,
      duration,
      scrollTrigger: {
        trigger: element,
        start: triggerStart,
        end: triggerEnd,
        markers,
        onEnter: () => {
          gsap.to(element, { ...toValues, duration })
        },
      },
    }
  )
}

/**
 * Helper function for parallax scroll effect
 */
export const parallaxScroll = (element, speed = 0.5) => {
  if (!element) return

  gsap.to(element, {
    y: () => window.innerHeight * speed * -1,
    scrollTrigger: {
      trigger: element,
      scrub: true,
      markers: false,
    },
  })
}

/**
 * Helper function to animate counter numbers
 */
export const animateCounter = (element, endValue, duration = 2, format = 'number') => {
  if (!element) return

  const counter = { value: 0 }

  gsap.to(counter, {
    value: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      if (format === 'percent') {
        element.textContent = `${Math.round(counter.value)}%`
      } else if (format === 'decimal') {
        element.textContent = counter.value.toFixed(1)
      } else {
        element.textContent = Math.round(counter.value)
      }
    },
  })
}

/**
 * Helper function to create pulse/glow effect
 */
export const pulseEffect = (element, duration = 2, intensity = 0.3) => {
  if (!element) return

  const tl = gsap.timeline({ repeat: -1, yoyo: true })

  tl.to(
    element,
    {
      boxShadow: `0 0 ${20 * intensity}px rgba(0, 255, 255, ${intensity})`,
      duration,
      ease: 'sine.inOut',
    },
    0
  )

  return tl
}

/**
 * Helper function for text morphing effect preparation
 */
export const prepareMorphingText = (texts = []) => {
  return texts.map((text, index) => ({
    id: index,
    text,
    duration: 0.5,
  }))
}

/**
 * Helper function to handle window resize with animation adjustments
 */
export const handleResizeAnimation = (callback) => {
  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      callback()
      ScrollTrigger.refresh()
    }, 250)
  })
}

/**
 * Animation performance configuration
 */
export const animationPerformanceConfig = {
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  gpuAcceleration: true,
  willChange: true,
  backfaceVisibility: 'hidden',
}

/**
 * Get animation config based on performance preference
 */
export const getAnimationConfig = () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return {
    duration: prefersReduced ? 0.1 : 0.6,
    stagger: prefersReduced ? 0.01 : 0.1,
    ease: 'power2.out',
    skipAnimation: prefersReduced,
  }
}

export default {
  animationVariants,
  pageTransitionVariants,
  heroVariants,
  projectCardVariants,
  blogCardVariants,
  modalVariants,
  textVariants,
  formFieldVariants,
  spinnerVariants,
  gsapTimelines,
  easingFunctions,
  createCustomTimeline,
  animateOnScroll,
  parallaxScroll,
  animateCounter,
  pulseEffect,
  prepareMorphingText,
  handleResizeAnimation,
  animationPerformanceConfig,
  getAnimationConfig,
}