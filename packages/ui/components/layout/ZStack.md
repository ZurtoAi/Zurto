# ZStack

A vertical stack component that arranges children with consistent spacing. Perfect for creating vertical layouts and form groups.

## Import

```tsx
import { ZStack } from "@zurto/ui";
```

## Interactive Examples

### Basic Stack

A simple vertical stack with consistent spacing between items.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '32px', minHeight: '200px' }}>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    {['First Item', 'Second Item', 'Third Item'].map((item, i) => (
      <div key={i} style={{
        background: '#2a2a2a',
        padding: '16px 20px',
        borderRadius: '8px',
        border: '1px solid #3a3a3a',
        color: '#fff'
      }}>
        {item}
      </div>
    ))}
  </div>
</div>
`} height="200px" />

### Form Stack

A stacked form layout with labels and inputs.

<ComponentPreview code={`

<div style={{ background: '#1a1a1a', padding: '32px', minHeight: '300px' }}>
  <div style={{ maxWidth: '400px', margin: '0 auto' }}>
    <h3 style={{ color: '#fff', margin: '0 0 24px 0', fontSize: '20px' }}>Sign Up</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {[
        { label: 'Name', placeholder: 'Enter your name' },
        { label: 'Email', placeholder: 'you@example.com' },
        { label: 'Password', placeholder: '••••••••' }
      ].map((field, i) => (
        <div key={i}>
          <label style={{ 
            display: 'block', 
            color: '#9ca3af', 
            fontSize: '14px', 
            marginBottom: '8px',
            fontWeight: 500
          }}>
            {field.label}
          </label>
          <input 
            type="text"
            placeholder={field.placeholder}
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
      ))}
      <button style={{
        background: '#6366f1',
        color: '#fff',
        padding: '12px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        marginTop: '4px'
      }}>
        Create Account
      </button>
    </div>
  </div>
</div>
`} height="300px" />
