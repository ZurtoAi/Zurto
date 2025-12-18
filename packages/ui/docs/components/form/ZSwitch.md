# ZSwitch

Toggle switch for boolean values

## Example

<CodeToggle code="import { ZSwitch } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZSwitch label=&quot;Notifications enabled&quot; defaultChecked />&#10;      <ZSwitch label=&quot;Dark mode&quot; />&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZSwitch } from 'zurto-ui';
```

## Usage

```tsx
import { ZSwitch } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZSwitch label="Notifications enabled" defaultChecked />
      <ZSwitch label="Dark mode" />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `-` | Switch label |
| `checked` | `boolean` | `false` | Checked state |
| `onChange` | `(checked) => void` | `-` | Change handler |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
