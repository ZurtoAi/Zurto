# ZDatePicker

DatePicker component from zurto-ui.

## Preview

<CodeToggle code="import { ZDatePicker } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZDatePicker>&#10;      Content here&#10;    </ZDatePicker>&#10;  );&#10;}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    <div style="padding: 20px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: #aaa; text-align: center;">DatePicker Component</div>
  </div>
</CodeToggle>

## Import

```typescript
import { ZDatePicker } from 'zurto-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | `-` | Component content |
| `className` | `string` | `-` | Additional CSS classes |


## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

```tsx
<ZDatePicker size="sm">Small</ZDatePicker>
<ZDatePicker size="md">Medium</ZDatePicker>
<ZDatePicker size="lg">Large</ZDatePicker>
```

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
