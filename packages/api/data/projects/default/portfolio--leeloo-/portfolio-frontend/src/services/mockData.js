// src/services/mockData.js

/**
 * Mock Data Service
 * Provides comprehensive mock data for projects and blog posts
 * Includes full metadata, technologies, metrics, and content
 */

export const projectsData = [
  {
    id: 1,
    title: 'Interactive 3D Portfolio',
    slug: 'interactive-3d-portfolio',
    description: 'A fully interactive 3D portfolio website built with Three.js, featuring manipulable geometric objects, particle systems, and real-time shader effects.',
    fullDescription: 'This project showcases advanced 3D web graphics capabilities. Built with Three.js and React, it features fully interactive 3D scenes with custom shaders, particle effects, and real-time rendering. Users can manipulate objects in 3D space using mouse controls.',
    image: '/projects/3d-portfolio.jpg',
    category: 'Web Development',
    technologies: ['Three.js', 'React', 'GLSL', 'Vite', 'WebGL'],
    metrics: {
      performance: 94,
      engagement: 8.7,
      loadTime: '2.3s'
    },
    stats: {
      views: 12500,
      stars: 324,
      forks: 89
    },
    links: {
      github: 'https://github.com/leeloo/3d-portfolio',
      live: 'https://3d-portfolio.leeloo.dev',
      demo: 'https://demo.3d-portfolio.leeloo.dev'
    },
    features: [
      'Real-time 3D rendering',
      'Custom WebGL shaders',
      'Particle system effects',
      'Mouse interaction controls',
      'Responsive design',
      'Performance optimized'
    ],
    timeline: {
      start: '2023-01',
      end: '2023-06'
    },
    featured: true,
    difficulty: 'Advanced'
  },
  {
    id: 2,
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    description: 'Full-stack e-commerce solution with React frontend, Node.js backend, and MongoDB database. Features include shopping cart, checkout flow, and admin dashboard.',
    fullDescription: 'A complete e-commerce platform built with modern web technologies. Features a responsive React frontend with Framer Motion animations, Express.js backend with RESTful APIs, and MongoDB for data persistence. Includes user authentication, product filtering, and a comprehensive admin panel.',
    image: '/projects/ecommerce.jpg',
    category: 'Full Stack',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT'],
    metrics: {
      performance: 88,
      engagement: 9.2,
      loadTime: '1.8s'
    },
    stats: {
      views: 8900,
      stars: 256,
      forks: 142
    },
    links: {
      github: 'https://github.com/leeloo/ecommerce-platform',
      live: 'https://ecommerce.leeloo.dev',
      demo: 'https://demo.ecommerce.leeloo.dev'
    },
    features: [
      'User authentication & authorization',
      'Shopping cart management',
      'Stripe payment integration',
      'Product search & filtering',
      'Admin dashboard',
      'Order tracking',
      'Responsive design'
    ],
    timeline: {
      start: '2023-03',
      end: '2023-10'
    },
    featured: true,
    difficulty: 'Intermediate'
  },
  {
    id: 3,
    title: 'Motion Graphics Animator',
    slug: 'motion-graphics-animator',
    description: 'Web-based tool for creating motion graphics and animations. Built with React and GSAP, featuring timeline editor, keyframe management, and real-time preview.',
    fullDescription: 'A sophisticated animation tool that allows designers to create complex motion graphics directly in the browser. Features include a visual timeline editor, keyframe management system, multiple easing functions, and real-time preview of animations.',
    image: '/projects/animator.jpg',
    category: 'Tools',
    technologies: ['React', 'GSAP', 'Canvas', 'TypeScript', 'Vite'],
    metrics: {
      performance: 91,
      engagement: 8.4,
      loadTime: '2.1s'
    },
    stats: {
      views: 5600,
      stars: 198,
      forks: 67
    },
    links: {
      github: 'https://github.com/leeloo/motion-animator',
      live: 'https://animator.leeloo.dev',
      demo: 'https://demo.animator.leeloo.dev'
    },
    features: [
      'Visual timeline editor',
      'Keyframe management',
      'Multiple easing functions',
      'Real-time preview',
      'Export animations',
      'Undo/Redo system',
      'Save presets'
    ],
    timeline: {
      start: '2023-05',
      end: '2023-09'
    },
    featured: false,
    difficulty: 'Advanced'
  },
  {
    id: 4,
    title: 'Data Visualization Dashboard',
    slug: 'data-viz-dashboard',
    description: 'Interactive data visualization dashboard with real-time charts, custom D3.js visualizations, and responsive grid layout for analytics.',
    fullDescription: 'A comprehensive data visualization platform built with React and D3.js. Features real-time data updates, interactive charts, custom SVG visualizations, and a responsive dashboard layout. Includes filter options and drill-down capabilities.',
    image: '/projects/dashboard.jpg',
    category: 'Data Visualization',
    technologies: ['React', 'D3.js', 'TypeScript', 'Redux', 'Recharts'],
    metrics: {
      performance: 85,
      engagement: 8.9,
      loadTime: '2.5s'
    },
    stats: {
      views: 7200,
      stars: 287,
      forks: 94
    },
    links: {
      github: 'https://github.com/leeloo/data-dashboard',
      live: 'https://dashboard.leeloo.dev',
      demo: 'https://demo.dashboard.leeloo.dev'
    },
    features: [
      'Real-time data updates',
      'Interactive charts',
      'Custom D3 visualizations',
      'Filter & drill-down',
      'Responsive design',
      'Dark/Light theme',
      'Data export'
    ],
    timeline: {
      start: '2023-02',
      end: '2023-08'
    },
    featured: true,
    difficulty: 'Intermediate'
  },
  {
    id: 5,
    title: 'AI Chat Interface',
    slug: 'ai-chat-interface',
    description: 'Modern chat interface with real-time messaging, AI integration, and smooth animations. Built with React, Socket.io, and OpenAI API.',
    fullDescription: 'A sophisticated chat application featuring real-time messaging with Socket.io, AI-powered responses through OpenAI API integration, message history, and typing indicators. UI built with React and animated with Framer Motion.',
    image: '/projects/chat-ai.jpg',
    category: 'Web Development',
    technologies: ['React', 'Socket.io', 'OpenAI API', 'Node.js', 'Express', 'Framer Motion'],
    metrics: {
      performance: 90,
      engagement: 9.1,
      loadTime: '1.9s'
    },
    stats: {
      views: 9800,
      stars: 412,
      forks: 156
    },
    links: {
      github: 'https://github.com/leeloo/ai-chat',
      live: 'https://chat.leeloo.dev',
      demo: 'https://demo.chat.leeloo.dev'
    },
    features: [
      'Real-time messaging',
      'AI responses',
      'Message history',
      'Typing indicators',
      'User authentication',
      'Theme customization',
      'Mobile responsive'
    ],
    timeline: {
      start: '2023-07',
      end: '2024-01'
    },
    featured: true,
    difficulty: 'Intermediate'
  },
  {
    id: 6,
    title: 'Design System Component Library',
    slug: 'design-system-library',
    description: 'Comprehensive React component library with Storybook documentation. Features 50+ components with TypeScript support and extensive customization options.',
    fullDescription: 'A production-ready component library built with React and TypeScript. Includes 50+ reusable UI components, extensive Storybook documentation, dark mode support, and comprehensive accessibility features. Perfect for building consistent applications.',
    image: '/projects/component-lib.jpg',
    category: 'Design Systems',
    technologies: ['React', 'TypeScript', 'Storybook', 'CSS Modules', 'Jest'],
    metrics: {
      performance: 96,
      engagement: 8.6,
      loadTime: '1.5s'
    },
    stats: {
      views: 11200,
      stars: 523,
      forks: 201
    },
    links: {
      github: 'https://github.com/leeloo/component-library',
      live: 'https://components.leeloo.dev',
      npm: 'https://npmjs.com/leeloo-ui'
    },
    features: [
      '50+ UI components',
      'TypeScript support',
      'Storybook docs',
      'Dark mode',
      'Accessibility (a11y)',
      'Theme customization',
      'Tree-shakeable'
    ],
    timeline: {
      start: '2023-04',
      end: '2023-12'
    },
    featured: false,
    difficulty: 'Advanced'
  },
  {
    id: 7,
    title: 'Collaborative Design Tool',
    slug: 'collaborative-design-tool',
    description: 'Real-time collaborative design platform with canvas drawing, shape tools, and live collaboration. Uses WebSockets for instant synchronization.',
    fullDescription: 'A Figma-like collaborative design tool built with React and Canvas API. Features real-time collaboration through WebSockets, multiple shape tools, color picking, layer management, and instant synchronization across users.',
    image: '/projects/design-tool.jpg',
    category: 'Web Development',
    technologies: ['React', 'Canvas API', 'WebSocket', 'Node.js', 'Redis', 'PostgreSQL'],
    metrics: {
      performance: 89,
      engagement: 9.3,
      loadTime: '2.2s'
    },
    stats: {
      views: 6700,
      stars: 334,
      forks: 112
    },
    links: {
      github: 'https://github.com/leeloo/design-tool',
      live: 'https://design.leeloo.dev',
      demo: 'https://demo.design.leeloo.dev'
    },
    features: [
      'Real-time collaboration',
      'Drawing tools',
      'Shape library',
      'Layer management',
      'Color picker',
      'Undo/Redo',
      'Export formats'
    ],
    timeline: {
      start: '2023-06',
      end: '2024-02'
    },
    featured: true,
    difficulty: 'Advanced'
  }
]

