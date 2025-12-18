# zurto-ui

<div align="center">

<img src="https://zurto.app/logo.png" alt="Zurto UI" width="120" />

**The official UI component library for Zurto**

Modern React components with dark theme and glassmorphism effects

[![npm version](https://img.shields.io/npm/v/zurto-ui.svg)](https://www.npmjs.com/package/zurto-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

[Documentation](https://ui.zurto.app) • [GitHub](https://github.com/zurto/zurto-ui) • [Discord](https://discord.gg/zurto)

</div>

---

## ✨ Features

- 🎨 **32+ Components** - Comprehensive library covering all UI needs across 7 categories
- 🌙 **Dark Theme First** - Beautiful dark theme with glassmorphism effects
- 📦 **Tree-Shakable** - Import only what you need
- 🎯 **TypeScript** - Full type safety out of the box
- 🖥️ **Desktop-First** - Optimized for desktop with full responsiveness
- 🎭 **Customizable** - Design tokens for easy theming
- ⚡ **Fast** - Optimized for performance with excellent bundle size
- 📚 **Documented** - Full documentation with live examples at [ui.zurto.app](https://ui.zurto.app)

---

## 📦 Installation

```bash
npm install zurto-ui
# or
yarn add zurto-ui
# or
pnpm add zurto-ui
```

---

## 🚀 Quick Start

### 1. Import the styles

```tsx
// In your app entry point (e.g., main.tsx or App.tsx)
import "zurto-ui/dist/styles.css";
```

### 2. Use components

```tsx
import { ZButton, ZCard, ZInput } from "zurto-ui";

function App() {
  return (
    <ZCard>
      <ZInput placeholder="Enter your email" />
      <ZButton variant="primary">Subscribe</ZButton>
    </ZCard>
  );
}
```

---

## 🎨 Components

### Core UI (14 components)

| Component   | Description                               |
| ----------- | ----------------------------------------- |
| `ZButton`   | Buttons with multiple variants and states |
| `ZInput`    | Text inputs with icons and validation     |
| `ZSelect`   | Single/multi select with search           |
| `ZCheckbox` | Checkbox with indeterminate state         |
| `ZRadio`    | Radio buttons and groups                  |
| `ZSwitch`   | Toggle switches                           |
| `ZCard`     | Card containers with glass effect         |
| `ZModal`    | Modal dialogs with focus trap             |
| `ZTooltip`  | Tooltips with 12 placements               |
| `ZBadge`    | Status badges and counters                |
| `ZAvatar`   | User avatars with fallback                |
| `ZSpinner`  | Loading spinners                          |
| `ZProgress` | Linear progress bars                      |
| `ZProvider` | Theme and context provider                |

### Layout (6 components)

| Component    | Description                |
| ------------ | -------------------------- |
| `ZContainer` | Max-width container        |
| `ZBox`       | Polymorphic box component  |
| `ZStack`     | Flex stack (VStack/HStack) |
| `ZGrid`      | CSS Grid wrapper           |
| `ZDivider`   | Dividers with labels       |
| `ZSplitPane` | Resizable split panels     |

### Navigation (4 components)

| Component         | Description           |
| ----------------- | --------------------- |
| `ZBreadcrumbs`    | Breadcrumb navigation |
| `ZTabs`           | Tabbed navigation     |
| `ZPagination`     | Page navigation       |
| `ZCommandPalette` | Keyboard command menu |

### Data Display (3 components)

| Component   | Description                 |
| ----------- | --------------------------- |
| `ZTable`    | Sortable, filterable tables |
| `ZList`     | Basic list component        |
| `ZStatCard` | Metric display cards        |

### Feedback (4 components)

| Component     | Description              |
| ------------- | ------------------------ |
| `ZToast`      | Toast notifications      |
| `ZAlert`      | Alert banners            |
| `ZSkeleton`   | Loading skeletons        |
| `ZEmptyState` | Empty state placeholders |

### Forms (6 components)

| Component      | Description           |
| -------------- | --------------------- |
| `ZForm`        | Form with validation  |
| `ZFieldGroup`  | Form field wrapper    |
| `ZInlineEdit`  | Click-to-edit fields  |
| `ZFileUpload`  | Drag & drop upload    |
| `ZDatePicker`  | Date/time selection   |
| `ZColorPicker` | Color selection (HSB) |

### Advanced (5 components)

| Component      | Description             |
| -------------- | ----------------------- |
| `ZCodeEditor`  | Code editor with syntax |
| `ZTerminal`    | Terminal emulator       |
| `ZCanvas`      | Drawing canvas          |
| `ZChart`       | Charts (line, bar, pie) |
| `ZVirtualList` | 10k+ item lists         |

---

## 🎭 Theming

### Design Tokens

All components use CSS custom properties (variables) for theming:

```css
:root {
  /* Colors */
  --z-primary: #df3e53;
  --z-bg-primary: #0a0a0a;
  --z-text-primary: #ffffff;

  /* Spacing */
  --z-space-4: 16px;

  /* Border Radius */
  --z-radius-md: 8px;

  /* Shadows */
  --z-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
}
```

### Custom Theme

Override tokens in your CSS:

```css
:root {
  --z-primary: #your-color;
  --z-bg-primary: #your-bg;
}
```

---

## 📚 Documentation

Full documentation available at [ui.zurto.app](https://ui.zurto.app)

- [Getting Started](https://ui.zurto.app/docs/getting-started)
- [Components](https://ui.zurto.app/docs/components)
- [Theming](https://ui.zurto.app/docs/theming)
- [Design Tokens](https://ui.zurto.app/docs/tokens)
- [Accessibility](https://ui.zurto.app/docs/accessibility)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

---

## 📄 License

MIT © [Zurto Team](https://zurto.app)
