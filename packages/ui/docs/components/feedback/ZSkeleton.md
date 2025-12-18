# ZSkeleton

Loading placeholder skeleton

## Example

<CodeToggle code="import { ZSkeleton } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZSkeleton width=&quot;100%&quot; height={16} />&#10;      <ZSkeleton width=&quot;80%&quot; height={16} />&#10;      <ZSkeleton width=&quot;60%&quot; height={16} />&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZSkeleton } from 'zurto-ui';
```

## Usage

```tsx
import { ZSkeleton } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZSkeleton width="100%" height={16} />
      <ZSkeleton width="80%" height={16} />
      <ZSkeleton width="60%" height={16} />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string | number` | `'100%'` | Skeleton width |
| `height` | `string | number` | `20` | Skeleton height |
| `circle` | `boolean` | `false` | Make circular |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
