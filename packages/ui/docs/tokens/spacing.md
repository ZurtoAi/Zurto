# Spacing

Consistent spacing scale based on 4px units.

## Scale

| Token         | Value | Example           |
| ------------- | ----- | ----------------- |
| `--z-space-1` | 4px   | Inline spacing    |
| `--z-space-2` | 8px   | Compact padding   |
| `--z-space-3` | 12px  | Default gap       |
| `--z-space-4` | 16px  | Component padding |
| `--z-space-5` | 24px  | Section spacing   |
| `--z-space-6` | 32px  | Large sections    |
| `--z-space-7` | 48px  | Page sections     |
| `--z-space-8` | 64px  | Hero spacing      |

## Usage

```css
.card {
  padding: var(--z-space-4);
  margin-bottom: var(--z-space-5);
}

.stack > * + * {
  margin-top: var(--z-space-3);
}
```

## Gaps

For flex and grid layouts:

```css
.grid {
  display: grid;
  gap: var(--z-space-4);
}
```

