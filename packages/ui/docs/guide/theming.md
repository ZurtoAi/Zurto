# Theming

`@zurto/ui` uses CSS custom properties (variables) for theming, making it easy to customize colors, spacing, and other design tokens.

## Design Tokens

All design decisions are controlled by CSS variables:

```css
:root {
  /* Primary brand color */
  --z-primary: #df3e53;
  --z-primary-hover: #e85566;
  --z-primary-active: #c73548;

  /* Backgrounds */
  --z-bg-primary: #0a0a0a;
  --z-bg-secondary: #111111;
  --z-bg-tertiary: #1a1a1a;

  /* Text */
  --z-text-primary: #ffffff;
  --z-text-secondary: #a0a0a0;
  --z-text-muted: #666666;

  /* Semantic colors */
  --z-success: #22c55e;
  --z-warning: #f59e0b;
  --z-error: #ef4444;
  --z-info: #3b82f6;
}
```

## Customizing Colors

Override any token in your CSS:

```css
:root {
  /* Change primary to blue */
  --z-primary: #3b82f6;
  --z-primary-hover: #60a5fa;
  --z-primary-active: #2563eb;

  /* Change background */
  --z-bg-primary: #0f172a;
}
```

## ZProvider

Wrap your app with `ZProvider` for theme context:

```tsx
import { ZProvider } from "@zurto/ui";

function App() {
  return (
    <ZProvider theme="dark">
      <YourApp />
    </ZProvider>
  );
}
```

### Theme Options

| Prop          | Type                            | Default   | Description          |
| ------------- | ------------------------------- | --------- | -------------------- |
| `theme`       | `'dark' \| 'light' \| 'system'` | `'dark'`  | Theme mode           |
| `accentColor` | `string`                        | `#df3e53` | Primary accent color |

## Light Theme

While dark theme is the default, you can enable light mode:

```tsx
<ZProvider theme="light">
  <App />
</ZProvider>
```

Or let the system decide:

```tsx
<ZProvider theme="system">
  <App />
</ZProvider>
```

## Glassmorphism

Enable glass effects on supported components:

```tsx
<ZCard variant="glass">Glassmorphism card</ZCard>
```

The glass effect uses:

```css
--z-glass-bg: rgba(255, 255, 255, 0.05);
--z-glass-border: rgba(255, 255, 255, 0.1);
--z-glass-blur: blur(10px);
```

## Typography

Customize fonts:

```css
:root {
  --z-font-sans: "Your Font", sans-serif;
  --z-font-mono: "Your Mono Font", monospace;
}
```

## Spacing Scale

The spacing scale follows a 4px base:

| Token         | Value |
| ------------- | ----- |
| `--z-space-1` | 4px   |
| `--z-space-2` | 8px   |
| `--z-space-3` | 12px  |
| `--z-space-4` | 16px  |
| `--z-space-5` | 24px  |
| `--z-space-6` | 32px  |
| `--z-space-7` | 48px  |
| `--z-space-8` | 64px  |

## Next Steps

- [Colors](/tokens/colors) – Full color palette
- [Typography](/tokens/typography) – Font scale
- [Spacing](/tokens/spacing) – Spacing system

