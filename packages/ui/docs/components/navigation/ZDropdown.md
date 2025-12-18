# ZDropdown

Dropdown component from zurto-ui.

## Preview

<CodeToggle code="import { ZDropdown, ZDropdownItem } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZDropdown trigger={<button>Options</button>}>&#10;      <ZDropdownItem onClick={() => {}}>Edit</ZDropdownItem>&#10;      <ZDropdownItem onClick={() => {}}>Delete</ZDropdownItem>&#10;    </ZDropdown>&#10;  );&#10;}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    <div style="position: relative; display: inline-block;"><button style="padding: 10px 16px; background: #222; border: 1px solid #333; border-radius: 8px; color: white; cursor: pointer; display: flex; align-items: center; gap: 8px;">Options <span>▼</span></button></div>
  </div>
</CodeToggle>

## Import

```typescript
import { ZDropdown } from 'zurto-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `ReactNode` | `-` | Dropdown trigger element |
| `placement` | `string` | `bottom-start` | Dropdown placement |


## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

```tsx
<ZDropdown size="sm">Small</ZDropdown>
<ZDropdown size="md">Medium</ZDropdown>
<ZDropdown size="lg">Large</ZDropdown>
```

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
