# ZAccordion

Collapsible content sections

## Example

<CodeToggle code="import { ZAccordion, ZAccordionItem } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZAccordion>&#10;      <ZAccordionItem title=&quot;What is Zurto UI?&quot;>&#10;        Zurto UI is a modern React component library.&#10;      </ZAccordionItem>&#10;      <ZAccordionItem title=&quot;How do I install it?&quot;>&#10;        npm install zurto-ui&#10;      </ZAccordionItem>&#10;    </ZAccordion>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZAccordion } from 'zurto-ui';
```

## Usage

```tsx
import { ZAccordion, ZAccordionItem } from 'zurto-ui';

function Example() {
  return (
    <ZAccordion>
      <ZAccordionItem title="What is Zurto UI?">
        Zurto UI is a modern React component library.
      </ZAccordionItem>
      <ZAccordionItem title="How do I install it?">
        npm install zurto-ui
      </ZAccordionItem>
    </ZAccordion>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `allowMultiple` | `boolean` | `false` | Allow multiple open |
| `defaultIndex` | `number | number[]` | `-` | Default open item(s) |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
