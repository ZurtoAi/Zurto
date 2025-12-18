# ZCard

Container card with shadow

## Example

<CodeToggle code="import { ZCard } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZCard>&#10;      <h3>Card Title</h3>&#10;      <p>This is a card component with some example content.</p>&#10;    </ZCard>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZCard } from 'zurto-ui';
```

## Usage

```tsx
import { ZCard } from 'zurto-ui';

function Example() {
  return (
    <ZCard>
      <h3>Card Title</h3>
      <p>This is a card component with some example content.</p>
    </ZCard>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `padding` | `'none' | 'sm' | 'md' | 'lg'` | `'md'` | Card padding |
| `shadow` | `boolean` | `true` | Show shadow |
| `hoverable` | `boolean` | `false` | Hover effect |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
