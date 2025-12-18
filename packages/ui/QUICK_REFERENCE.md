# 📖 Quick Reference Guide - zurto-ui Interactive Documentation

**Status**: LIVE at http://localhost:4173  
**Last Updated**: December 18, 2025

---

## 🚀 Quick Commands

### Development

```bash
cd zurto-ui
npm install              # Install dependencies
npm run docs:dev         # Start dev server (port 5173)
npm run docs:build       # Build production docs
```

### Docker Deployment

```bash
cd Zurto-V3
docker compose build --no-cache zurto-ui-docs  # Rebuild container
docker compose up -d zurto-ui-docs             # Start container
docker compose logs -f zurto-ui-docs           # View logs
docker compose restart zurto-ui-docs           # Restart service
```

### Health Check

```powershell
Invoke-WebRequest -Uri "http://localhost:4173" -UseBasicParsing
# Should return: StatusCode 200
```

---

## 📝 Adding Interactive Previews

### Basic Preview

```markdown
<ComponentPreview 
  title="Component Name"
  code="<YourComponent prop='value'>Content</YourComponent>"
  height="200px"
/>
```

### Multi-Component Preview

```markdown
<ComponentPreview 
  title="Multiple Components"
  code="<div style={{ display: 'flex', gap: '12px' }}><ZButton>One</ZButton><ZButton variant='primary'>Two</ZButton></div>"
  height="180px"
/>
```

### Form Example

```markdown
<ComponentPreview 
  title="Form Demo"
  code="<div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}><ZInput label='Email' placeholder='you@example.com' /><ZButton variant='primary' fullWidth>Submit</ZButton></div>"
  height="280px"
/>
```

---

## 🎨 Styling Guidelines

### Color Variables

```css
--zurto-bg-dark: #0a0a0a; /* Primary background */
--zurto-accent: #df3e53; /* Accent color */
--zurto-text: #e0e0e0; /* Text color */
--zurto-border: #2a2a2a; /* Borders */
```

### Common Patterns

```css
/* Card styling */
background: rgba(26, 26, 26, 0.8);
backdrop-filter: blur(10px);
border-radius: 12px;
border: 1px solid #2a2a2a;

/* Hover effect */
transition: all 0.2s ease;
&:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(223, 62, 83, 0.2);
}
```

---

## 📂 File Structure Reference

```
docs/
├── .vitepress/
│   ├── theme/
│   │   ├── components/
│   │   │   └── ComponentPreview.vue  # Preview component
│   │   ├── styles/
│   │   │   └── enhanced.css          # Custom styles
│   │   └── index.ts                   # Theme entry
│   └── config.ts                      # Site config
├── index.md                           # Home page
├── components/
│   ├── index.md                       # Components overview
│   ├── button/
│   │   └── ZButton.md                 # Button docs
│   ├── form/
│   │   ├── index.md                   # Form category
│   │   └── ZInput.md                  # Input docs
│   └── ...
└── guide/
    └── getting-started.md             # Getting started
```

---

## 🔧 Common Tasks

### Add New Component Documentation

1. Create file: `docs/components/{category}/{ComponentName}.md`
2. Add frontmatter and title
3. Add import example
4. Add usage sections with code blocks
5. Add `<ComponentPreview>` after each code block
6. Add props table
7. Update category index if needed

**Template**:

```markdown
# ComponentName

Component description

## Import

\`\`\`tsx
import { ComponentName } from "zurto-ui";
\`\`\`

## Usage

### Basic Example

\`\`\`tsx
<ComponentName>Content</ComponentName>
\`\`\`

<ComponentPreview 
  title="Live Demo"
  code="<ComponentName>Content</ComponentName>"
  height="150px"
/>

## Props

| Prop      | Type     | Default     | Description    |
| --------- | -------- | ----------- | -------------- |
| `variant` | `string` | `'default'` | Visual variant |
```

### Update Navigation

Edit `docs/.vitepress/config.ts`:

```ts
sidebar: {
  '/components/': [
    {
      text: 'Category Name',
      items: [
        { text: 'Component', link: '/components/category/Component' },
        // Add new items here
      ]
    }
  ]
}
```

### Modify Theme Styles

Edit `docs/.vitepress/theme/styles/enhanced.css`:

```css
/* Add new styles at the end */
.your-custom-class {
  /* Your styles */
}
```

Then rebuild:

```bash
npm run docs:build
```

---

## 🐛 Troubleshooting

### Build Fails

**Issue**: Syntax error in markdown
**Fix**: Check ComponentPreview syntax, ensure code prop is properly escaped

```markdown
<!-- ❌ Wrong -->
<ComponentPreview code='<Component prop="value">' />

<!-- ✅ Correct -->
<ComponentPreview code="<Component prop='value' />" />
```

