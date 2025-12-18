import { useState, useEffect } from 'react'

/**
 * useWindowSize Hook
 * Custom hook for tracking responsive window dimensions
 * Returns width and height, updates on window resize with debouncing
 * Useful for responsive layouts, Three.js camera adjustments, and media queries
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  const [isTablet, setIsTablet] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false
  )

  useEffect(() => {
    let timeoutId

    const handleResize = () => {
      clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        const width = window.innerWidth
        const height = window.innerHeight

        setWindowSize({
          width,
          height,
        })

        setIsMobile(width < 768)
        setIsTablet(width >= 768 && width < 1024)
      }, 150)
    }

    window.addEventListener('resize', handleResize)

    // Initial size calculation
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
  }
}

export default useWindowSize