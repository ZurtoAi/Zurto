# ZButtonGroup

Group multiple buttons together

## Example

<CodeToggle code="import { ZButtonGroup, ZButton } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZButtonGroup>&#10;      <ZButton>Left</ZButton>&#10;      <ZButton>Center</ZButton>&#10;      <ZButton>Right</ZButton>&#10;    </ZButtonGroup>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZButtonGroup } from 'zurto-ui';
```

## Usage

```tsx
import { ZButtonGroup, ZButton } from 'zurto-ui';

function Example() {
  return (
    <ZButtonGroup>
      <ZButton>Left</ZButton>
      <ZButton>Center</ZButton>
      <ZButton>Right</ZButton>
    </ZButtonGroup>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' | 'vertical'` | `'horizontal'` | Group direction |
| `attached` | `boolean` | `true` | Remove gaps between buttons |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