### Preview Not Showing

**Issue**: ComponentPreview not rendering
**Fix**: Ensure ComponentPreview is registered in theme/index.ts:

```ts
import ComponentPreview from "./components/ComponentPreview.vue";
app.component("ComponentPreview", ComponentPreview);
```

### Docker Build Fails

**Issue**: Docker build error
**Fix**: Clear cache and rebuild:

```bash
docker compose down
docker system prune -a
docker compose build --no-cache zurto-ui-docs
docker compose up -d zurto-ui-docs
```

### Port Already in Use

**Issue**: Port 4173 in use
**Fix**: Stop container and restart:

```bash
docker compose stop zurto-ui-docs
docker compose up -d zurto-ui-docs
```

Or change port in `docker-compose.yml`:

```yaml
ports:
  - "4174:80" # Change to different port
```

---

## 📊 Performance Tips

### Optimize Bundle Size

```ts
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          sandpack: ["sandpack-vue3"],
        },
      },
    },
  },
};
```

### Lazy Load Previews

```markdown
<!-- Only load when in viewport -->

<ComponentPreview 
  v-if="isVisible"
  code="..."
/>
```

### Reduce Preview Heights

```markdown
<!-- Shorter heights = faster render -->

<ComponentPreview
height="150px" <!-- Instead of 400px -->
/>
```

---

## 🔐 Best Practices

### Code Examples

1. **Keep code concise**: Focus on the component being demonstrated
2. **Use inline styles**: Avoid external CSS dependencies
3. **Escape quotes properly**: Use single quotes in code prop
4. **Set appropriate heights**: Match content size
5. **Test before committing**: Verify preview works

### Documentation

1. **Show before interact**: Static code example, then preview
2. **Progressive complexity**: Basic → Advanced examples
3. **Consistent structure**: Follow existing component docs
4. **Accessibility notes**: Include A11y information
5. **Props documentation**: Complete prop tables

### Styling

1. **Use CSS variables**: For consistent theming
2. **Follow spacing scale**: 4px, 8px, 12px, 16px, 24px
3. **Maintain dark theme**: Test all changes in dark mode
4. **Responsive design**: Test on mobile/tablet
5. **Performance first**: Minimize animations

---

## 📈 Monitoring

### Build Metrics

```bash
npm run docs:build
# Look for: "build complete in XXs"
# Target: <40s
```

### Bundle Size

```bash
ls -lh docs/.vitepress/dist/assets/
# Check: *.js file sizes
# Target: Individual chunks <500KB
```

### Live Site Check

```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:4173" -UseBasicParsing

# Expected: StatusCode 200
# Expected: Content-Length ~75000
```

---

## 🔄 Update Workflow

### Regular Updates

1. **Edit Documentation**

   ```bash
   cd zurto-ui/docs
   # Edit markdown files
   ```

2. **Test Locally**

   ```bash
   npm run docs:dev
   # Visit http://localhost:5173
   ```

3. **Build Production**

   ```bash
   npm run docs:build
   # Verify: "build complete"
   ```

4. **Deploy Docker**

   ```bash
   cd ../Zurto-V3
   docker compose build --no-cache zurto-ui-docs
   docker compose up -d zurto-ui-docs
   ```

5. **Verify Live**
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:4173" -UseBasicParsing
   # Check: StatusCode 200
   ```

---

## 🎯 Key Files to Know

### Critical Files

- `docs/.vitepress/config.ts` - Navigation, site config
- `docs/.vitepress/theme/index.ts` - Theme registration
- `docs/.vitepress/theme/styles/enhanced.css` - Custom styles
- `docs/.vitepress/theme/components/ComponentPreview.vue` - Preview component
- `docs/index.md` - Home page
- `Zurto-V3/docker-compose.yml` - Docker config
- `Zurto-V3/Dockerfile.uidocs` - Docker build

### Don't Edit

- `docs/.vitepress/dist/` - Auto-generated build output
- `docs/.vitepress/cache/` - Build cache
- `node_modules/` - Dependencies

---

## 🌐 URLs

- **Development**: http://localhost:5173 (npm run docs:dev)
- **Production**: http://localhost:4173 (Docker)
- **Docker Container**: zurto-v3-ui-docs
- **GitHub**: (add your repo URL)

---

## 📞 Support

### Resources

- VitePress Docs: https://vitepress.dev/
- Sandpack Docs: https://sandpack.codesandbox.io/
- zurto-ui Components: /components/

### Commands Help

```bash
npm run docs:dev    # Start dev server
npm run docs:build  # Build for production
npm run docs:serve  # Preview production build
docker compose logs zurto-ui-docs  # View container logs
```

---

**Last Updated**: December 18, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
