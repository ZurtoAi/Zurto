# Animations

Animation tokens for consistent motion.

## Durations

| Token                 | Value | Usage                |
| --------------------- | ----- | -------------------- |
| `--z-duration-fast`   | 150ms | Hovers, toggles      |
| `--z-duration-normal` | 250ms | Standard transitions |
| `--z-duration-slow`   | 400ms | Complex animations   |

## Easing

| Token              | Value                                    | Usage            |
| ------------------ | ---------------------------------------- | ---------------- |
| `--z-ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)`           | Standard easing  |
| `--z-ease-in`      | `cubic-bezier(0.4, 0, 1, 1)`             | Exit animations  |
| `--z-ease-out`     | `cubic-bezier(0, 0, 0.2, 1)`             | Enter animations |
| `--z-ease-bounce`  | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful motion   |

## Usage

```css
.button {
  transition: all var(--z-duration-fast) var(--z-ease-default);
}

.modal-enter {
  animation: fadeIn var(--z-duration-normal) var(--z-ease-out);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Reduced Motion

Components respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

