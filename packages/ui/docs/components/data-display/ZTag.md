# ZTag

Colored tag labels

## Example

<CodeToggle code="import { ZTag } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZTag color=&quot;red&quot;>React</ZTag>&#10;      <ZTag color=&quot;blue&quot;>TypeScript</ZTag>&#10;      <ZTag color=&quot;green&quot;>Vue</ZTag>&#10;      <ZTag color=&quot;purple&quot;>Svelte</ZTag>&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZTag } from 'zurto-ui';
```

## Usage

```tsx
import { ZTag } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZTag color="red">React</ZTag>
      <ZTag color="blue">TypeScript</ZTag>
      <ZTag color="green">Vue</ZTag>
      <ZTag color="purple">Svelte</ZTag>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `'gray'` | Tag color |
| `closable` | `boolean` | `false` | Show close button |
| `onClose` | `() => void` | `-` | Close handler |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
