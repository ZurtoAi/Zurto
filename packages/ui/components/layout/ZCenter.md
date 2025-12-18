# ZCenter

A centering component that horizontally and/or vertically centers its children. Perfect for loading states, empty states, and centered content.

## Import

```tsx
import { ZCenter } from "@zurto/ui";
```

## Interactive Examples

### Basic Center

Content centered both horizontally and vertically.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '32px', minHeight: '200px' }}>
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    minHeight: '200px'
  }}>
    <div style={{
      textAlign: 'center',
      padding: '24px',
      background: '#2a2a2a',
      borderRadius: '8px',
      border: '1px solid #3a3a3a'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
      <h4 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '16px' }}>
        Perfectly Centered
      </h4>
      <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
        Content is centered in all directions
      </p>
    </div>
  </div>
</div>
`} height="200px" />

### Empty State

A centered empty state with call-to-action.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '32px', minHeight: '300px' }}>
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    minHeight: '300px',
    background: '#2a2a2a',
    borderRadius: '8px',
    border: '1px solid #3a3a3a'
  }}>
    <div style={{
      textAlign: 'center',
      maxWidth: '320px',
      padding: '32px'
    }}>
      <div style={{ 
        fontSize: '64px', 
        marginBottom: '16px',
        opacity: 0.6 
      }}>
        📋
      </div>
      <h3 style={{ 
        color: '#fff', 
        margin: '0 0 12px 0', 
        fontSize: '20px',
        fontWeight: 600
      }}>
        No Tasks Yet
      </h3>
      <p style={{ 
        color: '#6b7280', 
        margin: '0 0 24px 0', 
        fontSize: '14px',
        lineHeight: '1.6'
      }}>
        Get started by creating your first task. Tasks help you stay organized and track your progress.
      </p>
      <button style={{
        background: '#6366f1',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>+</span>
        <span>Create Task</span>
      </button>
    </div>
  </div>
</div>
`} height="300px" />
