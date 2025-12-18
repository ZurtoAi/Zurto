---
layout: home

hero:
  name: "Zurto UI"
  text: "153 Production-Ready React Components"
  tagline: "The ultimate dark-theme component library with glassmorphism effects, interactive previews, and unmatched visual appeal. Built for developers who demand both beauty and functionality."
  image:
    src: /logo.svg
    alt: Zurto UI
  actions:
    - theme: brand
      text: Get Started →
      link: /guide/getting-started
    - theme: alt
      text: Browse 153 Components
      link: /components/
    - theme: alt
      text: View on GitHub ⭐
      link: https://github.com/zurto/zurto-ui

features:
  - icon: 🎨
    title: 153 Premium Components
    details: The most comprehensive React component library. From basic buttons to advanced data tables, charts, and interactive visualizations.
  - icon: 🌙
    title: Dark Theme Perfection
    details: Stunning dark theme with glassmorphism effects, smooth animations, and carefully crafted color palettes that make your apps stand out.
  - icon: 🎮
    title: Interactive Previews
    details: Edit code live and see instant results. Every component comes with interactive playground for rapid prototyping and experimentation.
  - icon: 📦
    title: Tree-Shakable & Optimized
    details: Import only what you need. Zero unused code in production. Each component is independently importable with automatic dead-code elimination.
  - icon: 🎯
    title: TypeScript Native
    details: Full type safety with comprehensive TypeScript definitions. Excellent IDE support, autocomplete, and inline documentation.
  - icon: ♿
    title: Accessible by Design
    details: WCAG 2.1 AA compliant with full keyboard navigation, screen reader support, and ARIA labels. Accessibility is not optional.
  - icon: ⚡
    title: Blazing Fast
    details: Optimized for performance with virtualized lists, lazy loading, code splitting, and minimal re-renders. Your users will feel the difference.
  - icon: 🎭
    title: Highly Customizable
    details: Override styles, extend components, and create your own themes. Full CSS-in-JS support with emotion and styled-components compatibility.
  - icon: 🔧
    title: Developer Experience
    details: Intuitive API design, extensive documentation, real-world examples, and a supportive community. Building UIs has never been easier.
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #df3e53 30%, #e85566 70%, #ff6b7a);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #df3e53 50%, #e85566 50%);
  --vp-home-hero-image-filter: blur(40px);
}

.VPFeature {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.VPFeature:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(223, 62, 83, 0.2);
}

.custom-block {
  border-left: 4px solid #df3e53;
}
</style>

## 🚀 Quick Start - Get Up and Running in 60 Seconds

::: code-group

```bash [npm]
npm install @zurto/ui
```

```bash [yarn]
yarn add @zurto/ui
```

```bash [pnpm]
pnpm add @zurto/ui
```

:::

### Your First Component in 3 Lines

```tsx
import { ZButton, ZCard, ZInput } from "@zurto/ui";
import "@zurto/ui/styles"; // Import base styles

function App() {
  return (
    <ZCard glassEffect>
      <h2>Welcome to Zurto UI</h2>
      <ZInput placeholder="Enter your email" leftIcon="mail" />
      <ZButton variant="primary" leftIcon="send">
        Get Started
      </ZButton>
    </ZCard>
  );
}
```

::: tip What Makes This Special?

- ✨ **Glassmorphism** applied with one prop (`glassEffect`)
- 🎨 **Built-in icons** - no icon library needed
- 🌙 **Dark theme** enabled automatically
- 📦 **Tree-shaken** - only imports what you use
  :::

## 📂 Component Categories - 153 Components Organized by Purpose

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin: 32px 0;">

<div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
  <div style="font-size: 32px; margin-bottom: 12px;">🎨</div>
  <h3 style="margin: 0 0 8px 0;">Layout & Structure</h3>
  <p style="color: #888; margin: 0;">Cards, Containers, Grid, Flex, Dividers, Spacers</p>
  <a href="/components/#layout" style="color: #df3e53; margin-top: 12px; display: inline-block;">Explore →</a>
</div>

<div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
  <div style="font-size: 32px; margin-bottom: 12px;">🔘</div>
  <h3 style="margin: 0 0 8px 0;">Buttons & Actions</h3>
  <p style="color: #888; margin: 0;">Buttons, Icon Buttons, Button Groups, Action Bars</p>
  <a href="/components/#buttons" style="color: #df3e53; margin-top: 12px; display: inline-block;">Explore →</a>
</div>

