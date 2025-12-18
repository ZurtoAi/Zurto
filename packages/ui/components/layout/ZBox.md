# ZBox

A generic box component with configurable padding, margin, background, and border. The building block for custom layouts and wrappers.

## Import

```tsx
import { ZBox } from "@zurto/ui";
```

## Interactive Examples

### Basic Box

A simple box with padding and border styling.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '32px', minHeight: '200px' }}>
  <div style={{ 
    padding: '24px',
    background: '#2a2a2a',
    borderRadius: '8px',
    border: '1px solid #3a3a3a'
  }}>
    <h4 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '16px' }}>
      Basic Box Component
    </h4>
    <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
      This is a simple box with padding and border. Use it as a building block for more complex layouts.
    </p>
  </div>
</div>
`} height="200px" />

### Card Layout

Multiple boxes arranged to create a card-based layout.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '32px', minHeight: '300px' }}>
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(2, 1fr)', 
    gap: '16px' 
  }}>
    {[
      { title: 'Total Tasks', value: '24', change: '+12%', color: '#6366f1' },
      { title: 'Completed', value: '18', change: '+8%', color: '#10b981' },
      { title: 'In Progress', value: '4', change: '+2', color: '#f59e0b' },
      { title: 'Blocked', value: '2', change: '-1', color: '#ef4444' }
    ].map((stat, i) => (
      <div key={i} style={{
        padding: '20px',
        background: '#2a2a2a',
        borderRadius: '8px',
        border: '1px solid #3a3a3a',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          background: stat.color
        }} />
        <div style={{ 
          color: '#6b7280', 
          fontSize: '12px', 
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {stat.title}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'baseline', 
          gap: '12px',
          marginBottom: '4px'
        }}>
          <span style={{ 
            color: '#fff', 
            fontSize: '28px', 
            fontWeight: 700 
          }}>
            {stat.value}
          </span>
          <span style={{ 
            color: stat.change.startsWith('+') ? '#10b981' : '#ef4444', 
            fontSize: '14px',
            fontWeight: 500
          }}>
            {stat.change}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
`} height="300px" />
