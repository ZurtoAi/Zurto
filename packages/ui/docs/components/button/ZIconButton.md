# ZIconButton

Icon-only button for toolbars and actions

## Example

<CodeToggle code="import { ZIconButton } from 'zurto-ui';&#10;import { Settings, Bell, Zap } from 'lucide-react';&#10;&#10;function Example() {&#10;  return (&#10;    <div style={{ display: 'flex', gap: 12 }}>&#10;      <ZIconButton icon={<Zap />} variant=&quot;primary&quot; />&#10;      <ZIconButton icon={<Settings />} variant=&quot;outline&quot; />&#10;      <ZIconButton icon={<Bell />} variant=&quot;ghost&quot; />&#10;    </div>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZIconButton } from 'zurto-ui';
```

## Usage

```tsx
import { ZIconButton } from 'zurto-ui';
import { Settings, Bell, Zap } from 'lucide-react';

function Example() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <ZIconButton icon={<Zap />} variant="primary" />
      <ZIconButton icon={<Settings />} variant="outline" />
      <ZIconButton icon={<Bell />} variant="ghost" />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | `-` | Icon element (required) |
| `variant` | `'primary' | 'outline' | 'ghost'` | `'primary'` | Button variant |
| `size` | `'sm' | 'md' | 'lg'` | `'md'` | Button size |
| `aria-label` | `string` | `-` | Accessibility label (required) |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
