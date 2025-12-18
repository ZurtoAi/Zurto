# Accessibility

`@zurto/ui` is built with accessibility in mind, following WCAG 2.1 AA guidelines.

## Features

### Keyboard Navigation

All interactive components support full keyboard navigation:

- **Tab** – Navigate between focusable elements
- **Enter/Space** – Activate buttons and controls
- **Arrow keys** – Navigate within composite widgets
- **Escape** – Close modals, dropdowns, and overlays

### Focus Management

- Visible focus indicators on all interactive elements
- Focus trapping in modals and dialogs
- Focus restoration when modals close
- Skip links for main content navigation

### Screen Reader Support

- Proper ARIA attributes on all components
- Live regions for dynamic content
- Descriptive labels and announcements
- Role attributes for semantic meaning

### Color Contrast

All text and interactive elements meet WCAG AA contrast requirements:

- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

## Component Examples

### ZButton

```tsx
<ZButton aria-label="Close dialog">
  <CloseIcon />
</ZButton>
```

### ZModal

Focus is trapped inside the modal and restored on close:

```tsx
<ZModal open={isOpen} onClose={handleClose} aria-labelledby="modal-title">
  <h2 id="modal-title">Modal Title</h2>
  <p>Modal content...</p>
</ZModal>
```

### ZTooltip

Tooltips are accessible via focus and hover:

```tsx
<ZTooltip content="Helpful description">
  <ZButton>Hover or focus me</ZButton>
</ZTooltip>
```

### ZTabs

Navigate tabs with arrow keys:

```tsx
<ZTabs
  items={[
    { id: "tab1", label: "First Tab", content: <FirstPanel /> },
    { id: "tab2", label: "Second Tab", content: <SecondPanel /> },
  ]}
/>
```

## Testing Accessibility

We recommend testing with:

- **axe DevTools** – Browser extension for automated testing
- **VoiceOver** (macOS) / **NVDA** (Windows) – Screen readers
- **Keyboard only** – Navigate without a mouse

## Customizing Focus Styles

Override the focus ring if needed:

```css
:root {
  --z-focus-ring: 0 0 0 2px var(--z-primary);
}

/* Or per component */
.my-button:focus-visible {
  outline: 2px solid var(--z-primary);
  outline-offset: 2px;
}
```

## Reduced Motion

Components respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Inclusive Components](https://inclusive-components.design/)

