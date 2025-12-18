# ZSelect

Dropdown select input

## Example

<CodeToggle code="import { ZSelect } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZSelect placeholder=&quot;Select an option...&quot;>&#10;      <option value=&quot;1&quot;>Option 1</option>&#10;      <option value=&quot;2&quot;>Option 2</option>&#10;      <option value=&quot;3&quot;>Option 3</option>&#10;    </ZSelect>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZSelect } from 'zurto-ui';
```

## Usage

```tsx
import { ZSelect } from 'zurto-ui';

function Example() {
  return (
    <ZSelect placeholder="Select an option...">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </ZSelect>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `-` | Placeholder option |
| `value` | `string` | `-` | Selected value |
| `onChange` | `(value) => void` | `-` | Change handler |
| `options` | `Array<{label, value}>` | `-` | Options array |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
