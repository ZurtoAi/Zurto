# ZPulse

Pulse component from zurto-ui.

## Preview

<CodeToggle code="import { ZPulse } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZPulse>&#10;      <div>Pulsing...</div>&#10;    </ZPulse>&#10;  );&#10;}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    <div style="padding: 20px; background: linear-gradient(135deg, #c73548, #df3e53); border-radius: 8px; color: white; text-align: center; animation: pulse 2s ease-in-out infinite;">Pulsing...</div><style>@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }</style>
  </div>
</CodeToggle>

## Import

```typescript
import { ZPulse } from 'zurto-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `2000` | Pulse duration |


## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

```tsx
<ZPulse size="sm">Small</ZPulse>
<ZPulse size="md">Medium</ZPulse>
<ZPulse size="lg">Large</ZPulse>
```

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
