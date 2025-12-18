# ZAvatar

User avatar with fallback

## Example

<CodeToggle code="import { ZAvatar } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZAvatar name=&quot;John Doe&quot; size=&quot;sm&quot; />&#10;      <ZAvatar src=&quot;https://example.com/avatar.jpg&quot; size=&quot;md&quot; />&#10;      <ZAvatar name=&quot;Alice Brown&quot; size=&quot;lg&quot; color=&quot;blue&quot; />&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZAvatar } from 'zurto-ui';
```

## Usage

```tsx
import { ZAvatar } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZAvatar name="John Doe" size="sm" />
      <ZAvatar src="https://example.com/avatar.jpg" size="md" />
      <ZAvatar name="Alice Brown" size="lg" color="blue" />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `-` | Image URL |
| `name` | `string` | `-` | Name for initials |
| `size` | `'sm' | 'md' | 'lg' | 'xl'` | `'md'` | Avatar size |
| `color` | `string` | `'primary'` | Background color |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
