# ZButton

Primary button component with variants and sizes

## Example

<CodeToggle code="import { ZButton } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <div style={{ display: 'flex', gap: 12 }}>&#10;      <ZButton variant=&quot;primary&quot;>Primary</ZButton>&#10;      <ZButton variant=&quot;secondary&quot;>Secondary</ZButton>&#10;      <ZButton variant=&quot;ghost&quot;>Ghost</ZButton>&#10;    </div>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZButton } from 'zurto-ui';
```

## Usage

```tsx
import { ZButton } from 'zurto-ui';

function Example() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <ZButton variant="primary">Primary</ZButton>
      <ZButton variant="secondary">Secondary</ZButton>
      <ZButton variant="ghost">Ghost</ZButton>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' | 'secondary' | 'ghost' | 'danger'` | `'primary'` | Button style variant |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disable the button |
| `loading` | `boolean` | `false` | Show loading spinner |
| `leftIcon` | `ReactNode` | `-` | Icon before text |
| `rightIcon` | `ReactNode` | `-` | Icon after text |
| `onClick` | `() => void` | `-` | Click handler |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
