# ZSlider

Range slider input

## Example

<CodeToggle code="import { ZSlider } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZSlider &#10;      min={0} &#10;      max={100} &#10;      defaultValue={65}&#10;      showValue&#10;    />&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZSlider } from 'zurto-ui';
```

## Usage

```tsx
import { ZSlider } from 'zurto-ui';

function Example() {
  return (
    <ZSlider 
      min={0} 
      max={100} 
      defaultValue={65}
      showValue
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `value` | `number` | `-` | Current value |
| `step` | `number` | `1` | Step increment |
| `showValue` | `boolean` | `false` | Show current value |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
