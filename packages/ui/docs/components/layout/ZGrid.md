# ZGrid

CSS Grid container

## Example

<CodeToggle code="import { ZGrid } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZGrid columns={3} gap={12}>&#10;      <div>1</div>&#10;      <div>2</div>&#10;      <div>3</div>&#10;      <div>4</div>&#10;      <div>5</div>&#10;      <div>6</div>&#10;    </ZGrid>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZGrid } from 'zurto-ui';
```

## Usage

```tsx
import { ZGrid } from 'zurto-ui';

function Example() {
  return (
    <ZGrid columns={3} gap={12}>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
    </ZGrid>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `number | string` | `1` | Number of columns |
| `gap` | `number` | `0` | Gap between items |
| `rowGap` | `number` | `-` | Row gap (overrides gap) |
| `columnGap` | `number` | `-` | Column gap (overrides gap) |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
