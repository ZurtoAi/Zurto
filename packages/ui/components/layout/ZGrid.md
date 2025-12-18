# ZGrid

A responsive grid layout component that automatically adjusts columns based on screen size. Supports 2, 3, or 4 column layouts with consistent spacing.

## Import

```tsx
import { ZGrid } from "@zurto/ui";
```

## Interactive Examples

### Basic Grid

A simple 3-column grid with equal-width items.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '32px', minHeight: '200px' }}>
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(3, 1fr)', 
    gap: '16px' 
  }}>
    {[1, 2, 3, 4, 5, 6].map(num => (
      <div key={num} style={{
        background: '#2a2a2a',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #3a3a3a',
        textAlign: 'center'
      }}>
        <div style={{ color: '#6366f1', fontSize: '24px', marginBottom: '4px' }}>{num}</div>
        <div style={{ color: '#9ca3af', fontSize: '12px' }}>Item {num}</div>
      </div>
    ))}
  </div>
</div>
`} height="200px" />

### Feature Grid

A 4-column grid displaying product features with icons.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '32px', minHeight: '250px' }}>
  <h3 style={{ color: '#fff', margin: '0 0 24px 0', fontSize: '20px' }}>Features</h3>
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(4, 1fr)', 
    gap: '20px' 
  }}>
    {[
      { icon: '⚡', title: 'Fast', desc: 'Lightning quick' },
      { icon: '🔒', title: 'Secure', desc: 'Enterprise grade' },
      { icon: '📱', title: 'Responsive', desc: 'Works everywhere' },
      { icon: '🎨', title: 'Beautiful', desc: 'Pixel perfect' }
    ].map((feature, i) => (
      <div key={i} style={{
        background: '#2a2a2a',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #3a3a3a',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>{feature.icon}</div>
        <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
          {feature.title}
        </div>
        <div style={{ color: '#6b7280', fontSize: '12px' }}>{feature.desc}</div>
      </div>
    ))}
  </div>
</div>
`} height="250px" />
