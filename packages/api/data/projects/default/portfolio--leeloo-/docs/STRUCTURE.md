# Project Structure

```
leeloofolio/
├── src/
│   ├── components/
│   │   ├── Hero/
│   │   ├── Projects/
│   │   ├── Blog/
│   │   ├── Navigation/
│   │   └── TextEffects/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── BlogPage.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── mockData.js (7 projects, 9 posts)
│   │   ├── animations.js
│   │   └── three-utils.js
│   ├── styles/
│   │   ├── global.css (neon theme)
│   │   └── animations.css
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── assets/ (images, textures)
├── docker/
│   └── Dockerfile
├── package.json
└── vite.config.js
```

## Key Files
- `mockData.js`: 7 projects + 9 blog posts
- `components/TextEffects/`: Typing, morphing, glitch animations
- `components/Hero/ThreeScene.jsx`: 3D interactive elements
