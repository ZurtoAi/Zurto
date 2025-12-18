# ZKbd

Kbd component from zurto-ui.

## Preview

<CodeToggle code="import { ZKbd } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZKbd>Ctrl</ZKbd> + <ZKbd>C</ZKbd>&#10;    </>&#10;  );&#10;}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    <div style="display: flex; gap: 8px; align-items: center; color: #aaa;"><kbd style="padding: 4px 8px; background: #222; border: 1px solid #444; border-radius: 4px; color: white; font-family: monospace; font-size: 13px;">Ctrl</kbd> + <kbd style="padding: 4px 8px; background: #222; border: 1px solid #444; border-radius: 4px; color: white; font-family: monospace; font-size: 13px;">C</kbd></div>
  </div>
</CodeToggle>

## Import

```typescript
import { ZKbd } from 'zurto-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|


## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

```tsx
<ZKbd size="sm">Small</ZKbd>
<ZKbd size="md">Medium</ZKbd>
<ZKbd size="lg">Large</ZKbd>
```

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
