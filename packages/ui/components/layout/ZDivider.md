# ZDivider

A divider component for creating visual separation between content sections. Supports both horizontal and vertical orientations with optional labels.

## Import

```tsx
import { ZDivider } from "@zurto/ui";
```

## Interactive Examples

### Basic Dividers

Horizontal and vertical dividers with different styles.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '32px', minHeight: '200px' }}>
  <div style={{ marginBottom: '24px' }}>
    <p style={{ color: '#9ca3af', margin: '0 0 16px 0', fontSize: '14px' }}>
      Section One
    </p>
    <div style={{ 
      height: '1px', 
      background: '#3a3a3a',
      margin: '16px 0'
    }} />
    <p style={{ color: '#9ca3af', margin: '16px 0', fontSize: '14px' }}>
      Section Two
    </p>
  </div>
  
  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
    <div style={{ color: '#9ca3af', fontSize: '14px' }}>Left</div>
    <div style={{ 
      width: '1px', 
      height: '40px', 
      background: '#3a3a3a'
    }} />
    <div style={{ color: '#9ca3af', fontSize: '14px' }}>Middle</div>
    <div style={{ 
      width: '1px', 
      height: '40px', 
      background: '#3a3a3a'
    }} />
    <div style={{ color: '#9ca3af', fontSize: '14px' }}>Right</div>
  </div>
</div>
`} height="200px" />

### Labeled Dividers

Dividers with text labels for section organization.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '32px', minHeight: '280px' }}>
  <div style={{ marginBottom: '24px' }}>
    <h4 style={{ color: '#fff', margin: '0 0 16px 0', fontSize: '16px' }}>
      Account Settings
    </h4>
    <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
      Update your personal information
    </p>
  </div>
  
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '16px',
    margin: '24px 0'
  }}>
    <div style={{ flex: 1, height: '1px', background: '#3a3a3a' }} />
    <span style={{ 
      color: '#6b7280', 
      fontSize: '12px', 
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: 600
    }}>
      Profile
    </span>
    <div style={{ flex: 1, height: '1px', background: '#3a3a3a' }} />
  </div>
  
  <div style={{ marginBottom: '20px' }}>
    <label style={{ 
      display: 'block', 
      color: '#9ca3af', 
      fontSize: '13px', 
      marginBottom: '8px' 
    }}>
      Display Name
    </label>
    <input 
      type="text"
      placeholder="John Doe"
      style={{
        width: '100%',
        padding: '10px 12px',
        background: '#2a2a2a',
        border: '1px solid #3a3a3a',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box'
      }}
    />
  </div>
  
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '16px',
    margin: '24px 0'
  }}>
    <div style={{ flex: 1, height: '1px', background: '#3a3a3a' }} />
    <span style={{ 
      color: '#6b7280', 
      fontSize: '12px', 
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: 600
    }}>
      Privacy
    </span>
    <div style={{ flex: 1, height: '1px', background: '#3a3a3a' }} />
  </div>
  
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0'
  }}>
    <span style={{ color: '#9ca3af', fontSize: '14px' }}>
      Make profile public
    </span>
    <div style={{
      width: '44px',
      height: '24px',
      background: '#3a3a3a',
      borderRadius: '12px',
      position: 'relative',
      cursor: 'pointer'
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        background: '#6b7280',
        borderRadius: '50%',
        position: 'absolute',
        top: '2px',
        left: '2px',
        transition: 'all 0.2s'
      }} />
    </div>
  </div>
</div>
`} height="280px" />
