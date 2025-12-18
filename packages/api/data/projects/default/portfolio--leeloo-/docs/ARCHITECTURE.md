# Architecture

## Component Hierarchy
```
App
├── Layout
│   ├── Navigation
│   └── Footer
├── Pages
│   ├── Hero (3D Scene, Text Effects)
│   ├── Projects (Grid, Detail Modals)
│   ├── Blog (Card List, Individual Post)
│   └── Contact
├── Components
│   ├── ThreeScene
│   ├── ProjectCard
│   ├── ProjectModal
│   ├── BlogCard
│   ├── TextEffects (Typing/Morphing/Glitch)
│   └── AnimatedElements
└── Services
    ├── mockData.js (7 projects, 9 posts)
    └── animations.js (GSAP/Framer Motion configs)
```

## Data Flow
```
mockData (JSON)
    ↓
Context/Store
    ↓
Pages & Components
    ↓
Framer Motion/GSAP
    ↓
UI Rendering + 3D
```

## Key Libraries
- **Framer Motion/GSAP**: Text effects, component animations
- **Three.js**: 3D manipulable elements in hero
- **React Router**: Page transitions
