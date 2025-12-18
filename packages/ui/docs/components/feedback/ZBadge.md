# ZBadge

Small status indicator badges

## Example

<CodeToggle code="import { ZBadge } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <>&#10;      <ZBadge color=&quot;primary&quot;>New</ZBadge>&#10;      <ZBadge color=&quot;success&quot;>Active</ZBadge>&#10;      <ZBadge color=&quot;warning&quot;>Pending</ZBadge>&#10;      <ZBadge color=&quot;gray&quot;>Archived</ZBadge>&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZBadge } from 'zurto-ui';
```

## Usage

```tsx
import { ZBadge } from 'zurto-ui';

function Example() {
  return (
    <>
      <ZBadge color="primary">New</ZBadge>
      <ZBadge color="success">Active</ZBadge>
      <ZBadge color="warning">Pending</ZBadge>
      <ZBadge color="gray">Archived</ZBadge>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `'primary' | 'success' | 'warning' | 'error' | 'gray'` | `'primary'` | Badge color |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` | Badge size |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
