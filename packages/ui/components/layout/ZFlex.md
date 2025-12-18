# ZFlex

A flexible flexbox layout component with configurable direction, gap, alignment, and justify properties. Perfect for creating responsive layouts with precise control.

## Import

```tsx
import { ZFlex } from "@zurto/ui";
```

## Interactive Examples

### Basic Flex Row

A horizontal flex layout with gap and centered alignment.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '32px', minHeight: '200px' }}>
  <div style={{ 
    display: 'flex', 
    gap: '16px', 
    alignItems: 'center',
    justifyContent: 'flex-start'
  }}>
    {[1, 2, 3, 4].map(num => (
      <div key={num} style={{
        background: '#2a2a2a',
        padding: '20px 24px',
        borderRadius: '8px',
        border: '1px solid #3a3a3a',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 600
      }}>
        Item {num}
      </div>
    ))}
  </div>
</div>
`} height="200px" />

### Header Layout

A flex layout for a header with logo, navigation, and actions.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '20px 32px', minHeight: '250px' }}>
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    background: '#2a2a2a',
    padding: '16px 24px',
    borderRadius: '8px',
    border: '1px solid #3a3a3a'
  }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px' 
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        background: '#6366f1',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px'
      }}>Z</div>
      <span style={{ color: '#fff', fontSize: '18px', fontWeight: 600 }}>Zurto</span>
    </div>
    
    <div style={{ display: 'flex', gap: '24px' }}>
      {['Dashboard', 'Tasks', 'Team'].map(item => (
        <a key={item} style={{ 
          color: '#9ca3af', 
          textDecoration: 'none',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          {item}
        </a>
      ))}
    </div>
    
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <button style={{
        background: 'transparent',
        border: '1px solid #3a3a3a',
        color: '#9ca3af',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer'
      }}>
        Sign In
      </button>
      <button style={{
        background: '#6366f1',
        border: 'none',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer'
      }}>
        Sign Up
      </button>
    </div>
  </div>
  
  <div style={{ 
    marginTop: '32px', 
    padding: '24px',
    background: '#2a2a2a',
    borderRadius: '8px',
    border: '1px solid #3a3a3a'
  }}>
    <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>
      Flex layout allows precise control over spacing, alignment, and direction.
    </p>
  </div>
</div>
`} height="250px" />
