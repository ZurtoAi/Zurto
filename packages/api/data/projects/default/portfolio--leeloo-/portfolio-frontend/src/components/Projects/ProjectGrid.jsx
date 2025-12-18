import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import styles from './ProjectGrid.module.css'

/**
 * ProjectGrid Component
 * Grid layout for projects with advanced filtering and sorting capabilities
 * Features:
 * - Dynamic grid layout with responsive columns
 * - Filter by tech stack and project category
 * - Sort by date, name, or performance metrics
 * - Animated project cards with stagger effects
 * - Modal detail view on card click
 * - Search functionality
 */

const ProjectGrid = ({ projects = [] }) => {
  // State management
  const [selectedProject, setSelectedProject] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState([])
  const [sortBy, setSortBy] = useState('date')
  const [filterCategory, setFilterCategory] = useState('all')

  // Extract unique tech stacks and categories from projects
  const availableTechs = useMemo(() => {
    const techs = new Set()
    projects.forEach(project => {
      project.techStack?.forEach(tech => techs.add(tech))
    })
    return Array.from(techs).sort()
  }, [projects])

  const categories = useMemo(() => {
    const cats = new Set(['all'])
    projects.forEach(project => {
      if (project.category) cats.add(project.category)
    })
    return Array.from(cats)
  }, [projects])

  // Filter projects based on search, filters, and category
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search query filter
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = filterCategory === 'all' || project.category === filterCategory

      // Tech stack filter
      const matchesTechs = selectedFilters.length === 0 || 
        selectedFilters.some(filter => 
          project.techStack?.includes(filter)
        )

      return matchesSearch && matchesCategory && matchesTechs
    })
  }, [projects, searchQuery, selectedFilters, filterCategory])

  // Sort projects
  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects]
    
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'date':
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case 'performance':
        sorted.sort((a, b) => (b.performance?.score || 0) - (a.performance?.score || 0))
        break
      default:
        break
    }
    
    return sorted
  }, [filteredProjects, sortBy])

  // Handle tech filter toggle
  const handleTechFilter = useCallback((tech) => {
    setSelectedFilters(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    )
  }, [])

  // Handle project card click
  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project)
    setModalOpen(true)
  }, [])

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
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
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  const filterButtonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  return (
    <div className={styles.projectGridContainer}>
      {/* Header Section */}
      <motion.div
        className={styles.gridHeader}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.gridTitle}>Featured Projects</h2>
        <p className={styles.gridSubtitle}>
          Explore {projects.length} projects showcasing innovation and technical expertise
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        className={styles.searchContainer}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.searchIcon}>🔍</span>
      </motion.div>

      {/* Controls Section */}
      <motion.div
        className={styles.controlsSection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {/* Category Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Category:</label>
          <div className={styles.categoryButtons}>
            {categories.map(category => (
              <motion.button
                key={category}
                variants={filterButtonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setFilterCategory(category)}
                className={`${styles.categoryButton} ${
                  filterCategory === category ? styles.active : ''
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className={styles.sortGroup}>
          <label htmlFor="sort-select" className={styles.sortLabel}>Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="date">Latest First</option>
            <option value="name">Name (A-Z)</option>
            <option value="performance">Performance Score</option>
          </select>
        </div>
      </motion.div>

      {/* Tech Stack Filters */}
      <motion.div
        className={styles.techFilters}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p className={styles.techFilterLabel}>Filter by technology:</p>
        <div className={styles.techFilterButtons}>
          {availableTechs.map(tech => (
            <motion.button
              key={tech}
              variants={filterButtonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleTechFilter(tech)}
              className={`${styles.techButton} ${
                selectedFilters.includes(tech) ? styles.active : ''
              }`}
            >
              {tech}
              {selectedFilters.includes(tech) && (
                <span className={styles.checkmark}>✓</span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Results Counter */}
      <motion.div
        className={styles.resultsInfo}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <p>Showing {sortedProjects.length} of {projects.length} projects</p>
      </motion.div>

      {/* Projects Grid */}
      {sortedProjects.length > 0 ? (
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {sortedProjects.map(project => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                exit="exit"
                layoutId={project.id}
                className={styles.gridItem}
              >
                <div onClick={() => handleProjectClick(project)}>
                  <ProjectCard project={project} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          className={styles.noResults}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className={styles.noResultsText}>
            No projects match your filters. Try adjusting your search criteria.
          </p>
        </motion.div>
      )}

      {/* Project Modal */}
      <AnimatePresence>
        {modalOpen && selectedProject && (
          <ProjectModal
            project={selectedProject}
            isOpen={modalOpen}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProjectGrid