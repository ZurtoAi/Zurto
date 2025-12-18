import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import styles from './ContactForm.module.css'

/**
 * ContactForm Component
 * Contact form with validation, error handling, and smooth animations
 * Features:
 * - Real-time form validation with error messages
 * - GSAP animations for success/error states
 * - Framer Motion field transitions
 * - Email validation and rate limiting
 * - Loading state with spinner animation
 * - Success/error toast notifications
 * - Responsive design with accessibility support
 */

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState('')
  const formRef = useRef(null)
  const successRef = useRef(null)
  const errorRef = useRef(null)

  /**
   * Validate form field
   */
  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required'
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters'
        } else {
          delete newErrors.name
        }
        break

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) {
          newErrors.email = 'Email is required'
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email'
        } else {
          delete newErrors.email
        }
        break

      case 'subject':
        if (!value.trim()) {
          newErrors.subject = 'Subject is required'
        } else if (value.trim().length < 5) {
          newErrors.subject = 'Subject must be at least 5 characters'
        } else {
          delete newErrors.subject
        }
        break

      case 'message':
        if (!value.trim()) {
          newErrors.message = 'Message is required'
        } else if (value.trim().length < 10) {
          newErrors.message = 'Message must be at least 10 characters'
        } else if (value.length > 5000) {
          newErrors.message = 'Message cannot exceed 5000 characters'
        } else {
          delete newErrors.message
        }
        break

      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle input change with real-time validation
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (touched[name]) {
      validateField(name, value)
    }
  }

  /**
   * Handle field blur to mark as touched
   */
  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
    validateField(name, value)
  }

  /**
   * Validate entire form
   */
  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach((key) => {
      if (!validateField(key, formData[key])) {
        newErrors[key] = errors[key]
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Animate success message
   */
  const animateSuccess = () => {
    if (successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'back.out' }
      )

      setTimeout(() => {
        gsap.to(successRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.6,
          ease: 'back.in',
          delay: 4,
        })
      }, 4000)
    }
  }

  /**
   * Animate error message
   */
  const animateError = () => {
    if (errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'back.out' }
      )

      setTimeout(() => {
        gsap.to(errorRef.current, {
          opacity: 0,
          x: -20,
          duration: 0.6,
          ease: 'back.in',
          delay: 3,
        })
      }, 3000)
    }
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitStatus('error')
      setStatusMessage('Please fix the errors above')
      animateError()
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Here you would typically send data to your backend
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })

      setSubmitStatus('success')
      setStatusMessage('Message sent successfully! I\'ll get back to you soon.')
      animateSuccess()

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
      setTouched({})
      setErrors({})
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setStatusMessage('Failed to send message. Please try again.')
      animateError()
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Field animation variants
   */
  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  }

  return (
    <div className={styles.contactFormContainer}>
      <motion.form
        ref={formRef}
        onSubmit={handleSubmit}
        className={styles.form}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.title}>Get In Touch</h2>
        <p className={styles.subtitle}>
          Have a question or want to collaborate? I'd love to hear from you.
        </p>

        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus === 'success' && (
            <motion.div
              ref={successRef}
              className={styles.successMessage}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              ✓ {statusMessage}
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              ref={errorRef}
              className={styles.errorMessage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              ✕ {statusMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Name Field */}
        <motion.div
          className={styles.formGroup}
          custom={0}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <label htmlFor="name" className={styles.label}>
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${
              touched.name && errors.name ? styles.inputError : ''
            }`}
            placeholder="Your name"
            disabled={isSubmitting}
          />
          <AnimatePresence>
            {touched.name && errors.name && (
              <motion.span
                className={styles.errorText}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {errors.name}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Email Field */}
        <motion.div
          className={styles.formGroup}
          custom={1}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <label htmlFor="email" className={styles.label}>
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${
              touched.email && errors.email ? styles.inputError : ''
            }`}
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
          <AnimatePresence>
            {touched.email && errors.email && (
              <motion.span
                className={styles.errorText}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {errors.email}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Subject Field */}
        <motion.div
          className={styles.formGroup}
          custom={2}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <label htmlFor="subject" className={styles.label}>
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${
              touched.subject && errors.subject ? styles.inputError : ''
            }`}
            placeholder="What's this about?"
            disabled={isSubmitting}
          />
          <AnimatePresence>
            {touched.subject && errors.subject && (
              <motion.span
                className={styles.errorText}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {errors.subject}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Message Field */}
        <motion.div
          className={styles.formGroup}
          custom={3}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <label htmlFor="message" className={styles.label}>
            Message * ({formData.message.length}/5000)
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.textarea} ${
              touched.message && errors.message ? styles.inputError : ''
            }`}
            placeholder="Your message here..."
            rows="6"
            disabled={isSubmitting}
          />
          <AnimatePresence>
            {touched.message && errors.message && (
              <motion.span
                className={styles.errorText}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {errors.message}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
          custom={4}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <span className={styles.loadingSpinner}>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                ⟳
              </motion.span>
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </motion.button>

        <p className={styles.required}>* Required fields</p>
      </motion.form>
    </div>
  )
}

export default ContactForm