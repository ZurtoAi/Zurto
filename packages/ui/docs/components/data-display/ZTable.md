# ZTable

Data table component

## Example

<CodeToggle code="import { ZTable } from 'zurto-ui';&#10;&#10;const columns = [&#10;  { key: 'name', title: 'Name' },&#10;  { key: 'email', title: 'Email' },&#10;  { key: 'role', title: 'Role' },&#10;];&#10;&#10;const data = [&#10;  { name: 'John Doe', email: 'john@example.com', role: 'Admin' },&#10;  { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },&#10;];&#10;&#10;function Example() {&#10;  return <ZTable columns={columns} data={data} />;&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZTable } from 'zurto-ui';
```

## Usage

```tsx
import { ZTable } from 'zurto-ui';

const columns = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  { key: 'role', title: 'Role' },
];

const data = [
  { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
];

function Example() {
  return <ZTable columns={columns} data={data} />;
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Array<Column>` | `-` | Column definitions |
| `data` | `Array<Row>` | `-` | Table data |
| `striped` | `boolean` | `false` | Striped rows |
| `hoverable` | `boolean` | `true` | Hover effect |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
