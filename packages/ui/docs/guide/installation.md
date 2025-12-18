# Installation

## Package Manager

Install via your preferred package manager:

::: code-group

```bash [npm]
npm install @zurto/ui
```

```bash [yarn]
yarn add @zurto/ui
```

```bash [pnpm]
pnpm add @zurto/ui
```

:::

## Peer Dependencies

`@zurto/ui` requires React 18+:

```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

## Import Styles

Add the base styles to your app entry point:

```tsx
// main.tsx or App.tsx
import "@zurto/ui/styles";
```

This imports all CSS custom properties (design tokens) and base component styles.

## TypeScript

Full TypeScript support is included. No additional `@types` packages needed.

```tsx
import { ZButton, ZButtonProps } from "@zurto/ui";

const MyButton = (props: ZButtonProps) => {
  return <ZButton {...props} />;
};
```

## Tree Shaking

Components are exported individually for optimal tree shaking:

```tsx
// ✅ Good - only imports ZButton
import { ZButton } from "@zurto/ui";

// ✅ Also good - explicit path import
import { ZButton } from "@zurto/ui/components/core";
```

## CDN Usage

For quick prototyping, you can use unpkg:

```html
<script src="https://unpkg.com/@zurto/ui/dist/zurto-ui.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@zurto/ui/dist/styles.css" />
```

## Next Steps

- [Theming](/guide/theming) – Customize the design tokens
- [Accessibility](/guide/accessibility) – Learn about a11y features

