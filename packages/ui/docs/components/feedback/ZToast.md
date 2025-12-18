# ZToast

Toast component from zurto-ui.

## Preview

<CodeToggle code="import { toast } from 'zurto-ui';&#10;&#10;function Example() {&#10;  const showToast = () => {&#10;    toast.success('Successfully saved!');&#10;  };&#10;  &#10;  return <button onClick={showToast}>Show Toast</button>;&#10;}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    <div style="padding: 16px 20px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: white; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);"><span style="color: #22c55e;">✓</span><span>Successfully saved!</span></div>
  </div>
</CodeToggle>

## Import

```typescript
import { ZToast } from 'zurto-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | `-` | Toast message |
| `type` | `string` | `info` | Toast type |
| `duration` | `number` | `3000` | Auto-dismiss duration |


## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

```tsx
<ZToast size="sm">Small</ZToast>
<ZToast size="md">Medium</ZToast>
<ZToast size="lg">Large</ZToast>
```

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
