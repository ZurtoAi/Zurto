# ZCode

Code component from zurto-ui.

## Preview

<CodeToggle code="import { ZCode } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZCode language=&quot;javascript&quot;>&#10;      {`const greeting = 'Hello World';`}&#10;    </ZCode>&#10;  );&#10;}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    <pre style="padding: 16px; background: #0d1117; border-radius: 8px; overflow-x: auto;"><code style="color: #e6edf3; font-family: monospace; font-size: 14px;"><span style="color: #ff7b72;">const</span> <span style="color: #79c0ff;">greeting</span> = <span style="color: #a5d6ff;">'Hello World'</span>;</code></pre>
  </div>
</CodeToggle>

## Import

```typescript
import { ZCode } from 'zurto-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `language` | `string` | `-` | Code language |
| `showLineNumbers` | `boolean` | `false` | Show line numbers |
| `copyable` | `boolean` | `true` | Show copy button |


## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

```tsx
<ZCode size="sm">Small</ZCode>
<ZCode size="md">Medium</ZCode>
<ZCode size="lg">Large</ZCode>
```

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
