# ZTooltip

Tooltip on hover

## Example

<CodeToggle code="import { ZTooltip, ZButton } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZTooltip content=&quot;Tooltip text&quot;>&#10;      <ZButton>Hover me</ZButton>&#10;    </ZTooltip>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZTooltip } from 'zurto-ui';
```

## Usage

```tsx
import { ZTooltip, ZButton } from 'zurto-ui';

function Example() {
  return (
    <ZTooltip content="Tooltip text">
      <ZButton>Hover me</ZButton>
    </ZTooltip>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ReactNode` | `-` | Tooltip content |
| `position` | `'top' | 'bottom' | 'left' | 'right'` | `'top'` | Tooltip position |
| `delay` | `number` | `200` | Show delay (ms) |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
