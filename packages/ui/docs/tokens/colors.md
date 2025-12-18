# Colors

Color tokens for the Zurto UI design system. Click any swatch to copy its value.

## Brand Colors

<div class="color-grid">
  <ColorSwatch name="Primary" value="#df3e53" />
  <ColorSwatch name="Primary Hover" value="#e85566" />
  <ColorSwatch name="Primary Active" value="#c73548" />
  <ColorSwatch name="Primary Light" value="rgba(223, 62, 83, 0.15)" />
</div>

## Background Colors

<div class="color-grid">
  <ColorSwatch name="Background" value="#0a0a0a" />
  <ColorSwatch name="Surface" value="#111111" />
  <ColorSwatch name="Elevated" value="#1a1a1a" />
  <ColorSwatch name="Overlay" value="#222222" />
</div>

## Text Colors

<div class="color-grid">
  <ColorSwatch name="Text Primary" value="#ffffff" />
  <ColorSwatch name="Text Secondary" value="#a0a0a0" />
  <ColorSwatch name="Text Muted" value="#666666" />
  <ColorSwatch name="Text Disabled" value="#444444" />
</div>

## Semantic Colors

<div class="color-grid">
  <ColorSwatch name="Success" value="#22c55e" />
  <ColorSwatch name="Warning" value="#f59e0b" />
  <ColorSwatch name="Error" value="#ef4444" />
  <ColorSwatch name="Info" value="#3b82f6" />
</div>

## Border Colors

<div class="color-grid">
  <ColorSwatch name="Border Default" value="#2a2a2a" />
  <ColorSwatch name="Border Hover" value="#3a3a3a" />
  <ColorSwatch name="Border Focus" value="#df3e53" />
</div>

## Glassmorphism

<Demo code="// Glass effect tokens
--z-glass-bg: rgba(255, 255, 255, 0.05);
--z-glass-border: rgba(255, 255, 255, 0.1);
--z-glass-blur: blur(12px);">

  <div style="padding: 24px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: #a0a0a0;">
    Glassmorphism effect preview
  </div>
</Demo>

## CSS Variables Reference

```css
:root {
  /* Brand */
  --z-primary: #df3e53;
  --z-primary-hover: #e85566;
  --z-primary-active: #c73548;
  --z-primary-light: rgba(223, 62, 83, 0.15);

  /* Backgrounds */
  --z-bg: #0a0a0a;
  --z-bg-surface: #111111;
  --z-bg-elevated: #1a1a1a;
  --z-bg-overlay: #222222;

  /* Text */
  --z-text: #ffffff;
  --z-text-secondary: #a0a0a0;
  --z-text-muted: #666666;
  --z-text-disabled: #444444;

  /* Semantic */
  --z-success: #22c55e;
  --z-warning: #f59e0b;
  --z-error: #ef4444;
  --z-info: #3b82f6;

  /* Borders */
  --z-border: #2a2a2a;
  --z-border-hover: #3a3a3a;
  --z-border-focus: #df3e53;

  /* Glass */
  --z-glass-bg: rgba(255, 255, 255, 0.05);
  --z-glass-border: rgba(255, 255, 255, 0.1);
}
```

## Usage Examples

```tsx
// In your components
import { tokens } from "@zurto/ui";

const MyComponent = () => (
  <div
    style={{
      background: tokens.colors.bgElevated,
      color: tokens.colors.textPrimary,
      borderColor: tokens.colors.border,
    }}
  >
    Content
  </div>
);
```

## Customizing Colors

Override the default theme colors:

```tsx
import { ZThemeProvider } from "@zurto/ui";

const customTheme = {
  colors: {
    primary: "#8b5cf6", // Purple
    primaryHover: "#a78bfa",
    primaryActive: "#7c3aed",
  },
};

function App() {
  return (
    <ZThemeProvider theme={customTheme}>
      <YourApp />
    </ZThemeProvider>
  );
}
```

<style>
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin: 24px 0;
}
</style>

