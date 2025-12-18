# Shadows

Shadow tokens for depth and elevation.

## Scale

| Token           | Value                            | Usage            |
| --------------- | -------------------------------- | ---------------- |
| `--z-shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.3)`   | Subtle depth     |
| `--z-shadow-md` | `0 4px 6px rgba(0, 0, 0, 0.4)`   | Cards, dropdowns |
| `--z-shadow-lg` | `0 10px 15px rgba(0, 0, 0, 0.5)` | Modals, popovers |
| `--z-shadow-xl` | `0 20px 25px rgba(0, 0, 0, 0.6)` | Large overlays   |

## Glow Effect

```css
--z-shadow-glow: 0 0 20px rgba(223, 62, 83, 0.3);
```

## Usage

```css
.card {
  box-shadow: var(--z-shadow-md);
}

.card:hover {
  box-shadow: var(--z-shadow-lg);
}

.button-primary:hover {
  box-shadow: var(--z-shadow-glow);
}
```

