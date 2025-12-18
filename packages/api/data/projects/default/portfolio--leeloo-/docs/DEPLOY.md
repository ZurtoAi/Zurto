# Deployment

## Docker Setup

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Environment Variables
```env
VITE_API_URL=http://localhost:3000
VITE_THEME=dark
VITE_ANIMATION_SPEED=1
```

## Build & Run
```bash
docker build -t leeloofolio .
docker run -p 3000:3000 leeloofolio
```

## Production
- Build: `npm run build` → `dist/`
- Serve via Vercel, Netlify, or static host
- Enable gzip compression
- Lazy-load Three.js scenes
