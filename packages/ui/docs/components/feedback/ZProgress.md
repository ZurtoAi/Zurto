# ZProgress

Progress bar indicator

## Example

<CodeToggle code="import { ZProgress } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZProgress value={65} showLabel />&#10;      <ZProgress value={30} />&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZProgress } from 'zurto-ui';
```

## Usage

```tsx
import { ZProgress } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZProgress value={65} showLabel />
      <ZProgress value={30} />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Progress value (0-100) |
| `showLabel` | `boolean` | `false` | Show percentage label |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` | Bar height |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
