# ZInput

Text input field with validation support

## Example

<CodeToggle code="import { ZInput } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZInput placeholder=&quot;Enter your name...&quot; />&#10;      <ZInput placeholder=&quot;With error&quot; error />&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZInput } from 'zurto-ui';
```

## Usage

```tsx
import { ZInput } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZInput placeholder="Enter your name..." />
      <ZInput placeholder="With error" error />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `-` | Placeholder text |
| `value` | `string` | `-` | Controlled value |
| `onChange` | `(e) => void` | `-` | Change handler |
| `error` | `boolean` | `false` | Show error state |
| `disabled` | `boolean` | `false` | Disable input |
| `leftIcon` | `ReactNode` | `-` | Icon on left |
| `rightIcon` | `ReactNode` | `-` | Icon on right |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
