# ZSlideIn

SlideIn component from zurto-ui.

## Preview

<CodeToggle code="import { ZSlideIn } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZSlideIn direction=&quot;up&quot; duration={500}>&#10;      <div>Sliding in...</div>&#10;    </ZSlideIn>&#10;  );&#10;}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    <div style="padding: 20px; background: linear-gradient(135deg, #c73548, #df3e53); border-radius: 8px; color: white; text-align: center; animation: slideIn 0.5s ease-out;">Sliding in...</div><style>@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }</style>
  </div>
</CodeToggle>

## Import

```typescript
import { ZSlideIn } from 'zurto-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `string` | `up` | Slide direction (up, down, left, right) |
| `duration` | `number` | `300` | Animation duration |


## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

```tsx
<ZSlideIn size="sm">Small</ZSlideIn>
<ZSlideIn size="md">Medium</ZSlideIn>
<ZSlideIn size="lg">Large</ZSlideIn>
```

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