export const blogPostsData = [
  {
    id: 1,
    title: 'Getting Started with Three.js in 2024',
    slug: 'threejs-2024-guide',
    excerpt: 'A comprehensive guide to building interactive 3D web experiences with Three.js. Learn the fundamentals and create stunning visualizations.',
    content: 'This article covers the basics of Three.js, including scene setup, lighting, cameras, and basic geometry creation. We\'ll explore how to set up a development environment and create your first 3D scene. Perfect for beginners looking to enter the world of 3D web development.',
    category: 'Web Development',
    tags: ['Three.js', 'WebGL', 'JavaScript', '3D'],
    author: 'LeeLoo',
    date: '2024-01-15',
    readTime: 12,
    image: '/blog/threejs-guide.jpg',
    featured: true,
    difficulty: 'Beginner',
    views: 2340,
    likes: 156
  },
  {
    id: 2,
    title: 'Mastering Framer Motion Animations',
    slug: 'framer-motion-mastery',
    excerpt: 'Deep dive into Framer Motion library. Learn advanced animation techniques, gesture controls, and orchestrating complex sequences.',
    content: 'Explore the power of Framer Motion for creating smooth, performant animations in React. This guide covers variants, gesture animations, shared layout animations, and performance optimization tips. Includes practical examples and best practices for production applications.',
    category: 'Animation',
    tags: ['Framer Motion', 'React', 'Animation', 'Performance'],
    author: 'LeeLoo',
    date: '2024-01-10',
    readTime: 15,
    image: '/blog/framer-motion.jpg',
    featured: true,
    difficulty: 'Intermediate',
    views: 3120,
    likes: 289
  },
  {
    id: 3,
    title: 'Building Scalable React Applications',
    slug: 'scalable-react-apps',
    excerpt: 'Best practices for structuring large React projects. Component architecture, state management, and performance optimization strategies.',
    content: 'Learn how to structure React applications for scalability. Topics include component composition patterns, folder structure conventions, state management solutions, code splitting, and lazy loading. Real-world examples from production applications.',
    category: 'Architecture',
    tags: ['React', 'Architecture', 'Best Practices', 'Scalability'],
    author: 'LeeLoo',
    date: '2024-01-05',
    readTime: 18,
    image: '/blog/react-architecture.jpg',
    featured: true,
    difficulty: 'Intermediate',
    views: 2890,
    likes: 201
  },
  {
    id: 4,
    title: 'CSS Grid and Flexbox Deep Dive',
    slug: 'css-grid-flexbox',
    excerpt: 'Master CSS layout techniques. Compare Grid and Flexbox, learn when to use each, and create responsive layouts without media queries.',
    content: 'A comprehensive guide to modern CSS layout techniques. Learn the differences between CSS Grid and Flexbox, when to use each, and how to combine them effectively. Includes advanced techniques for responsive design and real-world layout patterns.',
    category: 'CSS',
    tags: ['CSS', 'Layout', 'Responsive Design', 'CSS Grid'],
    author: 'LeeLoo',
    date: '2023-12-28',
    readTime: 14,
    image: '/blog/css-layouts.jpg',
    featured: false,
    difficulty: 'Beginner',
    views: 4120,
    likes: 312
  },
  {
    id: 5,
    title: 'WebSocket Real-Time Applications',
    slug: 'websocket-realtime-apps',
    excerpt: 'Build real-time applications with WebSockets. Learn Socket.io, handle connections, and implement collaborative features.',
    content: 'A deep dive into WebSocket technology and Socket.io library. Learn how to establish persistent connections, handle events, manage reconnections, and scale real-time applications. Includes practical examples of collaborative features and chat applications.',
    category: 'Backend',
    tags: ['WebSocket', 'Socket.io', 'Real-time', 'Node.js'],
    author: 'LeeLoo',
    date: '2023-12-20',
    readTime: 16,
    image: '/blog/websockets.jpg',
    featured: false,
    difficulty: 'Intermediate',
    views: 1950,
    likes: 134
  },
  {
    id: 6,
    title: 'Performance Optimization Techniques',
    slug: 'performance-optimization',
    excerpt: 'Optimize web application performance. Code splitting, lazy loading, memoization, and profiling tools for faster applications.',
    content: 'Comprehensive guide to web performance optimization. Topics include code splitting with Webpack, React.memo and useMemo hooks, lazy loading components, image optimization, and using browser DevTools for profiling. Real metrics and case studies included.',
    category: 'Performance',
    tags: ['Performance', 'Optimization', 'React', 'DevTools'],
    author: 'LeeLoo',
    date: '2023-12-15',
    readTime: 17,
    image: '/blog/performance.jpg',
    featured: false,
    difficulty: 'Advanced',
    views: 3450,
    likes: 267
  },
  {
    id: 7,
    title: 'TypeScript for React Development',
    slug: 'typescript-react-guide',
    excerpt: 'Leverage TypeScript in React projects. Type safety, component props typing, hooks with types, and avoiding common pitfalls.',
    content: 'Complete guide to using TypeScript effectively with React. Learn component prop typing, generics for flexible components, typing hooks properly, common patterns, and how to migrate existing React projects to TypeScript. Includes best practices and real-world examples.',
    category: 'TypeScript',
    tags: ['TypeScript', 'React', 'Type Safety', 'Tooling'],
    author: 'LeeLoo',
    date: '2023-12-08',
    readTime: 14,
    image: '/blog/typescript-react.jpg',
    featured: false,
    difficulty: 'Intermediate',
    views: 2670,
    likes: 189
  },
  {
    id: 8,
    title: 'State Management: Redux vs Context API',
    slug: 'state-management-comparison',
    excerpt: 'Compare state management solutions in React. Redux, Context API, Zustand, and choosing the right tool for your project.',
    content: 'In-depth comparison of state management approaches in React. Explore Redux with middleware, Context API hooks, lightweight alternatives like Zustand, and when to use each. Includes performance considerations and migration strategies.',
    category: 'State Management',
    tags: ['Redux', 'Context API', 'State Management', 'React'],
    author: 'LeeLoo',
    date: '2023-12-01',
    readTime: 19,
    image: '/blog/state-management.jpg',
    featured: false,
    difficulty: 'Advanced',
    views: 2200,
    likes: 156
  },
  {
    id: 9,
    title: 'Testing React Components: Unit and E2E',
    slug: 'react-testing-guide',
    excerpt: 'Master React testing. Jest, React Testing Library, Cypress, and complete testing strategies for production applications.',
    content: 'Complete guide to testing React applications. Learn unit testing with Jest and React Testing Library, integration testing approaches, end-to-end testing with Cypress, test coverage goals, and CI/CD integration. Includes best practices and testing patterns.',
    category: 'Testing',
    tags: ['Testing', 'Jest', 'Cypress', 'Quality Assurance'],
    author: 'LeeLoo',
    date: '2023-11-25',
    readTime: 20,
    image: '/blog/testing.jpg',
    featured: true,
    difficulty: 'Intermediate',
    views: 1840,
    likes: 112
  }
]

