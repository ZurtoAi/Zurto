# ZAlert

Alert messages for user feedback

## Example

<CodeToggle code="import { ZAlert } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZAlert type=&quot;info&quot;>This is an info alert</ZAlert>&#10;      <ZAlert type=&quot;success&quot;>Success! Your changes have been saved.</ZAlert>&#10;      <ZAlert type=&quot;error&quot;>Error: Something went wrong.</ZAlert>&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZAlert } from 'zurto-ui';
```

## Usage

```tsx
import { ZAlert } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZAlert type="info">This is an info alert</ZAlert>
      <ZAlert type="success">Success! Your changes have been saved.</ZAlert>
      <ZAlert type="error">Error: Something went wrong.</ZAlert>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'info' | 'success' | 'warning' | 'error'` | `'info'` | Alert type |
| `title` | `string` | `-` | Alert title |
| `closable` | `boolean` | `false` | Show close button |
| `onClose` | `() => void` | `-` | Close handler |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
