# ZTabs

Tabbed navigation

## Example

<CodeToggle code="import { ZTabs, ZTabList, ZTab, ZTabPanels, ZTabPanel } from 'zurto-ui';&#10;&#10;function Example() {&#10;  return (&#10;    <ZTabs defaultValue=&quot;tab1&quot;>&#10;      <ZTabList>&#10;        <ZTab value=&quot;tab1&quot;>Tab 1</ZTab>&#10;        <ZTab value=&quot;tab2&quot;>Tab 2</ZTab>&#10;        <ZTab value=&quot;tab3&quot;>Tab 3</ZTab>&#10;      </ZTabList>&#10;      <ZTabPanels>&#10;        <ZTabPanel value=&quot;tab1&quot;>Tab 1 content</ZTabPanel>&#10;        <ZTabPanel value=&quot;tab2&quot;>Tab 2 content</ZTabPanel>&#10;        <ZTabPanel value=&quot;tab3&quot;>Tab 3 content</ZTabPanel>&#10;      </ZTabPanels>&#10;    </ZTabs>&#10;  );&#10;}">
  <div style="padding: 24px; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 12px; display: flex; justify-content: center; align-items: center; min-height: 80px;">
    <span style="color: #888;">Interactive preview coming soon</span>
  </div>
</CodeToggle>

## Import

```tsx
import { ZTabs } from 'zurto-ui';
```

## Usage

```tsx
import { ZTabs, ZTabList, ZTab, ZTabPanels, ZTabPanel } from 'zurto-ui';

function Example() {
  return (
    <ZTabs defaultValue="tab1">
      <ZTabList>
        <ZTab value="tab1">Tab 1</ZTab>
        <ZTab value="tab2">Tab 2</ZTab>
        <ZTab value="tab3">Tab 3</ZTab>
      </ZTabList>
      <ZTabPanels>
        <ZTabPanel value="tab1">Tab 1 content</ZTabPanel>
        <ZTabPanel value="tab2">Tab 2 content</ZTabPanel>
        <ZTabPanel value="tab3">Tab 3 content</ZTabPanel>
      </ZTabPanels>
    </ZTabs>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | `-` | Default tab |
| `value` | `string` | `-` | Controlled value |
| `onChange` | `(value) => void` | `-` | Tab change handler |


## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA attributes included
- ✅ Screen reader friendly
- ✅ Focus management