<div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
  <div style="font-size: 32px; margin-bottom: 12px;">📝</div>
  <h3 style="margin: 0 0 8px 0;">Forms & Input</h3>
  <p style="color: #888; margin: 0;">Inputs, Selects, Checkboxes, Radio, Switches, File Upload</p>
  <a href="/components/#forms" style="color: #df3e53; margin-top: 12px; display: inline-block;">Explore →</a>
</div>

<div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
  <div style="font-size: 32px; margin-bottom: 12px;">📊</div>
  <h3 style="margin: 0 0 8px 0;">Data Display</h3>
  <p style="color: #888; margin: 0;">Tables, Lists, DataGrid, Charts, Stats, Badges, Tags</p>
  <a href="/components/#data" style="color: #df3e53; margin-top: 12px; display: inline-block;">Explore →</a>
</div>

<div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
  <div style="font-size: 32px; margin-bottom: 12px;">💬</div>
  <h3 style="margin: 0 0 8px 0;">Feedback & Alerts</h3>
  <p style="color: #888; margin: 0;">Alerts, Toasts, Modals, Dialogs, Progress, Spinners</p>
  <a href="/components/#feedback" style="color: #df3e53; margin-top: 12px; display: inline-block;">Explore →</a>
</div>

<div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
  <div style="font-size: 32px; margin-bottom: 12px;">🧭</div>
  <h3 style="margin: 0 0 8px 0;">Navigation</h3>
  <p style="color: #888; margin: 0;">Navbar, Sidebar, Tabs, Breadcrumbs, Pagination, Menu</p>
  <a href="/components/#navigation" style="color: #df3e53; margin-top: 12px; display: inline-block;">Explore →</a>
</div>

</div>

## 🎮 Interactive Component Playground

Experience the power of Zurto UI with live, editable examples. Change the code and see results instantly!

### Featured Example: Modern Dashboard Card

<ComponentPreview 
  title="Newsletter Signup Form with Glassmorphism"
  code="<ZCard padding='lg' glassEffect style={{ maxWidth: '420px', margin: '0 auto' }}><div style={{ textAlign: 'center', marginBottom: '24px' }}><div style={{ fontSize: '48px', marginBottom: '12px' }}>✉️</div><h3 style={{ margin: '0 0 8px 0' }}>Subscribe to Newsletter</h3><p style={{ color: '#888', margin: 0 }}>Get the latest updates and exclusive content delivered to your inbox.</p></div><ZInput label='Email Address' placeholder='you@example.com' leftIcon='mail' style={{ marginBottom: '12px' }} /><ZCheckbox label='I agree to receive marketing emails' style={{ marginBottom: '16px' }} /><ZButton variant='primary' fullWidth leftIcon='send' size='lg'>Subscribe Now</ZButton><p style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '16px' }}>We respect your privacy. Unsubscribe anytime.</p></ZCard>"
  height="520px"
/>

::: info Try It Yourself!
Click "Edit Code" in any preview to modify the component live. Changes appear instantly - no build step required!
:::

## 🌟 Component Showcase - See What's Possible

Explore our most popular components with interactive examples that demonstrate real-world use cases.

### 🔘 Buttons - Every Style You Need

<ComponentPreview 
  title="Button Variants, Sizes & States"
  code="<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}><div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}><ZButton variant='primary'>Primary</ZButton><ZButton variant='success'>Success</ZButton><ZButton variant='danger'>Danger</ZButton><ZButton variant='warning'>Warning</ZButton><ZButton variant='ghost'>Ghost</ZButton><ZButton variant='outline'>Outline</ZButton></div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}><ZButton size='sm'>Small</ZButton><ZButton size='md'>Medium</ZButton><ZButton size='lg'>Large</ZButton></div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}><ZButton leftIcon='download'>Download</ZButton><ZButton rightIcon='arrow-right'>Next</ZButton><ZButton loading>Loading</ZButton><ZButton disabled>Disabled</ZButton></div></div>"
  height="280px"
/>

### 📝 Forms - Beautiful Inputs Out of the Box

<ComponentPreview 
  title="Input Components with Icons & Validation"
  code="<div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '450px' }}><ZInput label='Username' placeholder='Enter username' leftIcon='user' helperText='Choose a unique username' /><ZInput label='Email' type='email' placeholder='you@example.com' leftIcon='mail' required /><ZInput label='Password' type='password' placeholder='••••••••' leftIcon='lock' rightIcon='eye' /><ZInput label='Search' placeholder='Search anything...' leftIcon='search' /><ZTextarea label='Message' placeholder='Type your message here...' rows={3} /></div>"
  height="520px"
/>

### 💬 Feedback - Keep Users Informed

