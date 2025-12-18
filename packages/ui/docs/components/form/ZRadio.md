# ZRadio

Radio component from zurto-ui.

## Preview

<CodeToggle code="import { ZRadio, ZRadioGroup } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZRadioGroup name=&quot;options&quot; defaultValue=&quot;a&quot;>&#10;      <ZRadio value=&quot;a&quot; label=&quot;Option A&quot; />&#10;      <ZRadio value=&quot;b&quot; label=&quot;Option B&quot; />&#10;    </ZRadioGroup>&#10;  );&#10;}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    <div style="display: flex; flex-direction: column; gap: 8px;"><label style="display: inline-flex; align-items: center; gap: 8px; color: white; cursor: pointer;"><input type="radio" name="demo" checked style="width: 18px; height: 18px; accent-color: #c73548;" /><span>Option A</span></label><label style="display: inline-flex; align-items: center; gap: 8px; color: white; cursor: pointer;"><input type="radio" name="demo" style="width: 18px; height: 18px; accent-color: #c73548;" /><span>Option B</span></label></div>
  </div>
</CodeToggle>

## Import

```typescript
import { ZRadio } from 'zurto-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `-` | Radio label |
| `value` | `string` | `-` | Radio value |
| `name` | `string` | `-` | Group name |


## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

```tsx
<ZRadio size="sm">Small</ZRadio>
<ZRadio size="md">Medium</ZRadio>
<ZRadio size="lg">Large</ZRadio>
```

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
