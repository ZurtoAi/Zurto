# ZStack

Vertical stack layout

## Example

<CodeToggle code="import { ZStack } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZStack gap={12}>&#10;      <div>Item 1</div>&#10;      <div>Item 2</div>&#10;      <div>Item 3</div>&#10;    </ZStack>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZStack } from 'zurto-ui';
```

## Usage

```tsx
import { ZStack } from 'zurto-ui';

function Example() {
  return (
    <ZStack gap={12}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </ZStack>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `number` | `0` | Gap between items |
| `align` | `'stretch' | 'start' | 'center' | 'end'` | `'stretch'` | Alignment |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
