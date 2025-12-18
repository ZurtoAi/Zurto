# ZFadeIn

FadeIn component from zurto-ui.

## Preview

<CodeToggle code="import { ZFadeIn } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZFadeIn duration={500}>&#10;      <div>Fading in...</div>&#10;    </ZFadeIn>&#10;  );&#10;}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    <div style="padding: 20px; background: linear-gradient(135deg, #c73548, #df3e53); border-radius: 8px; color: white; text-align: center; animation: fadeIn 0.5s ease-out;">Fading in...</div><style>@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }</style>
  </div>
</CodeToggle>

## Import

```typescript
import { ZFadeIn } from 'zurto-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `300` | Animation duration in ms |
| `delay` | `number` | `0` | Animation delay |


## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

```tsx
<ZFadeIn size="sm">Small</ZFadeIn>
<ZFadeIn size="md">Medium</ZFadeIn>
<ZFadeIn size="lg">Large</ZFadeIn>
```

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
