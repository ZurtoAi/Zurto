# ZMenu

Dropdown menu

## Example

<CodeToggle code="import { ZMenu, ZMenuItem, ZMenuDivider } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZMenu>&#10;      <ZMenuItem icon=&quot;📄&quot;>New File</ZMenuItem>&#10;      <ZMenuItem icon=&quot;📁&quot;>Open</ZMenuItem>&#10;      <ZMenuDivider />&#10;      <ZMenuItem icon=&quot;⚙️&quot; disabled>Settings</ZMenuItem>&#10;    </ZMenu>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZMenu } from 'zurto-ui';
```

## Usage

```tsx
import { ZMenu, ZMenuItem, ZMenuDivider } from 'zurto-ui';

function Example() {
  return (
    <ZMenu>
      <ZMenuItem icon="📄">New File</ZMenuItem>
      <ZMenuItem icon="📁">Open</ZMenuItem>
      <ZMenuDivider />
      <ZMenuItem icon="⚙️" disabled>Settings</ZMenuItem>
    </ZMenu>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSelect` | `(item) => void` | `-` | Selection handler |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