/**
 * Helper function to get project by ID
 * @param {number} id - Project ID
 * @returns {Object|null} Project object or null if not found
 */
export const getProjectById = (id) => {
  return projectsData.find(project => project.id === id) || null
}

/**
 * Helper function to get project by slug
 * @param {string} slug - Project slug
 * @returns {Object|null} Project object or null if not found
 */
export const getProjectBySlug = (slug) => {
  return projectsData.find(project => project.slug === slug) || null
}

/**
 * Helper function to get all featured projects
 * @returns {Array} Array of featured projects
 */
export const getFeaturedProjects = () => {
  return projectsData.filter(project => project.featured)
}

/**
 * Helper function to get projects by category
 * @param {string} category - Project category
 * @returns {Array} Array of projects in the specified category
 */
export const getProjectsByCategory = (category) => {
  return projectsData.filter(project => project.category === category)
}

/**
 * Helper function to get blog post by ID
 * @param {number} id - Blog post ID
 * @returns {Object|null} Blog post object or null if not found
 */
export const getBlogPostById = (id) => {
  return blogPostsData.find(post => post.id === id) || null
}

/**
 * Helper function to get blog post by slug
 * @param {string} slug - Blog post slug
 * @returns {Object|null} Blog post object or null if not found
 */
export const getBlogPostBySlug = (slug) => {
  return blogPostsData.find(post => post.slug === slug) || null
}

