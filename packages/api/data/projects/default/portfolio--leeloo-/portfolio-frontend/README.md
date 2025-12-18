# Portfolio Frontend

A modern, heavily animated portfolio website built with React, Vite, and Three.js. Features interactive 3D elements, neon aesthetics, and smooth animations showcasing projects and blog posts.

## 🎨 Features

- **Interactive 3D Hero Section**: Manipulable Three.js elements with text effects (typing, morphing, glitch)
- **7 Featured Projects**: Grid layout with detailed project cards, tech breakdowns, and performance metrics
- **9 Blog Posts**: Card-based blog section with individual post pages
- **Smooth Animations**: Powered by Framer Motion and GSAP for fluid interactions
- **Dark Modern Aesthetic**: Neon-inspired design with CSS3 gradients and effects
- **Fully Responsive**: Mobile-first design approach
- **Fast Performance**: Vite-based build system with code splitting and lazy loading

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | React 18 |
| **Build Tool** | Vite |
| **3D Graphics** | Three.js |
| **Animation** | Framer Motion, GSAP |
| **Routing** | React Router v6 |
| **Styling** | CSS3 (Custom, no frameworks) |
| **Code Quality** | ESLint, Prettier |

## 📋 Prerequisites

- Node.js 18+ or higher
- npm or yarn package manager

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd portfolio-frontend

# Install dependencies
npm install
```

### Development

```bash
# Start the development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## 📁 Project Structure

```
portfolio-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navigation.jsx
│   │   ├── Footer.jsx
│   │   ├── ThreeScene.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectModal.jsx
│   │   ├── BlogCard.jsx
│   │   ├── TextEffects.jsx
│   │   └── AnimatedElements.jsx
│   ├── pages/           # Page components
│   │   ├── Hero.jsx
│   │   ├── Projects.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPost.jsx
│   │   └── Contact.jsx
│   ├── services/        # Utilities and data
│   │   ├── mockData.js
│   │   ├── animations.js
│   │   └── utils.js
│   ├── styles/          # Global and component styles
│   │   └── index.css
│   ├── App.jsx          # Main app component
│   ├── Layout.jsx       # Layout wrapper
│   └── main.jsx         # Entry point
├── .eslintrc.json       # ESLint configuration
├── .prettierrc           # Prettier configuration
├── .gitignore           # Git ignore rules
├── .dockerignore         # Docker ignore rules
├── Dockerfile           # Docker configuration
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## 🎯 Key Components

### Hero Section
- Full-screen animated background with Three.js
- Dynamic text effects: typing animation, morphing text, glitch effect
- Call-to-action buttons with hover animations

### Projects Page
- Grid layout displaying 7 featured projects
- Project cards with hover effects and tech stack indicators
- Modal view for detailed project information
- Performance metrics and live demo links

### Blog Section
- Card-based blog listing with 9 posts
- Individual blog post pages with full content
- Related posts suggestions
- Reading time estimates

### Navigation
- Sticky header with smooth scroll behavior
- Mobile hamburger menu
- Active page highlighting
- Smooth page transitions

## 🎬 Animation Libraries

### Framer Motion
Used for:
- Component entrance/exit animations
- Interactive micro-interactions
- Page transitions
- Modal animations

### GSAP
Used for:
- Text effect sequencing
- Complex scroll-triggered animations
- 3D scene animations
- Performance-critical animations

### Three.js
- Interactive 3D models in hero section
- Real-time rendering and manipulation
- WebGL-based graphics
- Lazy-loaded for performance

## 🔧 Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:3000
VITE_THEME=dark
VITE_ANIMATION_SPEED=1
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:3000` |
| `VITE_THEME` | Theme mode (dark/light) | `dark` |
| `VITE_ANIMATION_SPEED` | Global animation speed multiplier | `1` |

## 📦 Build & Deployment

### Local Build

```bash
# Build for production
npm run build

# Output: dist/ folder with optimized files
```

### Docker Deployment

```bash
# Build Docker image
docker build -t portfolio-frontend:latest .

# Run container
docker run -p 3000:3000 portfolio-frontend:latest
```

### Cloud Hosting Options

#### Vercel
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Static Hosting (AWS S3, GitHub Pages, etc.)
1. Run `npm run build`
2. Upload `dist/` folder contents
3. Configure CDN with gzip compression

## 🚨 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting via Vite
- **Lazy Loading**: Three.js scenes load on demand
- **Image Optimization**: Compressed assets in public folder
- **Gzip Compression**: Enable on hosting platform
- **Bundle Analysis**: Run `npm run build -- --analyze` to check sizes

## 🧪 Code Quality

### ESLint
Configured with React and accessibility best practices:
```bash
npm run lint
```

### Prettier
Automatic code formatting:
```bash
npm run format
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## 📝 Customization

### Adding Projects
Edit `src/services/mockData.js` and add to the projects array:
```javascript
{
  id: 8,
  title: 'Your Project',
  description: 'Description here',
  technologies: ['React', 'Three.js'],
  metrics: { users: 1000, performance: '95%' },
  link: 'https://example.com'
}
```

### Adding Blog Posts
Update the posts array in `src/services/mockData.js`:
```javascript
{
  id: 10,
  title: 'Blog Post Title',
  content: 'Full content here',
  date: '2024-01-15',
  readTime: 5,
  category: 'Development'
}
```

### Theming
Modify CSS variables in `src/styles/index.css`:
```css
:root {
  --primary-color: #00ff00;
  --secondary-color: #ff00ff;
  --background: #0a0a0a;
}
```

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md) - Component hierarchy and data flow
- [Deployment Guide](./DEPLOY.md) - Production deployment instructions

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5173 already in use | `npm run dev -- --port 5174` |
| Three.js not rendering | Clear cache: `rm -rf node_modules && npm install` |
| Build errors | Ensure Node.js 18+: `node --version` |
| Slow animations | Reduce `VITE_ANIMATION_SPEED` in `.env.local` |

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For issues, questions, or feedback, please open an issue on the repository.

---

**Last Updated**: 2024  
**Version**: 1.0.0  
**Maintainer**: Portfolio Team