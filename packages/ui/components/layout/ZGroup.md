# ZGroup

A horizontal group component that arranges children in a row with consistent spacing. Perfect for button groups, tags, and inline elements.

## Import

```tsx
import { ZGroup } from "@zurto/ui";
```

## Interactive Examples

### Basic Group

A simple horizontal group with evenly spaced items.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '32px', minHeight: '200px' }}>
  <div style={{ 
    display: 'flex', 
    gap: '12px', 
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
    {['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'].map(tag => (
      <div key={tag} style={{
        background: '#2a2a2a',
        padding: '8px 16px',
        borderRadius: '6px',
        border: '1px solid #3a3a3a',
        color: '#9ca3af',
        fontSize: '14px'
      }}>
        {tag}
      </div>
    ))}
  </div>
</div>
`} height="200px" />

### Action Group

A group of action buttons with different styles.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '32px', minHeight: '250px' }}>
  <div style={{ marginBottom: '24px' }}>
    <h3 style={{ color: '#fff', margin: '0 0 16px 0', fontSize: '18px' }}>
      Confirm Action
    </h3>
    <p style={{ color: '#6b7280', margin: '0 0 20px 0', fontSize: '14px' }}>
      Are you sure you want to delete this item? This action cannot be undone.
    </p>
    
    <div style={{ 
      display: 'flex', 
      gap: '12px', 
      alignItems: 'center' 
    }}>
      <button style={{
        background: '#dc2626',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer'
      }}>
        Delete
      </button>
      <button style={{
        background: 'transparent',
        color: '#9ca3af',
        padding: '10px 20px',
        borderRadius: '6px',
        border: '1px solid #3a3a3a',
        fontSize: '14px',
        cursor: 'pointer'
      }}>
        Cancel
      </button>
      <div style={{ 
        marginLeft: 'auto',
        display: 'flex',
        gap: '8px'
      }}>
        <button style={{
          background: 'transparent',
          color: '#6b7280',
          padding: '10px 16px',
          borderRadius: '6px',
          border: '1px solid #3a3a3a',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          ℹ️ More Info
        </button>
      </div>
    </div>
  </div>
  
  <div style={{
    background: '#2a2a2a',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #3a3a3a',
    marginTop: '20px'
  }}>
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <span style={{ color: '#9ca3af', fontSize: '13px' }}>Tags:</span>
      {['important', 'urgent', 'review'].map(tag => (
        <span key={tag} style={{
          background: '#6366f1',
          color: '#fff',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500
        }}>
          {tag}
        </span>
      ))}
    </div>
  </div>
</div>
`} height="250px" />
