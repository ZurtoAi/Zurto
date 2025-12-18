# ZFlex

Flexbox container

## Example

<CodeToggle code="import { ZFlex } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZFlex gap={12} justify=&quot;center&quot;>&#10;      <div>1</div>&#10;      <div>2</div>&#10;      <div>3</div>&#10;    </ZFlex>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZFlex } from 'zurto-ui';
```

## Usage

```tsx
import { ZFlex } from 'zurto-ui';

function Example() {
  return (
    <ZFlex gap={12} justify="center">
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </ZFlex>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'row' | 'column'` | `'row'` | Flex direction |
| `gap` | `number` | `0` | Gap between items |
| `align` | `string` | `'stretch'` | Align items |
| `justify` | `string` | `'flex-start'` | Justify content |
| `wrap` | `boolean` | `false` | Allow wrapping |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
