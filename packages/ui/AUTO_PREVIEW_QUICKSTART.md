# 🎯 QUICK START: Auto-Preview System

## Creating Component Examples (30 seconds per component)

### 1. Component Structure:

```
src/components/
  ZButton/
    ZButton.tsx           # Your component
    ZButton.module.css    # Styles
    index.ts              # Export
    examples/             # ← CREATE THIS!
      Basic.tsx          # Basic usage
      Variants.tsx       # Different variants
      Sizes.tsx          # Size variations
      Disabled.tsx       # Edge cases
```

### 2. Example File Template:

```tsx
// src/components/ZButton/examples/Basic.tsx
export default function BasicExample() {
  return (
    <div style={{ display: "flex", gap: "12px", padding: "20px" }}>
      <ZButton>Click Me</ZButton>
      <ZButton variant="secondary">Secondary</ZButton>
      <ZButton variant="ghost">Ghost</ZButton>
    </div>
  );
}
```

### 3. Generate Docs:

```bash
npm run docs:generate
```

### 4. Result:

Auto-generated markdown at `docs/components/button/ZButton.md`:

```markdown
# ZButton

## Basic Usage

<EnhancedPreview title="Basic">
<ZButton>Click Me</ZButton>
<ZButton variant="secondary">Secondary</ZButton>
<ZButton variant="ghost">Ghost</ZButton>
</EnhancedPreview>

## Variants

<EnhancedPreview title="Variants">
...
</EnhancedPreview>
```

---

## Example for 5 Common Components

### ZInput Examples:

```tsx
// src/components/ZInput/examples/Basic.tsx
export default function Basic() {
  const [value, setValue] = React.useState("");
  return (
    <ZInput value={value} onChange={setValue} placeholder="Enter text..." />
  );
}

// src/components/ZInput/examples/Variants.tsx
export default function Variants() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <ZInput placeholder="Default" />
      <ZInput placeholder="With label" label="Username" />
      <ZInput placeholder="With error" error="This field is required" />
      <ZInput placeholder="Disabled" disabled />
    </div>
  );
}
```

### ZButton Examples:

```tsx
// src/components/ZButton/examples/Sizes.tsx
export default function Sizes() {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <ZButton size="sm">Small</ZButton>
      <ZButton size="md">Medium</ZButton>
      <ZButton size="lg">Large</ZButton>
    </div>
  );
}
```

### ZCard Examples:

```tsx
// src/components/ZCard/examples/GlassEffect.tsx
export default function GlassEffect() {
  return (
    <ZCard glassEffect padding="lg">
      <h3>Glassmorphism Card</h3>
      <p>Beautiful backdrop blur effect</p>
    </ZCard>
  );
}
```

### ZSelect Examples:

```tsx
// src/components/ZSelect/examples/Basic.tsx
export default function Basic() {
  const [value, setValue] = React.useState("");
  const options = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
  ];
  return <ZSelect value={value} onChange={setValue} options={options} />;
}
```

### ZModal Examples:

```tsx
// src/components/ZModal/examples/Basic.tsx
export default function Basic() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <ZButton onClick={() => setOpen(true)}>Open Modal</ZButton>
      <ZModal open={open} onClose={() => setOpen(false)}>
        <h2>Modal Title</h2>
        <p>Modal content goes here</p>
      </ZModal>
    </>
  );
}
```

---

## Bulk Creation Script

Create examples for multiple components at once:

```bash
# create-examples.sh
#!/bin/bash

COMPONENTS=(
  "ZButton"
  "ZInput"
  "ZCard"
  "ZSelect"
  "ZModal"
  "ZCheckbox"
  "ZRadio"
  "ZSwitch"
  "ZSlider"
  "ZTextarea"
)

for comp in "${COMPONENTS[@]}"; do
  mkdir -p "src/components/$comp/examples"

  # Basic example
  cat > "src/components/$comp/examples/Basic.tsx" <<EOF
export default function Basic() {
  return <$comp>Example</$comp>;
}
EOF

  echo "Created examples for $comp"
done

echo "Done! Run: npm run docs:generate"
```

---

## Windows PowerShell Version

```powershell
# create-examples.ps1
$components = @(
  'ZButton',
  'ZInput',
  'ZCard',
  'ZSelect',
  'ZModal'
)

foreach ($comp in $components) {
  $path = "src\components\$comp\examples"
  New-Item -ItemType Directory -Force -Path $path | Out-Null

  $content = @"
export default function Basic() {
  return <$comp>Example</$comp>;
}
"@

  Set-Content -Path "$path\Basic.tsx" -Value $content
  Write-Host "✅ Created examples for $comp" -ForegroundColor Green
}

Write-Host "`n🎉 Done! Run: npm run docs:generate" -ForegroundColor Cyan
```

Run it:

```powershell
.\create-examples.ps1
npm run docs:generate
npm run docs:dev
```

---

## Workflow for 1000 Components

### Phase 1: Setup (1 hour)

1. Create `scripts/generate-preview-docs.mjs` ✅
2. Add `docs:generate` to package.json ✅
3. Create example template

### Phase 2: Batch Creation (8 hours for 1000 components)

```bash
# 30 seconds per component = 8.3 hours for 1000
for component in $(find src/components -name "index.ts"); do
  dir=$(dirname $component)
  name=$(basename $dir)
  mkdir -p "$dir/examples"
  # Create basic example
  echo "export default () => <$name />" > "$dir/examples/Basic.tsx"
done
```

### Phase 3: Refinement (ongoing)

- Add more examples per component (2-5 examples each)
- Improve example quality
- Add edge cases
- Test user flows

---

## Benefits

| Metric                 | Manual MD Files       | Auto-Generated   |
| ---------------------- | --------------------- | ---------------- |
| **Time per component** | 5 minutes             | 30 seconds       |
| **1000 components**    | 83 hours              | 8 hours          |
| **Maintenance**        | High (manual updates) | Zero (auto-sync) |
| **Consistency**        | Variable              | Perfect          |
| **Errors**             | Common                | Rare             |
| **Scaling**            | Doesn't scale         | Infinite scale   |

---

## Next Steps

1. ✅ System is set up and ready
2. [ ] Create examples for 10 components (test)
3. [ ] Run `npm run docs:generate`
4. [ ] Verify output quality
5. [ ] Scale to all 153 components
6. [ ] Eventually: 1000+ components

**Your docs will always be up-to-date and beautiful!** 🚀
