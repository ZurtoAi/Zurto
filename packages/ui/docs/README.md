# zurto-ui Documentation

## 📚 Documentation Structure

This is the source for the zurto-ui documentation website built with VitePress.

### Directory Structure

```
docs/
├── .vitepress/
│   └── config.ts          # VitePress configuration
├── guide/
│   ├── getting-started.md # Getting started guide
│   ├── installation.md    # Installation instructions
│   └── customization.md   # Customization guide
├── components/
│   ├── overview.md        # Component overview
│   ├── button/            # Button components
│   ├── form/              # Form components
│   ├── layout/            # Layout components
│   └── ...                # Other categories
└── index.md               # Homepage
```

## 🚀 Running Documentation Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

The documentation is deployed at **https://ui.zurto.app**

## ✍️ Writing Documentation

### Component Documentation Template

Each component should have its own markdown file with the following structure:

```markdown
# ComponentName

Brief description of the component.

## Import

\`\`\`tsx
import { ComponentName } from 'zurto-ui';
\`\`\`

## Usage

### Basic Example

\`\`\`tsx
<ComponentName>Content</ComponentName>
\`\`\`

### Advanced Examples

...

## Props

\`\`\`typescript
interface ComponentProps {
// Props documentation
}
\`\`\`

## Accessibility

- ARIA attributes
- Keyboard navigation
- Screen reader support

## Examples

Real-world usage examples
```

## 📝 Content Guidelines

- **Be Clear**: Use simple language
- **Show Examples**: Include code examples
- **Be Practical**: Show real use cases
- **Be Complete**: Document all props and variants
- **Be Accessible**: Include accessibility info

## 🎨 Features

- ✅ 32 component pages
- ✅ Live code examples
- ✅ Dark theme
- ✅ Desktop-first responsive design
- ✅ Fast search
- ✅ Type definitions
- ✅ Accessibility info

## 🔗 Links

- [zurto-ui GitHub](https://github.com/zurto/zurto-ui)
- [npm Package](https://www.npmjs.com/package/zurto-ui)
- [VitePress Docs](https://vitepress.dev)
