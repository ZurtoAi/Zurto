import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import '@styles/TextEffects.css'

/**
 * TextEffects Component
 * Reusable text animation component with multiple effect types
 * Features:
 * - Typing effect: Character-by-character reveal animation
 * - Morphing effect: Smooth text transformation between words
 * - Glitch effect: Cyberpunk-style text distortion with color shifts
 * - Configurable speed, delay, and loop behavior
 * - Responsive and performant with GPU acceleration
 */

const TextEffects = React.forwardRef(({
  text = 'Text Effects',
  effect = 'typing',
  speed = 50,
  delay = 0,
  loop = false,
  className = '',
  glitchIntensity = 3,
  morphWords = [],
  onComplete = null,
  colorCycle = false
}, ref) => {
  const containerRef = useRef(null)
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const animationRef = useRef(null)
  const timeoutRef = useRef(null)

  /**
   * Typing Effect: Reveals text character by character
   */
  const applyTypingEffect = () => {
    let charIndex = 0
    const fullText = text
    const typingSpeed = 100 - speed

    const typeChar = () => {
      if (charIndex < fullText.length) {
        setDisplayText(fullText.slice(0, charIndex + 1))
        charIndex++
        animationRef.current = setTimeout(typeChar, typingSpeed)
      } else {
        setIsComplete(true)
        onComplete?.()
        if (loop) {
          timeoutRef.current = setTimeout(() => {
            charIndex = 0
            setDisplayText('')
            setIsComplete(false)
            applyTypingEffect()
          }, 2000)
        }
      }
    }

    timeoutRef.current = setTimeout(typeChar, delay)
  }

  /**
   * Morphing Effect: Smoothly transitions between words
   */
  const applyMorphingEffect = () => {
    const words = morphWords.length > 0 ? morphWords : [text]
    let currentWord = words[wordIndex]
    let targetWord = words[(wordIndex + 1) % words.length]
    let morphProgress = 0
    const morphSpeed = (100 - speed) / 100

    const morphChar = () => {
      if (morphProgress < 1) {
        morphProgress += morphSpeed * 0.05
        const blendedText = blendText(currentWord, targetWord, morphProgress)
        setDisplayText(blendedText)
        animationRef.current = requestAnimationFrame(morphChar)
      } else {
        setWordIndex((prev) => (prev + 1) % words.length)
        currentWord = targetWord
        targetWord = words[(wordIndex + 2) % words.length]
        morphProgress = 0
        setIsComplete(true)
        onComplete?.()

        if (loop) {
          timeoutRef.current = setTimeout(() => {
            setIsComplete(false)
            applyMorphingEffect()
          }, 1500)
        }
      }
    }

    timeoutRef.current = setTimeout(() => {
      applyMorphingEffect()
    }, delay)
  }

  /**
   * Glitch Effect: Creates cyberpunk text distortion
   */
  const applyGlitchEffect = () => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const glitchedText = createGlitchText(text, glitchIntensity)
        setDisplayText(glitchedText)

        setTimeout(() => {
          setDisplayText(text)
        }, 50)
      }
    }, 100)

    timeoutRef.current = setTimeout(() => {
      setDisplayText(text)
      setIsComplete(true)
      onComplete?.()
      clearInterval(glitchInterval)

      if (loop) {
        timeoutRef.current = setTimeout(() => {
          setIsComplete(false)
          applyGlitchEffect()
        }, 1500)
      }
    }, delay + 3000)
  }

  /**
   * Helper: Blend text between two strings
   */
  const blendText = (from, to, progress) => {
    const maxLength = Math.max(from.length, to.length)
    let blended = ''

    for (let i = 0; i < maxLength; i++) {
      const fromChar = from[i] || ' '
      const toChar = to[i] || ' '

      if (progress < i / maxLength) {
        blended += fromChar
      } else {
        blended += toChar
      }
    }

    return blended.trim()
  }

  /**
   * Helper: Create glitch text distortion
   */
  const createGlitchText = (sourceText, intensity) => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    let glitched = ''

    for (let i = 0; i < sourceText.length; i++) {
      if (Math.random() < intensity / 10) {
        glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)]
      } else {
        glitched += sourceText[i]
      }
    }

    return glitched
  }

  /**
   * Initialize effect on mount
   */
  useEffect(() => {
    if (effect === 'typing') {
      applyTypingEffect()
    } else if (effect === 'morphing') {
      applyMorphingEffect()
    } else if (effect === 'glitch') {
      applyGlitchEffect()
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [effect, text, speed, delay, loop, glitchIntensity, morphWords])

  /**
   * Handle color cycling animation
   */
  useEffect(() => {
    if (!colorCycle || !containerRef.current) return

    const colors = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00']
    let colorIndex = 0

    const colorInterval = setInterval(() => {
      containerRef.current.style.color = colors[colorIndex % colors.length]
      colorIndex++
    }, 300)

    return () => clearInterval(colorInterval)
  }, [colorCycle])

  return (
    <motion.div
      ref={(node) => {
        containerRef.current = node
        if (ref) ref.current = node
      }}
      className={`text-effects ${effect} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
    >
      <span className="text-effects__content">{displayText}</span>
      {!isComplete && <span className="text-effects__cursor" />}
    </motion.div>
  )
})

TextEffects.displayName = 'TextEffects'

export default TextEffects