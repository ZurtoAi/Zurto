# ZList

List component from zurto-ui.

## Preview

<CodeToggle code="import { ZList, ZListItem } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZList>&#10;      <ZListItem icon=&quot;📄&quot;>Document 1</ZListItem>&#10;      <ZListItem icon=&quot;📄&quot;>Document 2</ZListItem>&#10;      <ZListItem icon=&quot;📄&quot;>Document 3</ZListItem>&#10;    </ZList>&#10;  );&#10;}">
  <div style="display: flex; justify-content: center; align-items: center; min-height: 80px; padding: 24px;">
    <ul style="list-style: none; padding: 0; margin: 0; border: 1px solid #333; border-radius: 8px; overflow: hidden;"><li style="padding: 12px 16px; border-bottom: 1px solid #333; color: white; display: flex; align-items: center; gap: 12px;"><span>📄</span> Document 1</li><li style="padding: 12px 16px; border-bottom: 1px solid #333; color: white; display: flex; align-items: center; gap: 12px;"><span>📄</span> Document 2</li><li style="padding: 12px 16px; color: white; display: flex; align-items: center; gap: 12px;"><span>📄</span> Document 3</li></ul>
  </div>
</CodeToggle>

## Import

```typescript
import { ZList } from 'zurto-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `bordered` | `boolean` | `true` | Show borders |
| `hoverable` | `boolean` | `true` | Hover effect |


## Sizes

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; background: var(--vp-c-bg-soft); border-radius: 8px; margin: 16px 0;">
  <button style="padding: 6px 12px; background: #c73548; color: white; border: none; border-radius: 6px; font-size: 12px;">Small</button>
  <button style="padding: 10px 20px; background: #c73548; color: white; border: none; border-radius: 8px; font-size: 14px;">Medium</button>
  <button style="padding: 14px 28px; background: #c73548; color: white; border: none; border-radius: 10px; font-size: 16px;">Large</button>
</div>

```tsx
<ZList size="sm">Small</ZList>
<ZList size="md">Medium</ZList>
<ZList size="lg">Large</ZList>
```

## Accessibility

- ✅ Proper ARIA attributes included
- ✅ Keyboard navigation support  
- ✅ Screen reader friendly
- ✅ Focus visible indicators
