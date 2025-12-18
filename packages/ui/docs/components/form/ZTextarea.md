# ZTextarea

Multi-line text input

## Example

<CodeToggle code="import { ZTextarea } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZTextarea &#10;      placeholder=&quot;Enter your message...&quot; &#10;      rows={4}&#10;    />&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZTextarea } from 'zurto-ui';
```

## Usage

```tsx
import { ZTextarea } from 'zurto-ui';

function Example() {
  return (
    <ZTextarea 
      placeholder="Enter your message..." 
      rows={4}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `-` | Placeholder text |
| `rows` | `number` | `4` | Visible rows |
| `resize` | `'none' | 'vertical' | 'horizontal' | 'both'` | `'vertical'` | Resize behavior |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
