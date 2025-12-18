import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import BlogCard from './BlogCard'
import styles from './BlogList.module.css'

/**
 * BlogList Component
 * Displays blog posts in a paginated grid layout with filtering and sorting
 * Features:
 * - Responsive grid layout (1-3 columns based on screen size)
 * - Pagination controls with page navigation
 * - Filter by category (All, Web, Design, Tutorial, etc.)
 * - Sort options (Newest, Oldest, Most Read, Title A-Z)
 * - Animated page transitions with Framer Motion
 * - Search/filter animations with GSAP
 * - Loading states and empty states
 */

const BlogList = ({ posts = [], itemsPerPage = 6 }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const cats = new Set(['All'])
    posts.forEach(post => {
      if (post.category) cats.add(post.category)
    })
    return Array.from(cats)
  }, [posts])

  // Filter posts by category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [posts, selectedCategory, searchQuery])

  // Sort filtered posts
  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts]
    
    switch (sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date))
      case 'mostRead':
        return sorted.sort((a, b) => (b.views || 0) - (a.views || 0))
      case 'titleAZ':
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  }, [filteredPosts, sortBy])

  // Paginate sorted posts
  const totalPages = Math.ceil(sortedPosts.length / itemsPerPage)
  const paginatedPosts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage
    const endIdx = startIdx + itemsPerPage
    return sortedPosts.slice(startIdx, endIdx)
  }, [sortedPosts, currentPage, itemsPerPage])

  // Reset to first page when filters change
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort)
    setCurrentPage(1)
  }, [])

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((pageNum) => {
    setCurrentPage(pageNum)
    // Scroll to top of list with smooth behavior
    const listElement = document.getElementById('blog-list-container')
    if (listElement) {
      listElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: { opacity: 0 },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    exit: { opacity: 0, y: -20 },
  }

  const noResultsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className={styles.blogListContainer} id="blog-list-container">
      {/* Search Bar */}
      <motion.div
        className={styles.searchBar}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={styles.searchInput}
        />
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </motion.div>

      {/* Filter and Sort Controls */}
      <motion.div
        className={styles.controlsContainer}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Category Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Category:</label>
          <div className={styles.categoryButtons}>
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`${styles.categoryBtn} ${
                  selectedCategory === category ? styles.active : ''
                }`}
                onClick={() => handleCategoryChange(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className={styles.filterGroup}>
          <label htmlFor="sortSelect" className={styles.filterLabel}>
            Sort by:
          </label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostRead">Most Read</option>
            <option value="titleAZ">Title A-Z</option>
          </select>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        className={styles.resultsInfo}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span>
          Showing {paginatedPosts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, sortedPosts.length)} of {sortedPosts.length} posts
        </span>
      </motion.div>

      {/* Blog Posts Grid */}
      <div className={styles.blogGrid}>
        <AnimatePresence mode="wait">
          {paginatedPosts.length > 0 ? (
            <motion.div
              key={`page-${currentPage}-${selectedCategory}-${sortBy}`}
              className={styles.postsContainer}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {paginatedPosts.map((post, index) => (
                <motion.div
                  key={post.id || index}
                  variants={itemVariants}
                  className={styles.blogCardWrapper}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className={styles.noResults}
              variants={noResultsVariants}
              initial="hidden"
              animate="visible"
            >
              <div className={styles.noResultsIcon}>📝</div>
              <h3>No posts found</h3>
              <p>Try adjusting your filters or search query</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && paginatedPosts.length > 0 && (
        <motion.div
          className={styles.paginationContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Previous Button */}
          <motion.button
            className={`${styles.paginationBtn} ${styles.prevBtn} ${
              currentPage === 1 ? styles.disabled : ''
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
            whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
          >
            ← Previous
          </motion.button>

          {/* Page Numbers */}
          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNum = i + 1
              // Show first page, last page, current page, and adjacent pages
              const isVisible =
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - currentPage) <= 1

              if (!isVisible && i > 0 && i < totalPages - 1) {
                // Show ellipsis
                if (i === 1 || (pageNum === currentPage - 2 && currentPage > 3)) {
                  return <span key={`ellipsis-${i}`} className={styles.ellipsis}>
                    ...
                  </span>
                }
                return null
              }

              return (
                <motion.button
                  key={pageNum}
                  className={`${styles.pageBtn} ${
                    currentPage === pageNum ? styles.active : ''
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                  whileHover={currentPage !== pageNum ? { scale: 1.1 } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  {pageNum}
                </motion.button>
              )
            })}
          </div>

          {/* Next Button */}
          <motion.button
            className={`${styles.paginationBtn} ${styles.nextBtn} ${
              currentPage === totalPages ? styles.disabled : ''
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
            whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
          >
            Next →
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default BlogList