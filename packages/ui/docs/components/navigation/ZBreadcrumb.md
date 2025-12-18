# ZBreadcrumb

Breadcrumb navigation

## Example

<CodeToggle code="import { ZBreadcrumb, ZBreadcrumbItem } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZBreadcrumb>&#10;      <ZBreadcrumbItem href=&quot;/&quot;>Home</ZBreadcrumbItem>&#10;      <ZBreadcrumbItem href=&quot;/products&quot;>Products</ZBreadcrumbItem>&#10;      <ZBreadcrumbItem>Details</ZBreadcrumbItem>&#10;    </ZBreadcrumb>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZBreadcrumb } from 'zurto-ui';
```

## Usage

```tsx
import { ZBreadcrumb, ZBreadcrumbItem } from 'zurto-ui';

function Example() {
  return (
    <ZBreadcrumb>
      <ZBreadcrumbItem href="/">Home</ZBreadcrumbItem>
      <ZBreadcrumbItem href="/products">Products</ZBreadcrumbItem>
      <ZBreadcrumbItem>Details</ZBreadcrumbItem>
    </ZBreadcrumb>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `separator` | `ReactNode` | `'/'` | Separator element |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
