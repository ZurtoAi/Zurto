import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import ProjectCard from '@components/ProjectCard'
import ProjectModal from '@components/ProjectModal'
import '@styles/ProjectsPage.css'

/**
 * ProjectsPage Component
 * Displays projects in a responsive grid with filtering and modal details
 * Features:
 * - Dynamic project filtering by tech stack
 * - Animated grid layout with stagger effects
 * - Modal view for detailed project information
 * - GSAP timeline animations for smooth transitions
 */

const ProjectsPage = () => {
  // Mock projects data - in production, fetch from API
  const allProjects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with real-time inventory management',
      image: '/projects/ecommerce.jpg',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'Full Stack',
      metrics: {
        performance: 98,
        accessibility: 95,
        seo: 92,
      },
      link: 'https://example.com/ecommerce',
      github: 'https://github.com/example/ecommerce',
    },
    {
      id: 2,
      title: '3D Data Visualization',
      description: 'Interactive 3D data visualization dashboard using Three.js',
      image: '/projects/3d-viz.jpg',
      tags: ['Three.js', 'React', 'D3.js', 'WebGL'],
      category: 'Frontend',
      metrics: {
        performance: 92,
        accessibility: 88,
        seo: 85,
      },
      link: 'https://example.com/3d-viz',
      github: 'https://github.com/example/3d-viz',
    },
    {
      id: 3,
      title: 'Real-Time Chat Application',
      description: 'WebSocket-based chat app with user authentication and rooms',
      image: '/projects/chat-app.jpg',
      tags: ['React', 'WebSocket', 'Express', 'PostgreSQL'],
      category: 'Full Stack',
      metrics: {
        performance: 96,
        accessibility: 92,
        seo: 80,
      },
      link: 'https://example.com/chat',
      github: 'https://github.com/example/chat-app',
    },
    {
      id: 4,
      title: 'AI Content Generator',
      description: 'AI-powered content generation tool with multiple model support',
      image: '/projects/ai-generator.jpg',
      tags: ['React', 'Python', 'OpenAI', 'Node.js'],
      category: 'AI/ML',
      metrics: {
        performance: 94,
        accessibility: 90,
        seo: 88,
      },
      link: 'https://example.com/ai-gen',
      github: 'https://github.com/example/ai-generator',
    },
    {
      id: 5,
      title: 'Mobile Fitness Tracker',
      description: 'Cross-platform fitness tracking app with cloud sync',
      image: '/projects/fitness-tracker.jpg',
      tags: ['React Native', 'Firebase', 'TypeScript'],
      category: 'Mobile',
      metrics: {
        performance: 95,
        accessibility: 93,
        seo: 75,
      },
      link: 'https://example.com/fitness',
      github: 'https://github.com/example/fitness-tracker',
    },
    {
      id: 6,
      title: 'Design System Library',
      description: 'Reusable component library with Storybook documentation',
      image: '/projects/design-system.jpg',
      tags: ['React', 'Storybook', 'CSS-in-JS', 'TypeScript'],
      category: 'Frontend',
      metrics: {
        performance: 99,
        accessibility: 98,
        seo: 90,
      },
      link: 'https://example.com/design-system',
      github: 'https://github.com/example/design-system',
    },
    {
      id: 7,
      title: 'Analytics Dashboard',
      description: 'Real-time analytics dashboard with custom data visualization',
      image: '/projects/analytics.jpg',
      tags: ['React', 'D3.js', 'Node.js', 'PostgreSQL'],
      category: 'Full Stack',
      metrics: {
        performance: 97,
        accessibility: 94,
        seo: 89,
      },
      link: 'https://example.com/analytics',
      github: 'https://github.com/example/analytics',
    },
  ]

  const categories = ['All', 'Full Stack', 'Frontend', 'Mobile', 'AI/ML']
  const allTags = Array.from(new Set(allProjects.flatMap(p => p.tags)))

  // State management
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeTags, setActiveTags] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter projects based on active category and tags
  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
      const categoryMatch = activeCategory === 'All' || project.category === activeCategory
      const tagMatch = activeTags.length === 0 || activeTags.some(tag => project.tags.includes(tag))
      return categoryMatch && tagMatch
    })
  }, [activeCategory, activeTags])

  // Handle category filter change
  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category)
  }, [])

  // Handle tag filter toggle
  const handleTagToggle = useCallback((tag) => {
    setActiveTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }, [])

  // Handle project card click
  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }, [])

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }, [])

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setActiveCategory('All')
    setActiveTags([])
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
  }

  const filterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className="projects-page"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
    >
      {/* Page header */}
      <motion.div className="projects-header" variants={itemVariants}>
        <h1>Featured Projects</h1>
        <p>Explore a selection of projects showcasing my expertise across various technologies and domains</p>
      </motion.div>

      {/* Filter section */}
      <motion.div className="projects-filters" variants={filterVariants}>
        {/* Category filters */}
        <div className="filter-group">
          <h3>Category</h3>
          <div className="filter-buttons">
            {categories.map(category => (
              <motion.button
                key={category}
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tag filters */}
        <div className="filter-group">
          <h3>Technologies</h3>
          <div className="filter-tags">
            {allTags.map(tag => (
              <motion.button
                key={tag}
                className={`filter-tag ${activeTags.includes(tag) ? 'active' : ''}`}
                onClick={() => handleTagToggle(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Clear filters button */}
        {(activeCategory !== 'All' || activeTags.length > 0) && (
          <motion.button
            className="clear-filters-btn"
            onClick={handleClearFilters}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Filters
          </motion.button>
        )}
      </motion.div>

      {/* Results count */}
      <motion.div className="results-count" variants={itemVariants}>
        <p>Showing {filteredProjects.length} of {allProjects.length} projects</p>
      </motion.div>

      {/* Projects grid */}
      <motion.div
        className="projects-grid"
        variants={containerVariants}
      >
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                layout
              >
                <ProjectCard
                  project={project}
                  onClick={() => handleProjectClick(project)}
                  index={index}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="no-results"
              variants={itemVariants}
            >
              <p>No projects match your filters. Try adjusting your selection.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Project detail modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <ProjectModal
            project={selectedProject}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ProjectsPage