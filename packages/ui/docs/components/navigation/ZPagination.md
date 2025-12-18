# ZPagination

Page navigation

## Example

<CodeToggle code="import { ZPagination } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZPagination &#10;      total={100}&#10;      pageSize={10}&#10;      current={2}&#10;      onChange={(page) => console.log(page)}&#10;    />&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZPagination } from 'zurto-ui';
```

## Usage

```tsx
import { ZPagination } from 'zurto-ui';

function Example() {
  return (
    <ZPagination 
      total={100}
      pageSize={10}
      current={2}
      onChange={(page) => console.log(page)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `total` | `number` | `-` | Total items |
| `pageSize` | `number` | `10` | Items per page |
| `current` | `number` | `1` | Current page |
| `onChange` | `(page) => void` | `-` | Page change handler |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
