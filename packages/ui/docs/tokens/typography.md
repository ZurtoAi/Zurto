# Typography

Typography tokens for consistent text styling.

## Font Families

```css
--z-font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--z-font-mono: "JetBrains Mono", "Fira Code", "SF Mono", monospace;
```

## Font Sizes

| Token           | Size            | Usage            |
| --------------- | --------------- | ---------------- |
| `--z-text-xs`   | 0.75rem (12px)  | Captions, labels |
| `--z-text-sm`   | 0.875rem (14px) | Secondary text   |
| `--z-text-base` | 1rem (16px)     | Body text        |
| `--z-text-lg`   | 1.125rem (18px) | Lead paragraphs  |
| `--z-text-xl`   | 1.25rem (20px)  | Small headings   |
| `--z-text-2xl`  | 1.5rem (24px)   | Section titles   |
| `--z-text-3xl`  | 1.875rem (30px) | Page titles      |
| `--z-text-4xl`  | 2.25rem (36px)  | Hero titles      |

## Font Weights

```css
--z-font-normal: 400;
--z-font-medium: 500;
--z-font-semibold: 600;
--z-font-bold: 700;
```

## Line Heights

```css
--z-leading-none: 1;
--z-leading-tight: 1.25;
--z-leading-snug: 1.375;
--z-leading-normal: 1.5;
--z-leading-relaxed: 1.625;
--z-leading-loose: 2;
```

## Usage

```css
.heading {
  font-family: var(--z-font-sans);
  font-size: var(--z-text-2xl);
  font-weight: var(--z-font-semibold);
  line-height: var(--z-leading-tight);
}

.code {
  font-family: var(--z-font-mono);
  font-size: var(--z-text-sm);
}
```