/**
 * Helper function to get all featured blog posts
 * @returns {Array} Array of featured blog posts
 */
export const getFeaturedBlogPosts = () => {
  return blogPostsData.filter(post => post.featured).sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Helper function to get blog posts by category
 * @param {string} category - Blog post category
 * @returns {Array} Array of blog posts in the specified category
 */
export const getBlogPostsByCategory = (category) => {
  return blogPostsData.filter(post => post.category === category).sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Helper function to get blog posts by tag
 * @param {string} tag - Blog post tag
 * @returns {Array} Array of blog posts with the specified tag
 */
export const getBlogPostsByTag = (tag) => {
  return blogPostsData.filter(post => post.tags.includes(tag)).sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Helper function to get all unique categories from projects
 * @returns {Array} Array of unique project categories
 */
export const getProjectCategories = () => {
  return [...new Set(projectsData.map(project => project.category))]
}

/**
 * Helper function to get all unique categories from blog posts
 * @returns {Array} Array of unique blog post categories
 */
export const getBlogCategories = () => {
  return [...new Set(blogPostsData.map(post => post.category))]
}

/**
 * Helper function to get all unique tags from blog posts
 * @returns {Array} Array of unique blog post tags
 */
export const getBlogTags = () => {
  return [...new Set(blogPostsData.flatMap(post => post.tags))]
}

/**
 * Helper function to search blog posts
 * @param {string} query - Search query
 * @returns {Array} Array of matching blog posts
 */
export const searchBlogPosts = (query) => {
  const lowerQuery = query.toLowerCase()
  return blogPostsData.filter(post =>
    post.title.toLowerCase().includes(lowerQuery) ||
    post.excerpt.toLowerCase().includes(lowerQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Helper function to search projects
 * @param {string} query - Search query
 * @returns {Array} Array of matching projects
 */
export const searchProjects = (query) => {
  const lowerQuery = query.toLowerCase()
  return projectsData.filter(project =>
    project.title.toLowerCase().includes(lowerQuery) ||
    project.description.toLowerCase().includes(lowerQuery) ||
    project.technologies.some(tech => tech.toLowerCase().includes(lowerQuery))
  )
}

export default {
  projectsData,
  blogPostsData,
  getProjectById,
  getProjectBySlug,
  getFeaturedProjects,
  getProjectsByCategory,
  getBlogPostById,
  getBlogPostBySlug,
  getFeaturedBlogPosts,
  getBlogPostsByCategory,
  getBlogPostsByTag,
  getProjectCategories,
  getBlogCategories,
  getBlogTags,
  searchBlogPosts,
  searchProjects
}