# ZDivider

Horizontal or vertical divider

## Example

<CodeToggle code="import { ZDivider } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <p>Content above</p>&#10;      <ZDivider />&#10;      <p>Content below</p>&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZDivider } from 'zurto-ui';
```

## Usage

```tsx
import { ZDivider } from 'zurto-ui';

function Example() {
  return (
    <>
      <p>Content above</p>
      <ZDivider />
      <p>Content below</p>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' | 'vertical'` | `'horizontal'` | Divider direction |
| `label` | `string` | `-` | Center label |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
