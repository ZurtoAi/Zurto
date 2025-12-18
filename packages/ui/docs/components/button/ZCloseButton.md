# ZCloseButton

Close button for modals and dismissible content

## Example

<CodeToggle code="import { ZCloseButton } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZCloseButton size=&quot;md&quot; onClick={() => console.log('Close')} />&#10;      <ZCloseButton size=&quot;sm&quot; />&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZCloseButton } from 'zurto-ui';
```

## Usage

```tsx
import { ZCloseButton } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZCloseButton size="md" onClick={() => console.log('Close')} />
      <ZCloseButton size="sm" />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' | 'md' | 'lg'` | `'md'` | Button size |
| `onClick` | `() => void` | `-` | Click handler |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
