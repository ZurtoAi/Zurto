# ZContainer

A responsive container component that centers content with a maximum width. Perfect for creating consistent page layouts and maintaining readable line lengths.

## Import

```tsx
import { ZContainer } from "@zurto/ui";
```

## Interactive Examples

### Basic Container

A simple centered container with default max-width and padding.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '40px 20px', minHeight: '200px' }}>
  <div style={{ 
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '24px',
    background: '#2a2a2a',
    borderRadius: '8px',
    border: '1px solid #3a3a3a'
  }}>
    <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '20px' }}>Centered Container</h3>
    <p style={{ color: '#a0a0a0', margin: 0, lineHeight: '1.6' }}>
      This container is centered with a maximum width of 1200px. It automatically adjusts to smaller screens while maintaining padding.
    </p>
  </div>
</div>
`} height="200px" />

### Dashboard Layout

Container used for a dashboard with multiple content sections.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '40px 20px', minHeight: '250px' }}>
  <div style={{ 
    maxWidth: '1400px', 
    margin: '0 auto', 
    padding: '32px'
  }}>
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '24px' }}>Dashboard</h2>
      <p style={{ color: '#6b7280', margin: 0 }}>Welcome back, here's your overview</p>
    </div>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: '16px' 
    }}>
      {['Tasks', 'Projects', 'Team'].map((item, i) => (
        <div key={i} style={{
          background: '#2a2a2a',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #3a3a3a'
        }}>
          <div style={{ color: '#6366f1', fontSize: '28px', marginBottom: '8px' }}>{i + 1}</div>
          <div style={{ color: '#fff', fontSize: '14px' }}>{item}</div>
        </div>
      ))}
    </div>
  </div>
</div>
`} height="250px" />
