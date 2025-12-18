# ZBlockquote

Blockquote component from zurto-ui.

## Preview

<CodeToggle code="import { ZBlockquote } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZBlockquote>&#10;      &quot;The best way to predict the future is to create it.&quot;&#10;    </ZBlockquote>&#10;  );&#10;}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    <blockquote style="margin: 0; padding: 16px 20px; border-left: 4px solid #c73548; background: rgba(199, 53, 72, 0.1); color: #aaa; font-style: italic;">"The best way to predict the future is to create it."</blockquote>
  </div>
</CodeToggle>

## Import

```typescript
import { ZBlockquote } from 'zurto-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cite` | `string` | `-` | Citation source |


## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

```tsx
<ZBlockquote size="sm">Small</ZBlockquote>
<ZBlockquote size="md">Medium</ZBlockquote>
<ZBlockquote size="lg">Large</ZBlockquote>
```

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
