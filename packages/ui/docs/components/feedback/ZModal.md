# ZModal

Modal dialog overlay

## Example

<CodeToggle code="import { ZModal, ZButton } from 'zurto-ui';&#10;import { useState } from 'react';&#10;&#10;function Example() {&#10;  const [open, setOpen] = useState(false);&#10;  &#10;  return (&#10;    <>&#10;      <ZButton onClick={() => setOpen(true)}>Open Modal</ZButton>&#10;      <ZModal &#10;        open={open} &#10;        onClose={() => setOpen(false)}&#10;        title=&quot;Modal Title&quot;&#10;      >&#10;        <p>This is the modal content.</p>&#10;        <ZButton onClick={() => setOpen(false)}>Confirm</ZButton>&#10;      </ZModal>&#10;    </>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZModal } from 'zurto-ui';
```

## Usage

```tsx
import { ZModal, ZButton } from 'zurto-ui';
import { useState } from 'react';

function Example() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <ZButton onClick={() => setOpen(true)}>Open Modal</ZButton>
      <ZModal 
        open={open} 
        onClose={() => setOpen(false)}
        title="Modal Title"
      >
        <p>This is the modal content.</p>
        <ZButton onClick={() => setOpen(false)}>Confirm</ZButton>
      </ZModal>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Control visibility |
| `onClose` | `() => void` | `-` | Close handler |
| `title` | `string` | `-` | Modal title |
| `size` | `'sm' | 'md' | 'lg' | 'xl'` | `'md'` | Modal width |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
