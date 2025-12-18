# ZTitle

Title/heading component

## Example

<CodeToggle code="import { ZTitle } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZTitle level={1}>Main Title</ZTitle>&#10;      <ZTitle level={2} color=&quot;muted&quot;>Subtitle text here</ZTitle>&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZTitle } from 'zurto-ui';
```

## Usage

```tsx
import { ZTitle } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZTitle level={1}>Main Title</ZTitle>
      <ZTitle level={2} color="muted">Subtitle text here</ZTitle>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `1 | 2 | 3 | 4 | 5 | 6` | `1` | Heading level |
| `color` | `'default' | 'muted' | 'primary'` | `'default'` | Text color |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
