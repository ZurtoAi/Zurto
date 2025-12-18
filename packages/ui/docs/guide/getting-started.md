# Getting Started

Welcome to **zurto-ui** – a modern React component library with a stunning dark theme and glassmorphism effects.

## Features

- 🎨 **30+ Components** – Comprehensive library covering all UI needs
- 🌙 **Dark Theme First** – Beautiful dark theme with glassmorphism
- 📦 **Tree-Shakable** – Import only what you need
- 🎯 **TypeScript** – Full type safety out of the box
- 🖥️ **Desktop-First** – Optimized for desktop with full responsiveness
- ⚡ **Fast** – Optimized for performance

## Quick Start

### 1. Install the package

```bash
npm install @zurto/ui
# or
yarn add @zurto/ui
# or
pnpm add @zurto/ui
```

### 2. Import styles

Add the styles import to your app entry point:

```tsx
// main.tsx or App.tsx
import "@zurto/ui/styles";
```

### 3. Use components

```tsx
import { ZButton, ZCard, ZInput } from "@zurto/ui";

function App() {
  return (
    <ZCard variant="glass" padding="lg">
      <h2>Welcome</h2>
      <ZInput placeholder="Enter your email" />
      <ZButton variant="primary">Get Started</ZButton>
    </ZCard>
  );
}
```

## Next Steps

- [Installation](/guide/installation) – Detailed installation options
- [Theming](/guide/theming) – Customize colors and tokens
- [Components](/components/) – Browse all components
