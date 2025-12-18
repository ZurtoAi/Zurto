import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useScrollPosition Hook
 * Custom hook for tracking scroll position and triggering animations
 * Integrates with GSAP ScrollTrigger for scroll-based animation triggers
 * Returns scroll data, progress, direction, and provides animation registration
 *
 * Features:
 * - Scroll position tracking with performance optimization
 * - Scroll direction detection (up/down)
 * - Scroll progress calculation (0-1)
 * - GSAP ScrollTrigger integration for animation triggers
 * - Velocity calculation for momentum-based animations
 * - Callback system for custom scroll events
 */
export const useScrollPosition = (triggerConfig = {}) => {
  const [scrollData, setScrollData] = useState({
    y: 0,
    x: 0,
    progress: 0,
    direction: 'down',
    velocity: 0,
    isScrolling: false,
  })

  const previousScrollY = useRef(0)
  const scrollVelocity = useRef(0)
  const scrollTimeout = useRef(null)
  const animationFrameId = useRef(null)
  const callbacksRef = useRef([])

  /**
   * Calculate scroll progress as percentage (0-1)
   * Based on document scrollable height
   */
  const calculateProgress = useCallback(() => {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const totalScroll = documentHeight - windowHeight

    if (totalScroll === 0) return 0
    return window.scrollY / totalScroll
  }, [])

  /**
   * Calculate scroll velocity for momentum-based animations
   */
  const calculateVelocity = useCallback((currentY, previousY, deltaTime) => {
    if (deltaTime === 0) return 0
    return (currentY - previousY) / deltaTime
  }, [])

  /**
   * Determine scroll direction
   */
  const getScrollDirection = useCallback((currentY, previousY) => {
    if (currentY > previousY) return 'down'
    if (currentY < previousY) return 'up'
    return 'none'
  }, [])

  /**
   * Register callback for custom scroll events
   */
  const addScrollCallback = useCallback((callback) => {
    callbacksRef.current.push(callback)
    return () => {
      callbacksRef.current = callbacksRef.current.filter(cb => cb !== callback)
    }
  }, [])

  /**
   * Trigger all registered callbacks
   */
  const triggerCallbacks = useCallback((scrollInfo) => {
    callbacksRef.current.forEach(callback => {
      try {
        callback(scrollInfo)
      } catch (error) {
        console.error('Error in scroll callback:', error)
      }
    })
  }, [])

  /**
   * Handle scroll event with RAF for performance
   */
  const handleScroll = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }

    animationFrameId.current = requestAnimationFrame(() => {
      const currentY = window.scrollY
      const currentX = window.scrollX
      const progress = calculateProgress()
      const direction = getScrollDirection(currentY, previousScrollY.current)
      const deltaTime = 16 // Approximate delta for 60fps

      scrollVelocity.current = calculateVelocity(
        currentY,
        previousScrollY.current,
        deltaTime
      )

      const newScrollData = {
        y: currentY,
        x: currentX,
        progress,
        direction,
        velocity: scrollVelocity.current,
        isScrolling: true,
      }

      setScrollData(newScrollData)
      triggerCallbacks(newScrollData)
      previousScrollY.current = currentY

      // Clear scrolling flag after inactivity
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      scrollTimeout.current = setTimeout(() => {
        setScrollData(prev => ({ ...prev, isScrolling: false }))
        scrollVelocity.current = 0
      }, 150)
    })
  }, [calculateProgress, getScrollDirection, calculateVelocity, triggerCallbacks])

  /**
   * Create GSAP ScrollTrigger for animation trigger
   */
  const createScrollTrigger = useCallback((element, onTrigger, options = {}) => {
    if (!element) return null

    return ScrollTrigger.create({
      trigger: element,
      start: options.start || 'top center',
      end: options.end || 'bottom center',
      markers: process.env.NODE_ENV === 'development' && options.markers,
      onEnter: () => onTrigger?.('enter'),
      onLeave: () => onTrigger?.('leave'),
      onEnterBack: () => onTrigger?.('enterBack'),
      onLeaveBack: () => onTrigger?.('leaveBack'),
      onUpdate: (self) => onTrigger?.('update', self),
      ...options,
    })
  }, [])

  /**
   * Animate to specific scroll position
   */
  const scrollTo = useCallback((position, duration = 1) => {
    gsap.to(window, {
      scrollTo: {
        y: position,
        autoKill: true,
      },
      duration,
      ease: 'power2.inOut',
    })
  }, [])

  /**
   * Smooth scroll to element
   */
  const scrollToElement = useCallback((element, offset = 0, duration = 1) => {
    if (!element) return

    const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset

    scrollTo(targetPosition, duration)
  }, [scrollTo])

  /**
   * Lock scroll (useful for modals)
   */
  const lockScroll = useCallback(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }, [])

  /**
   * Unlock scroll
   */
  const unlockScroll = useCallback(() => {
    document.body.style.overflow = 'auto'
    document.body.style.paddingRight = '0px'
  }, [])

  /**
   * Get scroll-based animation value (0-1)
   */
  const getScrollAnimationValue = useCallback((element, startOffset = 0, endOffset = 0) => {
    if (!element) return 0

    const rect = element.getBoundingClientRect()
    const elementTop = rect.top + window.scrollY
    const elementBottom = rect.bottom + window.scrollY
    const windowTop = window.scrollY - startOffset
    const windowBottom = window.scrollY + window.innerHeight + endOffset

    if (elementBottom < windowTop || elementTop > windowBottom) {
      return elementTop > windowBottom ? 0 : 1
    }

    const progress = (window.scrollY + window.innerHeight - elementTop) /
      (window.innerHeight + (elementBottom - elementTop))

    return Math.max(0, Math.min(1, progress))
  }, [])

  /**
   * Setup scroll event listener
   */
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [handleScroll])

  /**
   * Refresh ScrollTrigger on mount
   */
  useEffect(() => {
    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return {
    scrollData,
    progress: scrollData.progress,
    direction: scrollData.direction,
    isScrolling: scrollData.isScrolling,
    velocity: scrollData.velocity,
    addScrollCallback,
    createScrollTrigger,
    scrollTo,
    scrollToElement,
    lockScroll,
    unlockScroll,
    getScrollAnimationValue,
  }
}

export default useScrollPosition