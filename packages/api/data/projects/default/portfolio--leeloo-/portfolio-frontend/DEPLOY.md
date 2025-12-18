# Deployment Guide – Portfolio Frontend

## Overview

This guide covers deploying the **Portfolio Frontend** (React + Vite + Three.js) to production environments, including Docker setup, environment configuration, and optimization strategies.

---

## Prerequisites

- **Node.js** 18+ and npm/yarn
- **Docker** (optional, for containerized deployment)
- **Git** for version control
- Access to hosting platform (Vercel, Netlify, or static host)

---

## Local Build & Preview

### Development Server
```bash
npm install
npm run dev
```
Runs on `http://localhost:5173` with hot module replacement.

### Production Build
```bash
npm run build
```
Generates optimized bundle in `dist/` directory (~500KB gzipped).

### Preview Production Build
```bash
npm run preview
```
Serves `dist/` locally at `http://localhost:4173` to verify production behavior.

---

## Environment Variables

Create `.env.production` in the project root:

```env
# API Configuration
VITE_API_URL=https://api.yourdomain.com

# Theme Settings
VITE_THEME=dark

# Animation Performance
VITE_ANIMATION_SPEED=1

# Feature Flags
VITE_ENABLE_3D_HERO=true
VITE_ENABLE_BLOG=true
```

### Variable Reference

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | `http://localhost:3000` | Backend API endpoint |
| `VITE_THEME` | `dark` | UI color scheme (dark/light) |
| `VITE_ANIMATION_SPEED` | `1` | Global animation duration multiplier |
| `VITE_ENABLE_3D_HERO` | `true` | Toggle Three.js hero scene |
| `VITE_ENABLE_BLOG` | `true` | Toggle blog section |

---

## Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run production build
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Start server
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Build & Run

```bash
# Build image
docker build -t portfolio-frontend:latest .

# Run container
docker run -p 3000:3000 \
  -e VITE_API_URL=https://api.yourdomain.com \
  -e VITE_THEME=dark \
  portfolio-frontend:latest

# Run with detached mode
docker run -d \
  --name portfolio \
  -p 3000:3000 \
  portfolio-frontend:latest
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: ${VITE_API_URL:-https://api.yourdomain.com}
      VITE_THEME: ${VITE_THEME:-dark}
      VITE_ANIMATION_SPEED: ${VITE_ANIMATION_SPEED:-1}
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped
```

Run with: `docker-compose up -d`

---

## Platform-Specific Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Configure Build Settings**
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

3. **Environment Variables**
   - Add in Vercel Dashboard → Settings → Environment Variables
   - Apply to Production, Preview, Development environments

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Netlify

1. **Connect Repository**
   - Push to GitHub/GitLab/Bitbucket
   - Connect via Netlify Dashboard

2. **Build Configuration** (`netlify.toml`)
   ```toml
   [build]
   command = "npm run build"
   publish = "dist"

   [build.environment]
   NODE_VERSION = "18"

   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

3. **Deploy**
   - Automatic on Git push, or manual via CLI:
   ```bash
   npm i -g netlify-cli
   netlify deploy --prod
   ```

### Static Hosting (AWS S3 + CloudFront)

1. **Build**
   ```bash
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

3. **Configure CloudFront**
   - Create distribution pointing to S3 bucket
   - Set default root object to `index.html`
   - Add error page (404) → `index.html`

4. **Invalidate Cache**
   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
   ```

---

## Performance Optimization

### 1. Bundle Analysis

```bash
npm install -D vite-plugin-visualizer
```

Update `vite.config.js`:
```javascript
import { visualizer } from 'vite-plugin-visualizer';

export default {
  plugins: [visualizer()],
};
```

### 2. Code Splitting

Configure in `vite.config.js`:
```javascript
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'framer-motion': ['framer-motion'],
          'gsap': ['gsap'],
        },
      },
    },
  },
};
```

### 3. Lazy Loading Routes

```javascript
import { lazy, Suspense } from 'react';

const Hero = lazy(() => import('./pages/Hero'));
const Projects = lazy(() => import('./pages/Projects'));
const Blog = lazy(() => import('./pages/Blog'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Suspense>
  );
}
```

### 4. Enable Gzip Compression

**Vercel/Netlify**: Automatic
**Docker/Self-hosted**: Add nginx config
```nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/xml+rss;
gzip_min_length 1000;
```

### 5. Cache Strategies

**Immutable Assets** (Vite default):
- JS bundles: `hash.js` cached indefinitely
- Images: Versioned filenames

**HTML**: No cache (always fetch fresh)
```nginx
location /index.html {
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}

location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
```

---

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use platform secrets (Vercel, Netlify)
- Rotate API keys regularly

### 2. Content Security Policy (CSP)

Add to Nginx/hosting header:
```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' https://cdn.jsdelivr.net; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:;
```

### 3. HTTPS

- Enable SSL/TLS (auto via Vercel/Netlify)
- Redirect HTTP → HTTPS
- Use HSTS header: `Strict-Transport-Security: max-age=31536000`

---

## Monitoring & Logs

### Vercel Analytics

```javascript
// Automatically collected
// View in Vercel Dashboard → Analytics
```

### Custom Logging

```javascript
// src/utils/logger.js
export const logError = (error, context) => {
  console.error(`[${context}]`, error);
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error);
  }
};
```

### Health Checks

Docker health check already included in Dockerfile.

For external monitoring:
```bash
curl -f http://localhost:3000 || exit 1
```

---

## Rollback Procedure

### Vercel
1. Dashboard → Deployments
2. Click deployment to rollback
3. Select "Rollback"

### Docker
```bash
# Pull previous image
docker pull portfolio-frontend:v1.0.0

# Stop current
docker stop portfolio

# Run previous
docker run -d -p 3000:3000 portfolio-frontend:v1.0.0
```

---

## CI/CD Pipeline Example (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Portfolio Frontend

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **White screen on load** | Check console for errors; verify `VITE_API_URL` env var |
| **3D scene not rendering** | Ensure WebGL support; check Three.js logs |
| **Animations stuttering** | Reduce `VITE_ANIMATION_SPEED`; check device performance |
| **Build fails** | Clear `node_modules` & cache: `rm -rf node_modules dist && npm install` |
| **CORS errors** | Configure backend CORS headers; use proxy in development |

---

## Additional Resources

- [Vite Deployment Docs](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/guides/start-guide)
- [Docker Node Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Three.js Optimization](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects)