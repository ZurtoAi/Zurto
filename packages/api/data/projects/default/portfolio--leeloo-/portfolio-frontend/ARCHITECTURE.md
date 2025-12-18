# Architecture

## Overview

Portfolio Frontend is a modern, heavily animated React application built with Vite, featuring interactive 3D elements powered by Three.js, and sophisticated animations using Framer Motion and GSAP. The application showcases a portfolio with projects, blog posts, and an engaging hero section.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Bundler** | Vite | Fast build tool and dev server |
| **Framework** | React 18 | UI component library |
| **Routing** | React Router v6 | Client-side navigation |
| **3D Graphics** | Three.js | Interactive 3D hero scene |
| **Animations** | Framer Motion, GSAP | Component and text animations |
| **Styling** | CSS3 | Neon aesthetics and responsive design |
| **State Management** | React Context/Hooks | Local state management |

## Project Structure

```
portfolio-frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Navigation.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── Hero/
│   │   │   ├── Hero.jsx
│   │   │   ├── ThreeScene.jsx
│   │   │   └── TextEffects.jsx
│   │   ├── Projects/
│   │   │   ├── ProjectGrid.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   └── ProjectModal.jsx
│   │   ├── Blog/
│   │   │   ├── BlogList.jsx
│   │   │   ├── BlogCard.jsx
│   │   │   └── BlogPost.jsx
│   │   ├── Contact/
│   │   │   └── Contact.jsx
│   │   └── Common/
│   │       ├── AnimatedButton.jsx
│   │       └── AnimatedText.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── BlogPage.jsx
│   │   ├── BlogDetailPage.jsx
│   │   └── ContactPage.jsx
│   ├── services/
│   │   ├── mockData.js
│   │   ├── animations.js
│   │   └── constants.js
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   ├── animations.css
│   │   └── responsive.css
│   ├── hooks/
│   │   ├── useScrollAnimation.js
│   │   ├── useWindowSize.js
│   │   └── use3DScene.js
│   ├── contexts/
│   │   └── ThemeContext.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
├── .eslintrc.json
├── .prettierrc
└── .gitignore
```

## Component Hierarchy

```
App
│
├── Router
│   ├── HomePage
│   │   ├── Navigation
│   │   ├── Hero
│   │   │   ├── ThreeScene
│   │   │   └── TextEffects (Typing/Morphing/Glitch)
│   │   ├── ProjectGrid
│   │   │   └── ProjectCard (×7)
│   │   ├── BlogPreview
│   │   │   └── BlogCard (×3 featured)
│   │   ├── Contact
│   │   └── Footer
│   │
│   ├── ProjectsPage
│   │   ├── Navigation
│   │   ├── ProjectGrid
│   │   │   ├── ProjectCard (×7)
│   │   │   └── ProjectModal (detail view)
│   │   └── Footer
│   │
│   ├── BlogPage
│   │   ├── Navigation
│   │   ├── BlogFilter
│   │   ├── BlogList
│   │   │   └── BlogCard (×9)
│   │   └── Footer
│   │
│   ├── BlogDetailPage
│   │   ├── Navigation
│   │   ├── BlogPost
│   │   │   └── BlogContent
│   │   ├── RelatedPosts
│   │   └── Footer
│   │
│   └── ContactPage
│       ├── Navigation
│       ├── ContactForm
│       └── Footer
│
└── ThemeProvider
    └── Layout
        └── Global Styles
```

## Data Flow Architecture

```
mockData.js (Static JSON)
    │
    ├── projects[] (7 items)
    │   └── { id, title, description, tech, link, metrics }
    │
├── posts[] (9 items)
    │   └── { id, title, excerpt, content, tags, date }
    │
└── Context API (ThemeContext)
    │
    ├── useContext(Theme)
    │   └── [Across Components]
    │
    ├── Pages
    │   └── useParams, useNavigate (React Router)
    │
    └── Components
        ├── useAnimation (Framer Motion/GSAP)
        ├── useEffect (Scene initialization)
        └── State Management (useState, useCallback)
            │
            └── UI Render + 3D Scene
                ├── Three.js Canvas
                ├── Framer Motion Animations
                └── CSS3 Styling
```

## Key Components

### Hero Section
- **ThreeScene.jsx**: Manages Three.js canvas, camera, lighting, and manipulable 3D objects
- **TextEffects.jsx**: Implements typing, morphing, and glitch effects for hero text
- **Hero.jsx**: Orchestrates hero layout with animations and scene interaction

