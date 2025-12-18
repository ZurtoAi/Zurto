# ZCheckbox

Checkbox input with label

## Example

<CodeToggle code="import { ZCheckbox } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZCheckbox label=&quot;Accept terms and conditions&quot; defaultChecked />&#10;      <ZCheckbox label=&quot;Subscribe to newsletter&quot; />&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZCheckbox } from 'zurto-ui';
```

## Usage

```tsx
import { ZCheckbox } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZCheckbox label="Accept terms and conditions" defaultChecked />
      <ZCheckbox label="Subscribe to newsletter" />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `-` | Checkbox label |
| `checked` | `boolean` | `false` | Checked state |
| `onChange` | `(checked) => void` | `-` | Change handler |
| `disabled` | `boolean` | `false` | Disable checkbox |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
