# ZBadge

Badge component from zurto-ui.

## Preview

<CodeToggle code="import { ZBadge } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return <ZBadge>New</ZBadge>;&#10;}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    <span style="display: inline-flex; align-items: center; padding: 4px 10px; background: linear-gradient(135deg, #c73548, #df3e53); color: white; border-radius: 9999px; font-size: 12px; font-weight: 600;">New</span>
  </div>
</CodeToggle>

## Import

```typescript
import { ZBadge } from 'zurto-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `string` | `primary` | Badge variant |
| `size` | `string` | `md` | Badge size |


## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

```tsx
<ZBadge size="sm">Small</ZBadge>
<ZBadge size="md">Medium</ZBadge>
<ZBadge size="lg">Large</ZBadge>
```

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