### Projects
- **ProjectGrid.jsx**: Responsive grid layout for 7 featured projects
- **ProjectCard.jsx**: Individual project card with tech stack and hover effects
- **ProjectModal.jsx**: Detailed project view modal with metrics and links

### Blog
- **BlogList.jsx**: List view with filter/sort functionality
- **BlogCard.jsx**: Blog post preview card with excerpt and metadata
- **BlogPost.jsx**: Full blog post display with content rendering

### Layout
- **Navigation.jsx**: Fixed/sticky header with routing links and theme toggle
- **Footer.jsx**: Footer with social links and copyright
- **Layout.jsx**: Wrapper component for consistent page structure

## Animation Strategy

### Framer Motion Usage
- Page transitions and route changes
- Component entrance/exit animations
- Scroll-triggered animations (scroll to reveal)
- Modal and overlay animations

### GSAP Usage
- Text effects (typing, character morphing, glitch)
- Continuous/loop animations
- Complex timeline-based sequences
- Performance-critical animations

### CSS3 Usage
- Neon glow effects and shadows
- Gradient backgrounds
- Hover state transitions
- Responsive animations

## State Management

### Context API
- **ThemeContext**: Dark/light theme toggle (persisted to localStorage)

### Local Component State
- Form inputs (contact form)
- Modal visibility states
- Filter/sort states (blog)
- 3D scene interaction states

### URL-based State
- React Router params for blog post details
- Query parameters for filtering/pagination (optional)

## Styling Architecture

### CSS Variables
```css
--primary-color: #00ff00
--secondary-color: #ff00ff
--background: #0a0a0a
--text: #ffffff
--accent: #00ffff
--neon-glow: drop-shadow(0 0 10px var(--primary-color))
```

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px, 1440px
- Flexible grid and flex layouts
- Optimized Three.js rendering for mobile

## Performance Considerations

### Code Splitting
- Lazy-load blog detail pages with React.lazy()
- Route-based code splitting via React Router

### Asset Optimization
- Three.js scene lazy initialization
- Image optimization and lazy loading
- CSS minification via Vite

### Animation Performance
- Use `will-change` CSS property strategically
- GPU-accelerated transforms (translate, scale, rotate)
- RequestAnimationFrame for smooth 60fps animations
- Memoize expensive computations (useMemo, useCallback)

### Bundle Size
- Tree-shake unused Three.js modules
- Dynamic imports for heavy libraries
- Gzip compression on production server

## Environment Configuration

### Development
```env
VITE_API_URL=http://localhost:3000
VITE_THEME=dark
VITE_ANIMATION_SPEED=1
VITE_DEBUG=false
```

### Production
```env
VITE_API_URL=https://leeloofolio.com
VITE_THEME=dark
VITE_ANIMATION_SPEED=1
VITE_DEBUG=false
```

## Build & Deployment

### Development
```bash
npm run dev      # Start Vite dev server (HMR enabled)
npm run lint     # ESLint check
npm run preview  # Build preview server
```

### Production
```bash
npm run build    # Create optimized dist/ bundle
```

### Hosting
- **Vercel/Netlify**: Recommended for serverless deployment
- **Docker**: Containerized deployment (see DEPLOY.md)
- **Static Host**: S3, GitHub Pages, or similar (requires build output)

## Security & Best Practices

- **Content Security Policy**: Headers configured for static assets
- **Environment Variables**: Never commit sensitive data
- **XSS Protection**: Sanitize user input in blog/contact forms
- **Dependencies**: Regular npm audit and updates
- **Git Hooks**: Husky pre-commit linting (optional)

## Future Scalability

### Potential Enhancements
- **Backend Integration**: Replace mockData.js with API calls
- **Authentication**: User accounts for blog comments
- **Analytics**: Track user interactions and performance
- **PWA**: Service worker for offline functionality
- **Headless CMS**: Content management system integration
- **Internationalization**: Multi-language support via i18n
- **Dark/Light Theme**: Extend with more theme options

## File Naming Conventions

- **Components**: PascalCase (e.g., `ProjectCard.jsx`)
- **Utilities/Hooks**: camelCase (e.g., `useScrollAnimation.js`)
- **Styles**: kebab-case (e.g., `global.css`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `ANIMATION_DURATION`)