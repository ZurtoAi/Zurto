# ZSpinner

Loading spinner indicator

## Example

<CodeToggle code="import { ZSpinner } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZSpinner size=&quot;sm&quot; />&#10;      <ZSpinner size=&quot;md&quot; />&#10;      <ZSpinner size=&quot;lg&quot; />&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZSpinner } from 'zurto-ui';
```

## Usage

```tsx
import { ZSpinner } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZSpinner size="sm" />
      <ZSpinner size="md" />
      <ZSpinner size="lg" />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' | 'md' | 'lg'` | `'md'` | Spinner size |
| `color` | `string` | `'primary'` | Spinner color |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