<ComponentPreview 
  title="Alerts, Badges & Status Indicators"
  code="<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}><ZAlert variant='success' icon='check-circle'>Your changes have been saved successfully!</ZAlert><ZAlert variant='warning' icon='alert-triangle'>Your session will expire in 5 minutes.</ZAlert><ZAlert variant='danger' icon='x-circle'>Failed to connect to the server. Please try again.</ZAlert><ZAlert variant='info' icon='info'>New features have been added. Check out what's new!</ZAlert><div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}><ZBadge variant='success'>Active</ZBadge><ZBadge variant='warning'>Pending</ZBadge><ZBadge variant='danger'>Error</ZBadge><ZBadge variant='info'>New</ZBadge></div></div>"
  height="360px"
/>

## 💎 What Makes Zurto UI Different?

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin: 48px 0;">

<div style="padding: 32px; background: linear-gradient(135deg, rgba(223, 62, 83, 0.1) 0%, rgba(232, 85, 102, 0.05) 100%); border-radius: 16px; border: 1px solid rgba(223, 62, 83, 0.2);">
  <h3 style="margin: 0 0 16px 0; color: #df3e53;">🎨 Design Excellence</h3>
  <p style="color: #aaa; line-height: 1.6;">Every component is crafted with pixel-perfect attention to detail. Our dark theme with glassmorphism effects creates stunning UIs that users love.</p>
</div>

<div style="padding: 32px; background: linear-gradient(135deg, rgba(223, 62, 83, 0.1) 0%, rgba(232, 85, 102, 0.05) 100%); border-radius: 16px; border: 1px solid rgba(223, 62, 83, 0.2);">
  <h3 style="margin: 0 0 16px 0; color: #df3e53;">⚡ Developer Speed</h3>
  <p style="color: #aaa; line-height: 1.6;">Build faster with intuitive APIs, comprehensive TypeScript support, and interactive docs. No more hunting through documentation.</p>
</div>

<div style="padding: 32px; background: linear-gradient(135deg, rgba(223, 62, 83, 0.1) 0%, rgba(232, 85, 102, 0.05) 100%); border-radius: 16px; border: 1px solid rgba(223, 62, 83, 0.2);">
  <h3 style="margin: 0 0 16px 0; color: #df3e53;">🚀 Production Ready</h3>
  <p style="color: #aaa; line-height: 1.6;">Used in production by teams worldwide. Battle-tested, accessible, performant, and maintained with regular updates and bug fixes.</p>
</div>

</div>

## 📚 Comprehensive Documentation

Every component comes with:

- ✅ **Live Interactive Examples** - Edit and preview in real-time
- ✅ **Full API Reference** - Every prop, type, and method documented
- ✅ **Usage Guidelines** - Best practices and common patterns
- ✅ **Accessibility Notes** - WCAG compliance and keyboard navigation
- ✅ **Code Examples** - Real-world use cases with copy-paste code
- ✅ **TypeScript Definitions** - Full type safety and IntelliSense

## 🎯 Ready to Build Something Amazing?

<div style="text-align: center; padding: 64px 24px; background: linear-gradient(135deg, rgba(223, 62, 83, 0.15) 0%, rgba(232, 85, 102, 0.05) 100%); border-radius: 24px; margin: 48px 0;">
  <h2 style="font-size: 36px; margin: 0 0 16px 0;">Start Building Today</h2>
  <p style="font-size: 18px; color: #aaa; margin: 0 0 32px 0; max-width: 600px; margin-left: auto; margin-right: auto;">
    Join thousands of developers who trust Zurto UI to build beautiful, accessible, and performant React applications.
  </p>
  <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
    <a href="/guide/getting-started" style="display: inline-block; padding: 16px 32px; background: #df3e53; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; transition: all 0.2s;">
      Get Started →
    </a>
    <a href="/components/" style="display: inline-block; padding: 16px 32px; background: rgba(255,255,255,0.1); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; border: 1px solid rgba(255,255,255,0.2); transition: all 0.2s;">
      Browse Components
    </a>
    <a href="https://github.com/zurto/zurto-ui" style="display: inline-block; padding: 16px 32px; background: rgba(255,255,255,0.05); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s;">
      ⭐ Star on GitHub
    </a>
  </div>
</div>

---

<div style="text-align: center; padding: 32px 0; color: #666;">
  <p>Have questions or need help? Join our <a href="https://discord.gg/zurto" style="color: #df3e53;">Discord community</a> or <a href="https://github.com/zurto/zurto-ui/issues" style="color: #df3e53;">open an issue</a> on GitHub.</p>
  <p style="margin-top: 16px;">Made with ❤️ by the Zurto team</p>
</div>
