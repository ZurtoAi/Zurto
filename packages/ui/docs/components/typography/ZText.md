# ZText

Body text component

## Example

<CodeToggle code="import { ZText } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZText>This is regular body text.</ZText>&#10;      <ZText size=&quot;sm&quot; color=&quot;muted&quot;>Smaller muted text.</ZText>&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZText } from 'zurto-ui';
```

## Usage

```tsx
import { ZText } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZText>This is regular body text.</ZText>
      <ZText size="sm" color="muted">Smaller muted text.</ZText>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' | 'sm' | 'md' | 'lg' | 'xl'` | `'md'` | Text size |
| `weight` | `'normal' | 'medium' | 'semibold' | 'bold'` | `'normal'` | Font weight |
| `color` | `string` | `-` | Text color |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
