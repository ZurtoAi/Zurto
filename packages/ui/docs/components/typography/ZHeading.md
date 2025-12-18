# ZHeading

Heading component from zurto-ui.

## Preview

<CodeToggle code="import { ZHeading } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return <ZHeading level={2}>Section Heading</ZHeading>;&#10;}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    <h2 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">Section Heading</h2>
  </div>
</CodeToggle>

## Import

```typescript
import { ZHeading } from 'zurto-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `number` | `2` | Heading level (1-6) |


## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

```tsx
<ZHeading size="sm">Small</ZHeading>
<ZHeading size="md">Medium</ZHeading>
<ZHeading size="lg">Large</ZHeading>
```

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
