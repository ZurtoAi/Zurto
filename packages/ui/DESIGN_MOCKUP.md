# zurto-ui Documentation Redesign - Visual Mockup

> **Inspiration**: Mantine UI (https://ui.mantine.dev/)  
> **Theme**: zurto dark theme (#1a1a1a background, #df3e53 accent)  
> **Goal**: Interactive component previews for all 42+ components

---

## 🎨 Color Palette

```
Primary Background:   #0a0a0a (darker than current)
Secondary Background: #1a1a1a (cards, panels)
Tertiary Background:  #242424 (hover states)
Border:               rgba(255, 255, 255, 0.1)
Text Primary:         #ffffff
Text Secondary:       rgba(255, 255, 255, 0.7)
Accent:               #df3e53 (zurto red)
Accent Hover:         #e85566
Success:              #51cf66
Warning:              #ffd43b
Code Background:      #1e1e1e
```

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER (Fixed, 60px height)                                        │
│  ┌──────────┬─────────────────────────┬──────────────────────┐     │
│  │ @zurto/ui│ Components  Guide  API  │  🔍 Search  🌙 GitHub│     │
│  └──────────┴─────────────────────────┴──────────────────────┘     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────┬───────────────────────────────────────┬──────────┐   │
│  │         │                                       │          │   │
│  │ SIDEBAR │         MAIN CONTENT AREA             │  TABLE   │   │
│  │ (260px) │                                       │    OF    │   │
│  │         │                                       │ CONTENTS │   │
│  │ Fixed   │          Scrollable                  │  (220px) │   │
│  │ Scroll  │                                       │          │   │
│  │         │                                       │  Fixed   │   │
│  │         │                                       │  Scroll  │   │
│  │         │                                       │          │   │
│  └─────────┴───────────────────────────────────────┴──────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🏠 Home Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HERO SECTION                                │
│  ╔═══════════════════════════════════════════════════════════════╗  │
│  ║                                                               ║  │
│  ║         @zurto/ui                                            ║  │
│  ║         Production-Ready React Components                    ║  │
│  ║                                                               ║  │
│  ║         [Get Started]  [View Components]  [GitHub]           ║  │
│  ║                                                               ║  │
│  ╚═══════════════════════════════════════════════════════════════╝  │
│                                                                     │
│                    INTERACTIVE DEMO SECTION                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │   │
│  │  │ LIVE BUTTON  │  │ LIVE INPUT   │  │  LIVE CARD   │      │   │
│  │  │   PREVIEW    │  │   PREVIEW    │  │   PREVIEW    │      │   │
│  │  │              │  │              │  │              │      │   │
│  │  │ [Click Me]   │  │ [Type here]  │  │  Content...  │      │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                      FEATURE HIGHLIGHTS                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ 🎨 150+   │  │ 🌙 Dark  │  │ ⚡ Fast  │  │ ♿ A11y  │          │
│  │Components│  │  Theme   │  │  & Light │  │ WCAG 2.1 │          │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │
│                                                                     │
│                     COMPONENT CATEGORIES                            │
│  ┌─────────────────────┐  ┌─────────────────────┐                 │
│  │ 📐 Layout (16)      │  │ 📝 Form (26)        │                 │
│  │                     │  │                     │                 │
│  │ [ZBox] [ZCard]      │  │ [ZInput] [ZSelect]  │                 │
│  │ [ZGrid] [ZStack]    │  │ [ZCheckbox] [...]   │                 │
│  └─────────────────────┘  └─────────────────────┘                 │
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────┐                 │
│  │ 🔘 Button (13)      │  │ 💬 Feedback (18)    │                 │
│  │ [...preview...]     │  │ [...preview...]     │                 │
│  └─────────────────────┘  └─────────────────────┘                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📄 Component Page Layout (e.g., /components/button/ZButton)

```
┌─────────────────────────────────────────────────────────────────────┐
│  SIDEBAR          │         MAIN CONTENT              │   TABLE OF  │
│                   │                                   │  CONTENTS   │
│  📦 Components    │  ┌─ Breadcrumb ─────────────┐    │             │
│  ├─ Layout        │  │ Components > Button > ZButton │    │  ┌─────────┐
│  ├─ Form          │  └──────────────────────────────┘    │  │• Usage  │
│  ├─ Button ▼      │                                       │  │• Props  │
│  │  ├ Overview    │  # ZButton                            │  │• Variants│
│  │  ├ ZButton ◄   │  Primary action button component      │  │• Sizes  │
│  │  ├ ZIconButton │                                       │  │• Examples│
│  │  └ ...         │  ┌─────────────────────────────────┐ │  │• API    │
│  ├─ Feedback      │  │     INTERACTIVE PREVIEW         │ │  └─────────┘
│  └─ ...           │  │  ╔═══════════════════════════╗  │ │             │
│                   │  │  ║                           ║  │ │             │
│                   │  │  ║   [Default Button]        ║  │ │             │
│                   │  │  ║   [Primary Button]        ║  │ │             │
│                   │  │  ║   [Outline Button]        ║  │ │             │
│                   │  │  ║                           ║  │ │             │
│                   │  │  ╚═══════════════════════════╝  │ │             │
│                   │  │                                 │ │             │
│                   │  │  [Tabs: Preview | Code | React]│ │             │
│                   │  └─────────────────────────────────┘ │             │
│                   │                                       │             │
│                   │  ## Variants                          │             │
│                   │                                       │             │
│                   │  ┌─────────────────────────────────┐ │             │
│                   │  │     VARIANT SHOWCASE            │ │             │
│                   │  │  [Primary] [Secondary] [Ghost]  │ │             │
│                   │  │  [Danger] [Success] [Warning]   │ │             │
│                   │  │  < Show Code >                  │ │             │
│                   │  └─────────────────────────────────┘ │             │
│                   │                                       │             │
│                   │  ## Sizes                             │             │
│                   │                                       │             │
│                   │  ┌─────────────────────────────────┐ │             │
│                   │  │     SIZE SHOWCASE               │ │             │
│                   │  │  [xs] [sm] [md] [lg] [xl]       │ │             │
│                   │  │  < Show Code >                  │ │             │
│                   │  └─────────────────────────────────┘ │             │
│                   │                                       │             │
│                   │  ## Props                             │             │
│                   │                                       │             │
│                   │  ┌─────────────────────────────────┐ │             │
│                   │  │ Property | Type     | Default   │ │             │
│                   │  ├──────────┼──────────┼───────────┤ │             │
│                   │  │ variant  | string   | "default" │ │             │
│                   │  │ size     | string   | "md"      │ │             │
│                   │  │ disabled | boolean  | false     │ │             │
│                   │  └─────────────────────────────────┘ │             │
│                   │                                       │             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎭 Interactive Preview Component Design

### Preview Container Style:

````
┌─────────────────────────────────────────────────────────────────┐
│ [📱 Responsive Toggle]  [🎨 Theme: Dark ▼]  [📋 Copy Code]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    LIVE COMPONENT AREA                          │
│  ╔═══════════════════════════════════════════════════════════╗ │
│  ║  Background: rgba(255,255,255,0.02)                       ║ │
│  ║  Border: 1px solid rgba(255,255,255,0.1)                  ║ │
│  ║  Padding: 40px                                            ║ │
│  ║  Border-radius: 8px                                       ║ │
│  ║                                                            ║ │
│  ║              [Interactive Component Here]                 ║ │
│  ║                                                            ║ │
│  ╚═══════════════════════════════════════════════════════════╝ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [Tabs]                                                          │
│  • Preview (Active)  • Code  • Props                           │
│                                                                 │
│  ```tsx                                                         │
│  import { ZButton } from '@zurto/ui';                          │
│                                                                 │
│  export default function Demo() {                              │
│    return <ZButton variant="primary">Click me</ZButton>;      │
│  }                                                              │
│  ```                                                            │
└─────────────────────────────────────────────────────────────────┘
````

---

## 🗂️ Category Overview Page (e.g., /components/button/)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  # Button Components                                                │
│  13 components for user interactions and actions                   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    FEATURED PREVIEW                          │  │
│  │  ╔════════════════════════════════════════════════════════╗  │  │
│  │  ║  [Default]  [Primary]  [Danger]  [Success]  [Ghost]   ║  │  │
│  │  ║                                                         ║  │  │
│  │  ║  [Icon ❤]  [Copy 📋]  [Download ⬇]  [Share 🔗]       ║  │  │
│  │  ╚════════════════════════════════════════════════════════╝  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ## All Button Components                                          │
│                                                                     │
│  ┌──────────────────────┬──────────────────────┬────────────────┐  │
│  │ ZButton              │ ZIconButton          │ ZButtonGroup   │  │
│  │ ┌──────────────────┐ │ ┌──────────────────┐ │ ┌────────────┐ │  │
│  │ │ Mini Preview:    │ │ │ Mini Preview:    │ │ │ Preview:   │ │  │
│  │ │ [Click Me] ───►  │ │ │ [❤] [✓] [✕] ──► │ │ │ [①②③] ──► │ │  │
│  │ └──────────────────┘ │ └──────────────────┘ │ └────────────┘ │  │
│  │ Primary action btn   │ Icon-only buttons    │ Grouped btns   │  │
│  │ [View Docs →]        │ [View Docs →]        │ [View Docs →]  │  │
│  └──────────────────────┴──────────────────────┴────────────────┘  │
│                                                                     │
│  ┌──────────────────────┬──────────────────────┬────────────────┐  │
│  │ ZCopyButton          │ ZShareButton         │ ZLikeButton    │  │
│  │ [Mini Preview]       │ [Mini Preview]       │ [Mini Preview] │  │
│  │ Copy to clipboard    │ Share content        │ Like/favorite  │  │
│  │ [View Docs →]        │ [View Docs →]        │ [View Docs →]  │  │
│  └──────────────────────┴──────────────────────┴────────────────┘  │
│                                                                     │
│  [...continues for all 13 button components...]                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Card Design (Used in Category Pages)

```
┌─────────────────────────────────────┐
│  ZButton                            │
├─────────────────────────────────────┤
│  ╔═══════════════════════════════╗  │
│  ║    MINI LIVE PREVIEW          ║  │
│  ║                               ║  │
│  ║    [Click Me]  [Primary]     ║  │
│  ║                               ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
│  Primary action button with         │
│  multiple variants and sizes        │
│                                     │
│  Props: 12 • Examples: 8            │
│                                     │
│  [View Documentation →]             │
└─────────────────────────────────────┘

Hover Effect:
- Border changes to #df3e53
- Slight elevation (box-shadow)
- Arrow animates →
```

---

## 🔍 Search Overlay Design

```
┌─────────────────────────────────────────────────────────────────┐
│                     [Press Ctrl+K to search]                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🔍  Search components, guides, and API...              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Quick Access                                                   │
│  ──────────────────────────────────────────────────────────    │
│  📐 Layout Components                                           │
│  📝 Form Components                                             │
│  🔘 Button Components                                           │
│                                                                 │
│  Recent                                                         │
│  ──────────────────────────────────────────────────────────    │
│  🟢 ZButton - Primary action button                             │
│  🟢 ZInput - Text input field                                   │
│  🟢 ZCard - Content container                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Behavior

### Desktop (>1200px):

- Sidebar: 260px (fixed)
- Main content: Flex
- Table of Contents: 220px (fixed)

### Tablet (768px - 1200px):

- Sidebar: Collapsible drawer
- Main content: Full width
- Table of Contents: Hidden (moved to component top)

### Mobile (<768px):

- Hamburger menu for navigation
- Full-width content
- Preview components stack vertically
- Code examples have horizontal scroll

---

## 🎯 Key Features to Implement

### 1. **Interactive Preview System**

- Every component has a live, interactive preview
- Toggleable code view (React/HTML)
- Copy code button
- Responsive preview toggle
- Props playground (for complex components)

### 2. **Component Documentation Structure**

```
1. Component Title & Description
2. Interactive Preview (main demo)
3. Variants Section (with previews)
4. Sizes Section (with previews)
5. Props Table (searchable)
6. Usage Examples (with code)
7. Accessibility Notes
8. Related Components
```

### 3. **Category Pages**

- Hero section with combined preview
- Grid of component cards with mini previews
- Quick filter/search
- Sort by: Name, Recently Added, Most Used

### 4. **Home Page**

- Hero with live component demos
- Feature highlights
- Quick start code snippet
- Category overview with visual icons
- "What's New" section

### 5. **Navigation Improvements**

- Collapsible sidebar sections
- Active component highlighting
- Breadcrumb navigation
- Next/Previous component buttons

---

## 🎨 Theme-Specific Styling

### zurto Dark Theme Customization:

```css
/* Glass effect cards */
.preview-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

/* Accent color on interactive elements */
.component-preview:hover {
  border-color: #df3e53;
  box-shadow: 0 0 20px rgba(223, 62, 83, 0.2);
}

/* Code blocks */
.code-block {
  background: #1e1e1e;
  border-left: 3px solid #df3e53;
}

/* Gradient text for headings */
h1.component-title {
  background: linear-gradient(135deg, #df3e53, #e85566);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 📊 Comparison: Before vs. After

### Before (Current):

- Static component list
- Text-based descriptions
- Minimal visual examples
- Basic category pages
- Simple navigation

### After (Proposed):

- ✅ Interactive previews for ALL 42+ components
- ✅ Live code playground
- ✅ Visual component cards
- ✅ Rich category showcases
- ✅ Enhanced search with previews
- ✅ Mantine-inspired layout
- ✅ Maintained zurto dark theme
- ✅ Responsive design
- ✅ Improved navigation UX

---

## 🚀 Implementation Plan

### Phase 1: Layout & Structure (3-4 hours)

- [ ] Redesign VitePress theme
- [ ] Implement 3-column layout (sidebar/main/TOC)
- [ ] Create header component
- [ ] Build responsive navigation

### Phase 2: Preview System (4-5 hours)

- [ ] Build `<Preview>` component wrapper
- [ ] Create code syntax highlighting
- [ ] Add copy-to-clipboard functionality
- [ ] Implement tab switching (Preview/Code/Props)
- [ ] Make previews interactive

### Phase 3: Component Pages (6-8 hours)

- [ ] Create standardized component page template
- [ ] Add live previews to all 42+ components
- [ ] Build props table generator
- [ ] Create variant showcases
- [ ] Add usage examples

### Phase 4: Category & Home Pages (3-4 hours)

- [ ] Redesign home page with live demos
- [ ] Build category overview pages
- [ ] Create component cards with mini previews
- [ ] Add category hero sections

### Phase 5: Polish & Features (2-3 hours)

- [ ] Implement enhanced search
- [ ] Add dark theme toggle
- [ ] Optimize performance
- [ ] Test responsive behavior
- [ ] Add loading states

**Total Estimated Time**: 18-24 hours

---

## ✅ Approval Checklist

Please review and confirm:

- [ ] **Layout structure**: 3-column layout with fixed sidebar/TOC
- [ ] **Preview system**: Interactive component demos with code tabs
- [ ] **Theme**: Dark theme (#0a0a0a, #df3e53 accent) maintained
- [ ] **Category pages**: Visual grid with mini previews
- [ ] **Component pages**: Full interactive previews + variants + props
- [ ] **Home page**: Hero with live demos + feature cards
- [ ] **Responsive**: Mobile-friendly collapsible navigation
- [ ] **Overall style**: Mantine-inspired but zurto-branded

---

## 🔄 Alternative Options (If You Want Changes)

### Option A: "More Minimal"

- Single-column layout (no right TOC sidebar)
- Inline code examples (no tabs)
- Simpler component cards

### Option B: "More Interactive"

- Props playground with live editing
- Component composition builder
- Real-time theme customization
- AI-powered search

### Option C: "Hybrid"

- Keep current simple structure
- Add only interactive previews
- Minimal layout changes

---

## 📝 Notes

1. All interactive previews will be **real React components**, not screenshots
2. Code examples will be **copyable** with syntax highlighting
3. Navigation will be **searchable** and **filterable**
4. Each component will have **multiple examples** showing different use cases
5. Props documentation will be **auto-generated** from TypeScript definitions
6. The design system maintains **zurto's brand identity** throughout

---

**Next Steps**: Please review this mockup and let me know:

1. Do you approve this design direction?
2. Any specific changes or additions you want?
3. Should I proceed with implementation?

Once approved, I'll start building the new documentation system! 🚀

---

## 🎨 MVP Component Previews

### ZHeader

#### Preview 1: Basic Header

```jsx
import React, { useState } from "react";

export default function BasicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      style={{
        height: "200px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#df3e53",
          }}
        >
          @zurto/ui
        </div>
        <nav
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "center",
          }}
        >
          <a
            href="#"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textDecoration: "none",
              fontSize: "14px",
              transition: "color 0.2s",
            }}
          >
            Components
          </a>
          <a
            href="#"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textDecoration: "none",
              fontSize: "14px",
              transition: "color 0.2s",
            }}
          >
            Guide
          </a>
          <a
            href="#"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textDecoration: "none",
              fontSize: "14px",
              transition: "color 0.2s",
            }}
          >
            API
          </a>
        </nav>
      </header>
    </div>
  );
}
```

#### Preview 2: Practical Header with Search & Actions

```jsx
import React, { useState } from "react";

export default function PracticalHeader() {
  const [searchValue, setSearchValue] = useState("");
  const [notificationCount, setNotificationCount] = useState(3);

  return (
    <div
      style={{
        height: "250px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Logo & Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#df3e53",
            }}
          >
            zurto
          </div>
          <nav
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <a
              href="#"
              style={{
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Dashboard
            </a>
            <a
              href="#"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Projects
            </a>
            <a
              href="#"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Team
            </a>
          </nav>
        </div>

        {/* Search & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              padding: "8px 12px",
              backgroundColor: "#242424",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "6px",
              color: "#ffffff",
              fontSize: "14px",
              outline: "none",
              width: "200px",
            }}
          />
          <button
            onClick={() => setNotificationCount(0)}
            style={{
              position: "relative",
              padding: "8px 12px",
              backgroundColor: "#242424",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "6px",
              color: "rgba(255, 255, 255, 0.7)",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            🔔
            {notificationCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  backgroundColor: "#df3e53",
                  color: "#ffffff",
                  borderRadius: "10px",
                  padding: "2px 6px",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                {notificationCount}
              </span>
            )}
          </button>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#df3e53",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            U
          </div>
        </div>
      </header>
    </div>
  );
}
```

---

### ZFooter

#### Preview 1: Basic Footer

```jsx
import React from "react";

export default function BasicFooter() {
  return (
    <div
      style={{
        height: "200px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <footer
        style={{
          width: "100%",
          padding: "20px",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "16px",
          }}
        >
          <a
            href="#"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            About
          </a>
          <a
            href="#"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Documentation
          </a>
          <a
            href="#"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            GitHub
          </a>
        </div>
        <div
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "12px",
          }}
        >
          © 2025 zurto. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
```

#### Preview 2: Practical Footer with Columns

```jsx
import React, { useState } from "react";

export default function PracticalFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div
      style={{
        height: "300px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <footer
        style={{
          width: "100%",
          padding: "32px 24px",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "32px",
            marginBottom: "24px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#df3e53",
                marginBottom: "12px",
              }}
            >
              zurto
            </div>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              Modern React components for building amazing apps.
            </p>
          </div>

          {/* Product */}
          <div>
            <div
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              Product
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <a
                href="#"
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  textDecoration: "none",
                  fontSize: "13px",
                }}
              >
                Components
              </a>
              <a
                href="#"
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  textDecoration: "none",
                  fontSize: "13px",
                }}
              >
                Pricing
              </a>
              <a
                href="#"
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  textDecoration: "none",
                  fontSize: "13px",
                }}
              >
                Changelog
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <div
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              Resources
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <a
                href="#"
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  textDecoration: "none",
                  fontSize: "13px",
                }}
              >
                Docs
              </a>
              <a
                href="#"
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  textDecoration: "none",
                  fontSize: "13px",
                }}
              >
                GitHub
              </a>
              <a
                href="#"
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  textDecoration: "none",
                  fontSize: "13px",
                }}
              >
                Support
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              Newsletter
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribed}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  backgroundColor: "#242424",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "6px",
                  color: "#ffffff",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <button
                onClick={handleSubscribe}
                disabled={subscribed}
                style={{
                  padding: "8px 16px",
                  backgroundColor: subscribed ? "#51cf66" : "#df3e53",
                  border: "none",
                  borderRadius: "6px",
                  color: "#ffffff",
                  fontSize: "13px",
                  cursor: subscribed ? "default" : "pointer",
                  fontWeight: "600",
                }}
              >
                {subscribed ? "✓" : "Join"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "12px",
            }}
          >
            © 2025 zurto. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <a
              href="#"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                textDecoration: "none",
                fontSize: "12px",
              }}
            >
              Privacy
            </a>
            <a
              href="#"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                textDecoration: "none",
                fontSize: "12px",
              }}
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

---

### ZAppShell

#### Preview 1: Basic App Shell

```jsx
import React, { useState } from "react";

export default function BasicAppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      style={{
        height: "300px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "12px 16px",
          backgroundColor: "#1a1a1a",
          borderRadius: "6px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: "6px 10px",
              backgroundColor: "#242424",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ☰
          </button>
          <span
            style={{
              color: "#df3e53",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            App
          </span>
        </div>
        <div
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "13px",
          }}
        >
          User
        </div>
      </header>

      {/* Main Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "8px",
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        {sidebarOpen && (
          <aside
            style={{
              width: "180px",
              backgroundColor: "#1a1a1a",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: "#df3e53",
                borderRadius: "4px",
                color: "#ffffff",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Dashboard
            </div>
            <div
              style={{
                padding: "8px 12px",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Projects
            </div>
            <div
              style={{
                padding: "8px 12px",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Settings
            </div>
          </aside>
        )}

        {/* Content */}
        <main
          style={{
            flex: 1,
            backgroundColor: "#1a1a1a",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "13px",
          }}
        >
          Main content area
        </main>
      </div>
    </div>
  );
}
```

#### Preview 2: Practical App Shell with Nested Layout

```jsx
import React, { useState } from "react";

export default function PracticalAppShell() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      style={{
        height: "300px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          padding: "10px 16px",
          backgroundColor: "#1a1a1a",
          borderRadius: "6px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span
            style={{
              color: "#df3e53",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            zurto
          </span>
          <input
            type="text"
            placeholder="Search..."
            style={{
              padding: "6px 10px",
              backgroundColor: "#242424",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
              color: "#ffffff",
              fontSize: "12px",
              outline: "none",
              width: "140px",
            }}
          />
        </div>
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#df3e53",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: "bold",
          }}
        >
          A
        </div>
      </header>

      {/* Main Layout */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "8px",
          overflow: "hidden",
        }}
      >
        {/* Left Sidebar */}
        <aside
          style={{
            width: sidebarCollapsed ? "48px" : "160px",
            backgroundColor: "#1a1a1a",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            transition: "width 0.2s",
          }}
        >
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              padding: "6px",
              backgroundColor: "#242424",
              border: "none",
              borderRadius: "4px",
              color: "rgba(255, 255, 255, 0.7)",
              cursor: "pointer",
              fontSize: "12px",
              marginBottom: "4px",
            }}
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
          <div
            style={{
              padding: "8px",
              backgroundColor: "#df3e53",
              borderRadius: "4px",
              color: "#ffffff",
              fontSize: "12px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            {sidebarCollapsed ? "🏠" : "🏠 Home"}
          </div>
          <div
            style={{
              padding: "8px",
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "12px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            {sidebarCollapsed ? "📊" : "📊 Stats"}
          </div>
          <div
            style={{
              padding: "8px",
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "12px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            {sidebarCollapsed ? "⚙️" : "⚙️ Config"}
          </div>
        </aside>

        {/* Main Content Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              backgroundColor: "#1a1a1a",
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {["overview", "details", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  backgroundColor:
                    activeTab === tab ? "#df3e53" : "transparent",
                  border: "none",
                  borderRadius: "4px",
                  color:
                    activeTab === tab ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: activeTab === tab ? "600" : "400",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <main
            style={{
              flex: 1,
              backgroundColor: "#1a1a1a",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "16px",
              overflow: "auto",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </div>
            <div
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "12px",
                lineHeight: "1.6",
              }}
            >
              Content for {activeTab} tab. This area can contain forms, tables,
              charts, or any other content.
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
```

---

### ZLoadingOverlay

#### Preview 1: Basic Loading Overlay

```jsx
import React, { useState } from "react";

export default function BasicLoadingOverlay() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      style={{
        height: "250px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <button
        onClick={() => setIsLoading(!isLoading)}
        style={{
          padding: "8px 16px",
          backgroundColor: "#df3e53",
          color: "#ffffff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "500",
        }}
      >
        Toggle Loading
      </button>

      <div
        style={{
          position: "relative",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "24px",
          minHeight: "150px",
        }}
      >
        <div style={{ color: "#ffffff", fontSize: "14px" }}>Content Area</div>
        <div
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "12px",
            marginTop: "8px",
          }}
        >
          This content will be covered by the overlay when loading.
        </div>

        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(10, 10, 10, 0.85)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(2px)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(255, 255, 255, 0.1)",
                borderTop: "3px solid #df3e53",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
```

#### Preview 2: Practical Loading with Message

```jsx
import React, { useState, useEffect } from "react";

export default function PracticalLoadingOverlay() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleLoad = () => {
    setIsLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div
      style={{
        height: "280px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <button
        onClick={handleLoad}
        disabled={isLoading}
        style={{
          padding: "8px 16px",
          backgroundColor: isLoading ? "#666666" : "#df3e53",
          color: "#ffffff",
          border: "none",
          borderRadius: "6px",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontSize: "13px",
          fontWeight: "500",
        }}
      >
        {isLoading ? "Loading..." : "Start Loading"}
      </button>

      <div
        style={{
          position: "relative",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "24px",
          minHeight: "180px",
        }}
      >
        <div style={{ color: "#ffffff", fontSize: "14px", fontWeight: "600" }}>
          Dashboard Content
        </div>
        <div
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "12px",
            marginTop: "8px",
          }}
        >
          Loading data from server...
        </div>

        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(10, 10, 10, 0.9)",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "4px solid rgba(255, 255, 255, 0.1)",
                borderTop: "4px solid #df3e53",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <div
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Loading data...
            </div>
            <div
              style={{
                width: "200px",
                height: "4px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "#df3e53",
                  transition: "width 0.2s",
                }}
              />
            </div>
            <div
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: "12px",
              }}
            >
              {progress}%
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
```

---

### ZNotification

#### Preview 1: Basic Notification

```jsx
import React, { useState } from "react";

export default function BasicNotification() {
  const [show, setShow] = useState(true);

  return (
    <div
      style={{
        height: "250px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <button
        onClick={() => setShow(!show)}
        style={{
          padding: "8px 16px",
          backgroundColor: "#df3e53",
          color: "#ffffff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "500",
        }}
      >
        {show ? "Hide" : "Show"} Notification
      </button>

      {show && (
        <div
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderLeft: "4px solid #df3e53",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              lineHeight: "1",
            }}
          >
            ℹ️
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "4px",
              }}
            >
              Notification Title
            </div>
            <div
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              This is a basic notification message.
            </div>
          </div>
          <button
            onClick={() => setShow(false)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255, 255, 255, 0.5)",
              cursor: "pointer",
              fontSize: "16px",
              padding: "0",
              lineHeight: "1",
            }}
          >
            ✕
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
```

#### Preview 2: Practical Notification Types

```jsx
import React, { useState } from "react";

export default function PracticalNotification() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Success!",
      message: "Your changes have been saved.",
      icon: "✓",
    },
    {
      id: 2,
      type: "error",
      title: "Error",
      message: "Failed to process request.",
      icon: "✕",
    },
    {
      id: 3,
      type: "warning",
      title: "Warning",
      message: "Storage is almost full.",
      icon: "⚠",
    },
  ]);

  const colors = {
    success: "#51cf66",
    error: "#df3e53",
    warning: "#ffd43b",
    info: "#339af0",
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div
      style={{
        height: "300px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          width: "280px",
          maxWidth: "100%",
        }}
      >
        {notifications.map((notif) => (
          <div
            key={notif.id}
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderLeft: `4px solid ${colors[notif.type]}`,
              borderRadius: "8px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              animation: "slideIn 0.3s ease-out",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: colors[notif.type],
                color: notif.type === "warning" ? "#000000" : "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              {notif.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "2px",
                }}
              >
                {notif.title}
              </div>
              <div
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "12px",
                  lineHeight: "1.4",
                }}
              >
                {notif.message}
              </div>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255, 255, 255, 0.5)",
                cursor: "pointer",
                fontSize: "14px",
                padding: "0",
                lineHeight: "1",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
```

---

### ZTooltip

#### Preview 1: Basic Tooltip

```jsx
import React, { useState } from "react";

export default function BasicTooltip() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      style={{
        height: "200px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#df3e53",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          Hover me
        </button>

        {showTooltip && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#1a1a1a",
              color: "#ffffff",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              animation: "fadeIn 0.2s ease-out",
              zIndex: 1000,
            }}
          >
            This is a tooltip
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid #1a1a1a",
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
```

#### Preview 2: Practical Tooltip Positions

```jsx
import React, { useState } from "react";

export default function PracticalTooltip() {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const tooltips = [
    { id: "top", label: "Top", position: "top", text: "Tooltip on top" },
    {
      id: "right",
      label: "Right",
      position: "right",
      text: "Tooltip on right",
    },
    {
      id: "bottom",
      label: "Bottom",
      position: "bottom",
      text: "Tooltip on bottom",
    },
    { id: "left", label: "Left", position: "left", text: "Tooltip on left" },
  ];

  const getTooltipStyle = (position) => {
    const base = {
      position: "absolute",
      backgroundColor: "#1a1a1a",
      color: "#ffffff",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      whiteSpace: "nowrap",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      zIndex: 1000,
    };

    const positions = {
      top: {
        bottom: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
      },
      bottom: {
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
      },
      left: {
        right: "calc(100% + 8px)",
        top: "50%",
        transform: "translateY(-50%)",
      },
      right: {
        left: "calc(100% + 8px)",
        top: "50%",
        transform: "translateY(-50%)",
      },
    };

    return { ...base, ...positions[position] };
  };

  return (
    <div
      style={{
        height: "250px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
        }}
      >
        {tooltips.map((tooltip) => (
          <div
            key={tooltip.id}
            style={{ position: "relative", display: "inline-block" }}
          >
            <button
              onMouseEnter={() => setActiveTooltip(tooltip.id)}
              onMouseLeave={() => setActiveTooltip(null)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#242424",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              {tooltip.label}
            </button>

            {activeTooltip === tooltip.id && (
              <div style={getTooltipStyle(tooltip.position)}>
                {tooltip.text}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### ZPopover

#### Preview 1: Basic Popover

```jsx
import React, { useState } from "react";

export default function BasicPopover() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        height: "250px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#df3e53",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          {isOpen ? "Close" : "Open"} Popover
        </button>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "16px",
              width: "220px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
              animation: "popIn 0.2s ease-out",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Popover Title
            </div>
            <div
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "12px",
                lineHeight: "1.5",
              }}
            >
              This is a basic popover with some content inside.
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
```

#### Preview 2: Practical Popover with Actions

```jsx
import React, { useState } from "react";

export default function PracticalPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div
      style={{
        height: "280px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      {selectedOption && (
        <div
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "12px",
          }}
        >
          Selected:{" "}
          <span style={{ color: "#df3e53", fontWeight: "600" }}>
            {selectedOption}
          </span>
        </div>
      )}

      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#242424",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          Options
          <span style={{ fontSize: "10px" }}>▼</span>
        </button>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "8px",
              width: "200px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
              animation: "popIn 0.2s ease-out",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: "11px",
                fontWeight: "600",
                textTransform: "uppercase",
                padding: "8px 12px",
                letterSpacing: "0.5px",
              }}
            >
              Actions
            </div>
            {["Edit Profile", "Settings", "Notifications", "Sign Out"].map(
              (option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "6px",
                    color: "#ffffff",
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#242424")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  {option}
                </button>
              )
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
```

---

### ZBanner

#### Preview 1: Basic Banner

```jsx
import React, { useState } from "react";

export default function BasicBanner() {
  const [show, setShow] = useState(true);

  if (!show)
    return (
      <div
        style={{
          height: "200px",
          backgroundColor: "#0a0a0a",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => setShow(true)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#df3e53",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          Show Banner
        </button>
      </div>
    );

  return (
    <div
      style={{
        height: "200px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          backgroundColor: "#df3e53",
          padding: "12px 16px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          animation: "slideDown 0.3s ease-out",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          🎉 New features available! Check out what's new in v2.0
        </div>
        <button
          onClick={() => setShow(false)}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255, 255, 255, 0.9)",
            cursor: "pointer",
            fontSize: "16px",
            padding: "0",
            lineHeight: "1",
          }}
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
```

#### Preview 2: Practical Banner Types

```jsx
import React, { useState } from "react";

export default function PracticalBanner() {
  const [banners, setBanners] = useState([
    {
      id: 1,
      type: "info",
      message: "System maintenance scheduled for tonight at 11 PM EST.",
      icon: "ℹ️",
    },
    {
      id: 2,
      type: "warning",
      message:
        "Your subscription expires in 3 days. Renew now to avoid interruption.",
      icon: "⚠️",
    },
    {
      id: 3,
      type: "success",
      message: "Successfully deployed to production! All systems operational.",
      icon: "✓",
    },
  ]);

  const colors = {
    info: { bg: "#339af0", text: "#ffffff" },
    warning: { bg: "#ffd43b", text: "#000000" },
    success: { bg: "#51cf66", text: "#ffffff" },
    error: { bg: "#df3e53", text: "#ffffff" },
  };

  const removeBanner = (id) => {
    setBanners(banners.filter((b) => b.id !== id));
  };

  return (
    <div
      style={{
        height: "300px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {banners.map((banner) => (
        <div
          key={banner.id}
          style={{
            backgroundColor: colors[banner.type].bg,
            padding: "12px 16px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            animation: "slideDown 0.3s ease-out",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              lineHeight: "1",
            }}
          >
            {banner.icon}
          </span>
          <div
            style={{
              flex: 1,
              color: colors[banner.type].text,
              fontSize: "13px",
              fontWeight: "500",
              lineHeight: "1.4",
            }}
          >
            {banner.message}
          </div>
          <button
            onClick={() => removeBanner(banner.id)}
            style={{
              background: "none",
              border: "none",
              color: colors[banner.type].text,
              opacity: 0.8,
              cursor: "pointer",
              fontSize: "16px",
              padding: "0",
              lineHeight: "1",
            }}
          >
            ✕
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
```

---

### ZConfirm

#### Preview 1: Basic Confirm Dialog

```jsx
import React, { useState } from "react";

export default function BasicConfirm() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState(null);

  const handleConfirm = () => {
    setResult("Confirmed");
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setResult("Cancelled");
    setShowConfirm(false);
  };

  return (
    <div
      style={{
        height: "280px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <button
        onClick={() => {
          setShowConfirm(true);
          setResult(null);
        }}
        style={{
          padding: "8px 16px",
          backgroundColor: "#df3e53",
          color: "#ffffff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "500",
        }}
      >
        Show Confirm
      </button>

      {result && (
        <div
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "12px",
          }}
        >
          Result:{" "}
          <span style={{ color: "#51cf66", fontWeight: "600" }}>{result}</span>
        </div>
      )}

      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.2s ease-out",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "24px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              animation: "scaleIn 0.2s ease-out",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              Confirm Action
            </div>
            <div
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "13px",
                lineHeight: "1.5",
                marginBottom: "24px",
              }}
            >
              Are you sure you want to proceed with this action?
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleCancel}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#242424",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#df3e53",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
```

---

## ZBarChart

### Preview 1: Basic Bar Chart

```jsx
import React from "react";

export default function BasicBarChart() {
  const data = [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 68 },
    { label: "Mar", value: 52 },
    { label: "Apr", value: 78 },
    { label: "May", value: 85 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));
  const chartHeight = 200;
  const barWidth = 40;
  const gap = 20;

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#0a0a0a",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        width: "300px",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "16px",
        }}
      >
        Monthly Sales
      </div>

      <svg
        width="260"
        height={chartHeight + 30}
        style={{ overflow: "visible" }}
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = index * (barWidth + gap);
          const y = chartHeight - barHeight;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#df3e53"
                rx="4"
                style={{ transition: "all 0.3s ease" }}
              />
              <text
                x={x + barWidth / 2}
                y={y - 8}
                fill="rgba(255, 255, 255, 0.9)"
                fontSize="12"
                fontWeight="600"
                textAnchor="middle"
              >
                {item.value}
              </text>
              <text
                x={x + barWidth / 2}
                y={chartHeight + 20}
                fill="rgba(255, 255, 255, 0.5)"
                fontSize="11"
                textAnchor="middle"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
```

### Preview 2: Comparison Bar Chart

```jsx
import React from "react";

export default function ComparisonBarChart() {
  const data = [
    { label: "Q1", current: 65, previous: 52 },
    { label: "Q2", current: 78, previous: 61 },
    { label: "Q3", current: 82, previous: 75 },
    { label: "Q4", current: 91, previous: 80 },
  ];

  const maxValue = Math.max(...data.flatMap((d) => [d.current, d.previous]));
  const chartHeight = 200;
  const groupWidth = 50;
  const barWidth = 20;
  const gap = 25;

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#0a0a0a",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        width: "280px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Revenue Growth
        </div>
        <div style={{ display: "flex", gap: "12px", fontSize: "11px" }}>
          <span style={{ color: "#df3e53" }}>● 2024</span>
          <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>● 2023</span>
        </div>
      </div>

      <svg
        width="240"
        height={chartHeight + 30}
        style={{ overflow: "visible" }}
      >
        {data.map((item, index) => {
          const currentHeight = (item.current / maxValue) * chartHeight;
          const previousHeight = (item.previous / maxValue) * chartHeight;
          const x = index * (groupWidth + gap);

          return (
            <g key={index}>
              <rect
                x={x}
                y={chartHeight - previousHeight}
                width={barWidth}
                height={previousHeight}
                fill="rgba(255, 255, 255, 0.15)"
                rx="3"
              />
              <rect
                x={x + barWidth + 4}
                y={chartHeight - currentHeight}
                width={barWidth}
                height={currentHeight}
                fill="#df3e53"
                rx="3"
              />
              <text
                x={x + groupWidth / 2}
                y={chartHeight + 20}
                fill="rgba(255, 255, 255, 0.5)"
                fontSize="11"
                textAnchor="middle"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
```

---

## ZPieChart

### Preview 1: Basic Pie Chart

```jsx
import React from "react";

export default function BasicPieChart() {
  const data = [
    { label: "Desktop", value: 45, color: "#df3e53" },
    { label: "Mobile", value: 35, color: "#e85566" },
    { label: "Tablet", value: 20, color: "rgba(255, 255, 255, 0.2)" },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;
  const centerX = 100;
  const centerY = 100;
  const radius = 80;

  const createArc = (startAngle, endAngle) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
  };

  const polarToCartesian = (cx, cy, r, angle) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#0a0a0a",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        width: "280px",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "16px",
        }}
      >
        Device Usage
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.map((item, index) => {
            const angle = (item.value / total) * 360;
            const path = createArc(currentAngle, currentAngle + angle);
            currentAngle += angle;

            return (
              <path
                key={index}
                d={path}
                fill={item.color}
                stroke="#0a0a0a"
                strokeWidth="2"
                style={{ transition: "all 0.3s ease" }}
              />
            );
          })}
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {data.map((item, index) => (
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: item.color,
                  borderRadius: "2px",
                }}
              />
              <div
                style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}
              >
                {item.label}
                <span
                  style={{
                    color: "#ffffff",
                    marginLeft: "4px",
                    fontWeight: "600",
                  }}
                >
                  {item.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Preview 2: Donut Chart with Center Value

```jsx
import React from "react";

export default function DonutChart() {
  const data = [
    { label: "Completed", value: 68 },
    { label: "Pending", value: 32 },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = 100;
  const centerY = 100;
  const radius = 70;
  const innerRadius = 50;

  const createDonutArc = (startAngle, endAngle, outerR, innerR) => {
    const start1 = polarToCartesian(centerX, centerY, outerR, endAngle);
    const end1 = polarToCartesian(centerX, centerY, outerR, startAngle);
    const start2 = polarToCartesian(centerX, centerY, innerR, startAngle);
    const end2 = polarToCartesian(centerX, centerY, innerR, endAngle);
    const largeArc = endAngle - startAngle <= 180 ? "0" : "1";

    return `M ${start1.x} ${start1.y} A ${outerR} ${outerR} 0 ${largeArc} 0 ${end1.x} ${end1.y} L ${start2.x} ${start2.y} A ${innerR} ${innerR} 0 ${largeArc} 1 ${end2.x} ${end2.y} Z`;
  };

  const polarToCartesian = (cx, cy, r, angle) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  let currentAngle = -90;
  const completedAngle = (data[0].value / total) * 360;

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#0a0a0a",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        width: "260px",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "16px",
        }}
      >
        Task Completion
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div style={{ position: "relative" }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <path
              d={createDonutArc(
                currentAngle,
                currentAngle + completedAngle,
                radius,
                innerRadius
              )}
              fill="#df3e53"
              style={{ transition: "all 0.3s ease" }}
            />
            <path
              d={createDonutArc(
                currentAngle + completedAngle,
                currentAngle + 360,
                radius,
                innerRadius
              )}
              fill="rgba(255, 255, 255, 0.1)"
            />
          </svg>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: "32px",
                fontWeight: "700",
                lineHeight: "1",
              }}
            >
              {data[0].value}%
            </div>
            <div
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: "11px",
                marginTop: "4px",
              }}
            >
              Complete
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#df3e53",
                borderRadius: "2px",
              }}
            />
            <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Completed ({data[0].value}%)
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "2px",
              }}
            />
            <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Pending ({data[1].value}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## ZLineChart

### Preview 1: Basic Line Chart

```jsx
import React from "react";

export default function BasicLineChart() {
  const data = [
    { label: "Mon", value: 45 },
    { label: "Tue", value: 52 },
    { label: "Wed", value: 48 },
    { label: "Thu", value: 68 },
    { label: "Fri", value: 72 },
    { label: "Sat", value: 65 },
    { label: "Sun", value: 58 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const chartWidth = 260;
  const chartHeight = 160;
  const padding = 20;

  const points = data.map((item, index) => {
    const x =
      (index / (data.length - 1)) * (chartWidth - padding * 2) + padding;
    const y =
      chartHeight -
      padding -
      ((item.value - minValue) / (maxValue - minValue)) *
        (chartHeight - padding * 2);
    return { x, y, value: item.value, label: item.label };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${
    chartHeight - padding
  } L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#0a0a0a",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        width: "300px",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "16px",
        }}
      >
        Weekly Activity
      </div>

      <svg
        width={chartWidth}
        height={chartHeight + 20}
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#df3e53" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#df3e53" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + i * ((chartHeight - padding * 2) / 4)}
            x2={chartWidth - padding}
            y2={padding + i * ((chartHeight - padding * 2) / 4)}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
        ))}

        <path d={areaD} fill="url(#lineGradient)" />

        <path
          d={pathD}
          fill="none"
          stroke="#df3e53"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#df3e53"
              stroke="#0a0a0a"
              strokeWidth="2"
            />
            <text
              x={point.x}
              y={chartHeight + 5}
              fill="rgba(255, 255, 255, 0.5)"
              fontSize="10"
              textAnchor="middle"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
```

### Preview 2: Multi-Line Comparison

```jsx
import React from "react";

export default function MultiLineChart() {
  const data = [
    { label: "Jan", sales: 42, leads: 35 },
    { label: "Feb", sales: 55, leads: 48 },
    { label: "Mar", sales: 48, leads: 52 },
    { label: "Apr", sales: 68, leads: 61 },
    { label: "May", sales: 75, leads: 70 },
  ];

  const maxValue = Math.max(...data.flatMap((d) => [d.sales, d.leads]));
  const minValue = 0;
  const chartWidth = 260;
  const chartHeight = 160;
  const padding = 20;

  const createPoints = (key) => {
    return data.map((item, index) => {
      const x =
        (index / (data.length - 1)) * (chartWidth - padding * 2) + padding;
      const y =
        chartHeight -
        padding -
        ((item[key] - minValue) / (maxValue - minValue)) *
          (chartHeight - padding * 2);
      return { x, y, value: item[key] };
    });
  };

  const salesPoints = createPoints("sales");
  const leadsPoints = createPoints("leads");

  const createPath = (points) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#0a0a0a",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        width: "300px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Sales vs Leads
        </div>
        <div style={{ display: "flex", gap: "12px", fontSize: "11px" }}>
          <span style={{ color: "#df3e53" }}>● Sales</span>
          <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>● Leads</span>
        </div>
      </div>

      <svg
        width={chartWidth}
        height={chartHeight + 20}
        style={{ overflow: "visible" }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + i * ((chartHeight - padding * 2) / 4)}
            x2={chartWidth - padding}
            y2={padding + i * ((chartHeight - padding * 2) / 4)}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
        ))}

        <path
          d={createPath(leadsPoints)}
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 4"
        />

        <path
          d={createPath(salesPoints)}
          fill="none"
          stroke="#df3e53"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {salesPoints.map((point, index) => (
          <circle
            key={`sales-${index}`}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#df3e53"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
        ))}

        {leadsPoints.map((point, index) => (
          <circle
            key={`leads-${index}`}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="rgba(255, 255, 255, 0.3)"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
        ))}

        {data.map((item, index) => {
          const x =
            (index / (data.length - 1)) * (chartWidth - padding * 2) + padding;
          return (
            <text
              key={index}
              x={x}
              y={chartHeight + 5}
              fill="rgba(255, 255, 255, 0.5)"
              fontSize="10"
              textAnchor="middle"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
```

#### Preview 2: Practical Confirm with Variants

```jsx
import React, { useState } from "react";

export default function PracticalConfirm() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState("delete");
  const [result, setResult] = useState(null);

  const confirmTypes = {
    delete: {
      title: "Delete Item",
      message:
        "This action cannot be undone. Are you sure you want to delete this item?",
      confirmText: "Delete",
      confirmColor: "#df3e53",
      icon: "🗑️",
    },
    logout: {
      title: "Confirm Logout",
      message: "You will be logged out of your account. Continue?",
      confirmText: "Logout",
      confirmColor: "#ffd43b",
      icon: "👋",
    },
    save: {
      title: "Save Changes",
      message: "Do you want to save your changes before leaving?",
      confirmText: "Save",
      confirmColor: "#51cf66",
      icon: "💾",
    },
  };

  const openConfirm = (type) => {
    setConfirmType(type);
    setShowConfirm(true);
    setResult(null);
  };

  const handleConfirm = () => {
    setResult(`${confirmType} confirmed`);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setResult("Cancelled");
    setShowConfirm(false);
  };

  const currentConfirm = confirmTypes[confirmType];

  return (
    <div
      style={{
        height: "300px",
        backgroundColor: "#0a0a0a",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <button
          onClick={() => openConfirm("delete")}
          style={{
            padding: "6px 12px",
            backgroundColor: "#df3e53",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          Delete
        </button>
        <button
          onClick={() => openConfirm("logout")}
          style={{
            padding: "6px 12px",
            backgroundColor: "#ffd43b",
            color: "#000000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          Logout
        </button>
        <button
          onClick={() => openConfirm("save")}
          style={{
            padding: "6px 12px",
            backgroundColor: "#51cf66",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          Save
        </button>
      </div>

      {result && (
        <div
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "12px",
            padding: "8px",
            backgroundColor: "#242424",
            borderRadius: "6px",
          }}
        >
          Result:{" "}
          <span style={{ color: "#51cf66", fontWeight: "600" }}>{result}</span>
        </div>
      )}

      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.2s ease-out",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "24px",
              width: "90%",
              maxWidth: "420px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
              animation: "scaleIn 0.2s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "24px" }}>{currentConfirm.icon}</span>
              <div
                style={{
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {currentConfirm.title}
              </div>
            </div>
            <div
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "13px",
                lineHeight: "1.6",
                marginBottom: "24px",
              }}
            >
              {currentConfirm.message}
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleCancel}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#242424",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: "10px 20px",
                  backgroundColor: currentConfirm.confirmColor,
                  color: confirmType === "logout" ? "#000000" : "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                {currentConfirm.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
```

---

## ZDataGrid

### Preview 1: Basic Table

```tsx
import React from 'react';

function ZDataGridBasic() {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'Active' }
  ];

  return (
    &lt;div style={{
      width: '100%',
      maxWidth: '800px',
      height: '280px',
      backgroundColor: '#1a1a1a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}&gt;
      &lt;table style={{
        width: '100%',
        borderCollapse: 'collapse',
        color: '#ffffff'
      }}&gt;
        &lt;thead&gt;
          &lt;tr style={{
            backgroundColor: '#242424',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}&gt;
            &lt;th style={{
              padding: '12px 16px',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)'
            }}&gt;ID&lt;/th&gt;
            &lt;th style={{
              padding: '12px 16px',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)'
            }}&gt;Name&lt;/th&gt;
            &lt;th style={{
              padding: '12px 16px',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)'
            }}&gt;Email&lt;/th&gt;
            &lt;th style={{
              padding: '12px 16px',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)'
            }}&gt;Status&lt;/th&gt;
          &lt;/tr&gt;
        &lt;/thead&gt;
        &lt;tbody&gt;
          {data.map((row) =&gt; (
            &lt;tr
              key={row.id}
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) =&gt; e.currentTarget.style.backgroundColor = '#242424'}
              onMouseLeave={(e) =&gt; e.currentTarget.style.backgroundColor = 'transparent'}
            &gt;
              &lt;td style={{
                padding: '12px 16px',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}&gt;{row.id}&lt;/td&gt;
              &lt;td style={{
                padding: '12px 16px',
                fontSize: '14px',
                color: '#ffffff'
              }}&gt;{row.name}&lt;/td&gt;
              &lt;td style={{
                padding: '12px 16px',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}&gt;{row.email}&lt;/td&gt;
              &lt;td style={{
                padding: '12px 16px',
                fontSize: '14px'
              }}&gt;
                &lt;span style={{
                  padding: '4px 10px',
                  backgroundColor: row.status === 'Active' ? 'rgba(81, 207, 102, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                  color: row.status === 'Active' ? '#51cf66' : 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}&gt;
                  {row.status}
                &lt;/span&gt;
              &lt;/td&gt;
            &lt;/tr&gt;
          ))}
        &lt;/tbody&gt;
      &lt;/table&gt;
    &lt;/div&gt;
  );
}
```

### Preview 2: With Actions

```tsx
import React, { useState } from 'react';

function ZDataGridActions() {
  const [data, setData] = useState([
    { id: 1, task: 'Update API documentation', priority: 'High', assignee: 'John', progress: 75 },
    { id: 2, task: 'Fix login bug', priority: 'Critical', assignee: 'Jane', progress: 90 },
    { id: 3, task: 'Design new dashboard', priority: 'Medium', assignee: 'Bob', progress: 30 }
  ]);

  const handleDelete = (id) =&gt; {
    setData(data.filter(item =&gt; item.id !== id));
  };

  return (
    &lt;div style={{
      width: '100%',
      maxWidth: '900px',
      height: '280px',
      backgroundColor: '#1a1a1a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      overflow: 'auto'
    }}&gt;
      &lt;table style={{
        width: '100%',
        borderCollapse: 'collapse',
        color: '#ffffff'
      }}&gt;
        &lt;thead&gt;
          &lt;tr style={{
            backgroundColor: '#242424',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'sticky',
            top: 0
          }}&gt;
            &lt;th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}&gt;Task&lt;/th&gt;
            &lt;th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}&gt;Priority&lt;/th&gt;
            &lt;th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}&gt;Assignee&lt;/th&gt;
            &lt;th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}&gt;Progress&lt;/th&gt;
            &lt;th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}&gt;Actions&lt;/th&gt;
          &lt;/tr&gt;
        &lt;/thead&gt;
        &lt;tbody&gt;
          {data.map((row) =&gt; (
            &lt;tr
              key={row.id}
              style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
            &gt;
              &lt;td style={{ padding: '12px 16px', fontSize: '14px', color: '#ffffff' }}&gt;{row.task}&lt;/td&gt;
              &lt;td style={{ padding: '12px 16px', fontSize: '14px' }}&gt;
                &lt;span style={{
                  padding: '4px 10px',
                  backgroundColor: row.priority === 'Critical' ? 'rgba(223, 62, 83, 0.1)' :
                                  row.priority === 'High' ? 'rgba(255, 212, 59, 0.1)' : 'rgba(81, 207, 102, 0.1)',
                  color: row.priority === 'Critical' ? '#df3e53' :
                        row.priority === 'High' ? '#ffd43b' : '#51cf66',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}&gt;
                  {row.priority}
                &lt;/span&gt;
              &lt;/td&gt;
              &lt;td style={{ padding: '12px 16px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}&gt;{row.assignee}&lt;/td&gt;
              &lt;td style={{ padding: '12px 16px', fontSize: '14px' }}&gt;
                &lt;div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}&gt;
                  &lt;div style={{
                    flex: 1,
                    height: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}&gt;
                    &lt;div style={{
                      width: `%`,
                      height: '100%',
                      backgroundColor: '#df3e53',
                      transition: 'width 0.3s'
                    }} /&gt;
                  &lt;/div&gt;
                  &lt;span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', minWidth: '35px' }}&gt;
                    {row.progress}%
                  &lt;/span&gt;
                &lt;/div&gt;
              &lt;/td&gt;
              &lt;td style={{ padding: '12px 16px', textAlign: 'center' }}&gt;
                &lt;button
                  onClick={() =&gt; handleDelete(row.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'rgba(223, 62, 83, 0.1)',
                    color: '#df3e53',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) =&gt; e.currentTarget.style.backgroundColor = 'rgba(223, 62, 83, 0.2)'}
                  onMouseLeave={(e) =&gt; e.currentTarget.style.backgroundColor = 'rgba(223, 62, 83, 0.1)'}
                &gt;
                  Delete
                &lt;/button&gt;
              &lt;/td&gt;
            &lt;/tr&gt;
          ))}
        &lt;/tbody&gt;
      &lt;/table&gt;
    &lt;/div&gt;
  );
}
```

---

## ZDescriptionList

### Preview 1: Basic Description List

```tsx
import React from 'react';

function ZDescriptionListBasic() {
  const items = [
    { term: 'Name', description: 'John Doe' },
    { term: 'Email', description: 'john.doe@example.com' },
    { term: 'Role', description: 'Software Engineer' },
    { term: 'Department', description: 'Engineering' },
    { term: 'Location', description: 'San Francisco, CA' }
  ];

  return (
    &lt;div style={{
      width: '100%',
      maxWidth: '600px',
      backgroundColor: '#0a0a0a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '24px'
    }}&gt;
      &lt;dl style={{
        margin: 0,
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        gap: '16px',
        color: '#ffffff'
      }}&gt;
        {items.map((item, index) =&gt; (
          &lt;React.Fragment key={index}&gt;
            &lt;dt style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              paddingTop: '2px'
            }}&gt;
              {item.term}
            &lt;/dt&gt;
            &lt;dd style={{
              margin: 0,
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}&gt;
              {item.description}
            &lt;/dd&gt;
          &lt;/React.Fragment&gt;
        ))}
      &lt;/dl&gt;
    &lt;/div&gt;
  );
}
```

### Preview 2: System Information

```tsx
import React from 'react';

function ZDescriptionListSystem() {
  const systemInfo = [
    { term: 'Server Status', description: 'Online', status: 'success' },
    { term: 'Uptime', description: '15 days, 7 hours' },
    { term: 'CPU Usage', description: '42%' },
    { term: 'Memory Usage', description: '6.2 GB / 16 GB' },
    { term: 'Active Users', description: '127' },
    { term: 'Last Backup', description: '2 hours ago', status: 'success' },
    { term: 'Next Maintenance', description: 'Dec 25, 2025 at 03:00 AM' },
    { term: 'API Version', description: 'v3.2.1' }
  ];

  return (
    &lt;div style={{
      width: '100%',
      maxWidth: '700px',
      backgroundColor: '#0a0a0a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '24px'
    }}&gt;
      &lt;h3 style={{
        margin: '0 0 20px 0',
        fontSize: '18px',
        fontWeight: '600',
        color: '#ffffff'
      }}&gt;
        System Information
      &lt;/h3&gt;
      &lt;dl style={{
        margin: 0,
        display: 'grid',
        gridTemplateColumns: '160px 1fr',
        gap: '16px 24px',
        color: '#ffffff'
      }}&gt;
        {systemInfo.map((item, index) =&gt; (
          &lt;React.Fragment key={index}&gt;
            &lt;dt style={{
              fontSize: '13px',
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.6)',
              paddingTop: '2px'
            }}&gt;
              {item.term}
            &lt;/dt&gt;
            &lt;dd style={{
              margin: 0,
              fontSize: '14px',
              color: item.status === 'success' ? '#51cf66' : '#ffffff',
              fontWeight: item.status ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}&gt;
              {item.status === 'success' &amp;&amp; (
                &lt;span style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#51cf66',
                  borderRadius: '50%'
                }} /&gt;
              )}
              {item.description}
            &lt;/dd&gt;
          &lt;/React.Fragment&gt;
        ))}
      &lt;/dl&gt;
    &lt;/div&gt;
  );
}
```

---

## ZKeyValue

### Preview 1: Basic Key-Value Pairs

```tsx
import React from 'react';

function ZKeyValueBasic() {
  const data = {
    'User ID': 'usr_1234567890',
    'Created': 'Dec 15, 2025',
    'Status': 'Active',
    'Plan': 'Pro',
    'API Key': '••••••••••••5678'
  };

  return (
    &lt;div style={{
      width: '100%',
      maxWidth: '500px',
      backgroundColor: '#0a0a0a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}&gt;
      {Object.entries(data).map(([key, value], index) =&gt; (
        &lt;div
          key={key}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            backgroundColor: index % 2 === 0 ? '#0a0a0a' : '#1a1a1a',
            borderBottom: index &lt; Object.keys(data).length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
          }}
        &gt;
          &lt;span style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'rgba(255, 255, 255, 0.6)'
          }}&gt;
            {key}
          &lt;/span&gt;
          &lt;span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#ffffff'
          }}&gt;
            {value}
          &lt;/span&gt;
        &lt;/div&gt;
      ))}
    &lt;/div&gt;
  );
}
```

### Preview 2: API Response Details

```tsx
import React from 'react';

function ZKeyValueAPI() {
  const responseData = {
    'Request ID': 'req_abc123def456',
    'Timestamp': '2025-12-18T14:32:15Z',
    'Method': 'POST',
    'Endpoint': '/api/v1/tasks',
    'Status Code': '201',
    'Response Time': '142ms',
    'Content Type': 'application/json',
    'Content Length': '1,248 bytes',
    'Cache': 'MISS',
    'Region': 'us-west-1'
  };

  const getStatusColor = (value) =&gt; {
    if (value === '201') return '#51cf66';
    if (value.includes('ms')) return '#ffd43b';
    if (value === 'POST') return '#df3e53';
    return '#ffffff';
  };

  return (
    &lt;div style={{
      width: '100%',
      maxWidth: '650px',
      backgroundColor: '#0a0a0a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}&gt;
      &lt;div style={{
        padding: '16px 20px',
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}&gt;
        &lt;h4 style={{
          margin: 0,
          fontSize: '15px',
          fontWeight: '600',
          color: '#ffffff'
        }}&gt;
          API Request Details
        &lt;/h4&gt;
      &lt;/div&gt;
      {Object.entries(responseData).map(([key, value]) =&gt; (
        &lt;div
          key={key}
          style={{
            display: 'grid',
            gridTemplateColumns: '180px 1fr',
            gap: '16px',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) =&gt; e.currentTarget.style.backgroundColor = '#1a1a1a'}
          onMouseLeave={(e) =&gt; e.currentTarget.style.backgroundColor = 'transparent'}
        &gt;
          &lt;span style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'rgba(255, 255, 255, 0.6)'
          }}&gt;
            {key}
          &lt;/span&gt;
          &lt;code style={{
            fontSize: '13px',
            fontWeight: '500',
            color: getStatusColor(value),
            fontFamily: 'monospace',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '2px 8px',
            borderRadius: '4px'
          }}&gt;
            {value}
          &lt;/code&gt;
        &lt;/div&gt;
      ))}
    &lt;/div&gt;
  );
}
```

---

## ZMarkdown

### Preview 1: Basic Markdown Rendering

```tsx
import React from 'react';

function ZMarkdownBasic() {
  const markdownContent = `
# Welcome to Zurto

This is a **markdown** component that supports _all_ standard markdown features.

## Features

- Easy to use
- Syntax highlighting
- Custom styling
- Dark theme optimized

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> This is a blockquote with important information.

[Learn more →](https://zurto.app)
  `;

  // Simple markdown parser (in real implementation, use a library like marked or react-markdown)
  const parseMarkdown = (md) =&gt; {
    return md
      .split('\n')
      .map((line, i) =&gt; {
        if (line.startsWith('# ')) return &lt;h1 key={i} style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: '#ffffff' }}&gt;{line.slice(2)}&lt;/h1&gt;;
        if (line.startsWith('## ')) return &lt;h2 key={i} style={{ fontSize: '20px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#ffffff' }}&gt;{line.slice(3)}&lt;/h2&gt;;
        if (line.startsWith('- ')) return &lt;li key={i} style={{ fontSize: '14px', marginBottom: '6px', color: 'rgba(255, 255, 255, 0.8)' }}&gt;{line.slice(2)}&lt;/li&gt;;
        if (line.startsWith('&gt; ')) return &lt;blockquote key={i} style={{ borderLeft: '3px solid #df3e53', paddingLeft: '16px', margin: '16px 0', color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic' }}&gt;{line.slice(2)}&lt;/blockquote&gt;;
        if (line.includes('**')) return &lt;p key={i} style={{ fontSize: '14px', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.8)' }}&gt;{line.split('**').map((part, j) =&gt; j % 2 ? &lt;strong key={j} style={{ fontWeight: '600', color: '#ffffff' }}&gt;{part}&lt;/strong&gt; : part)}&lt;/p&gt;;
        if (line.trim()) return &lt;p key={i} style={{ fontSize: '14px', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.8)' }}&gt;{line}&lt;/p&gt;;
        return &lt;br key={i} /&gt;;
      });
  };

  return (
    &lt;div style={{
      width: '100%',
      maxWidth: '700px',
      backgroundColor: '#0a0a0a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '24px'
    }}&gt;
      {parseMarkdown(markdownContent)}
    &lt;/div&gt;
  );
}
```

### Preview 2: Documentation Page

```tsx
import React from 'react';

function ZMarkdownDocs() {
  return (
    &lt;div style={{
      width: '100%',
      maxWidth: '800px',
      backgroundColor: '#0a0a0a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '32px'
    }}&gt;
      &lt;h1 style={{
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '8px',
        color: '#ffffff'
      }}&gt;
        Getting Started
      &lt;/h1&gt;
      &lt;p style={{
        fontSize: '16px',
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '24px'
      }}&gt;
        Learn how to integrate Zurto into your React application.
      &lt;/p&gt;

      &lt;h2 style={{
        fontSize: '24px',
        fontWeight: '600',
        marginTop: '32px',
        marginBottom: '12px',
        color: '#ffffff',
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}&gt;
        Installation
      &lt;/h2&gt;
      &lt;p style={{
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '12px'
      }}&gt;
        Install the package using npm or yarn:
      &lt;/p&gt;
      &lt;pre style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        padding: '16px',
        marginBottom: '20px',
        overflow: 'auto'
      }}&gt;
        &lt;code style={{
          fontSize: '13px',
          fontFamily: 'monospace',
          color: '#51cf66'
        }}&gt;
          npm install @zurto/ui
        &lt;/code&gt;
      &lt;/pre&gt;

      &lt;h2 style={{
        fontSize: '24px',
        fontWeight: '600',
        marginTop: '32px',
        marginBottom: '12px',
        color: '#ffffff',
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}&gt;
        Basic Usage
      &lt;/h2&gt;
      &lt;pre style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        padding: '16px',
        marginBottom: '12px',
        overflow: 'auto'
      }}&gt;
        &lt;code style={{
          fontSize: '13px',
          fontFamily: 'monospace',
          color: '#ffffff'
        }}&gt;{`import { ZButton } from '@zurto/ui';

function App() {
  return &lt;ZButton variant="primary"&gt;Click Me&lt;/ZButton&gt;;
}`}&lt;/code&gt;
      &lt;/pre&gt;

      &lt;div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid rgba(223, 62, 83, 0.3)',
        borderRadius: '6px',
        padding: '16px',
        marginTop: '24px'
      }}&gt;
        &lt;div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px'
        }}&gt;
          &lt;span style={{
            fontSize: '16px',
            color: '#df3e53'
          }}&gt;
            ⚠️
          &lt;/span&gt;
          &lt;strong style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#df3e53'
          }}&gt;
            Important Note
          &lt;/strong&gt;
        &lt;/div&gt;
        &lt;p style={{
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: 0
        }}&gt;
          Make sure to wrap your app with the ZurtoProvider to enable theme support.
        &lt;/p&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
```

---

## ZJsonViewer

### Preview 1: Basic JSON Display

```tsx
import React, { useState } from 'react';

function ZJsonViewerBasic() {
  const jsonData = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    active: true,
    role: "admin",
    lastLogin: "2025-12-18T10:30:00Z"
  };

  const [collapsed, setCollapsed] = useState({});

  const toggleCollapse = (key) =&gt; {
    setCollapsed(prev =&gt; ({ ...prev, [key]: !prev[key] }));
  };

  return (
    &lt;div style={{
      width: '100%',
      maxWidth: '600px',
      backgroundColor: '#0a0a0a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '20px',
      fontFamily: 'monospace',
      fontSize: '13px'
    }}&gt;
      &lt;div style={{ color: 'rgba(255, 255, 255, 0.7)' }}&gt;
        {'{'}
        &lt;div style={{ paddingLeft: '20px' }}&gt;
          {Object.entries(jsonData).map(([key, value], index) =&gt; (
            &lt;div key={key} style={{ marginBottom: '4px' }}&gt;
              &lt;span style={{ color: '#df3e53' }}&gt;"{key}"&lt;/span&gt;
              &lt;span style={{ color: 'rgba(255, 255, 255, 0.5)' }}&gt;: &lt;/span&gt;
              {typeof value === 'string' ? (
                &lt;span style={{ color: '#51cf66' }}&gt;"{value}"&lt;/span&gt;
              ) : typeof value === 'boolean' ? (
                &lt;span style={{ color: '#ffd43b' }}&gt;{String(value)}&lt;/span&gt;
              ) : typeof value === 'number' ? (
                &lt;span style={{ color: '#74c0fc' }}&gt;{value}&lt;/span&gt;
              ) : (
                &lt;span style={{ color: '#ffffff' }}&gt;{String(value)}&lt;/span&gt;
              )}
              {index &lt; Object.keys(jsonData).length - 1 &amp;&amp; &lt;span style={{ color: 'rgba(255, 255, 255, 0.5)' }}&gt;,&lt;/span&gt;}
            &lt;/div&gt;
          ))}
        &lt;/div&gt;
        {'}'}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
```

### Preview 2: Nested JSON with Collapse

```tsx
import React, { useState } from 'react';

function ZJsonViewerAdvanced() {
  const complexData = {
    user: {
      id: 12345,
      name: "Jane Smith",
      email: "jane@zurto.app",
      verified: true
    },
    settings: {
      theme: "dark",
      notifications: {
        email: true,
        push: false,
        sms: true
      },
      privacy: {
        profileVisible: true,
        showEmail: false
      }
    },
    stats: {
      tasksCompleted: 142,
      projectsCreated: 8,
      collaborators: 23
    }
  };

  const [collapsed, setCollapsed] = useState({});

  const toggleCollapse = (path) =&gt; {
    setCollapsed(prev =&gt; ({ ...prev, [path]: !prev[path] }));
  };

  const renderValue = (value, path = '') =&gt; {
    if (typeof value === 'object' &amp;&amp; value !== null) {
      const isCollapsed = collapsed[path];
      const keys = Object.keys(value);

      return (
        &lt;span&gt;
          &lt;button
            onClick={() =&gt; toggleCollapse(path)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              padding: 0,
              marginRight: '6px',
              fontSize: '12px'
            }}
          &gt;
            {isCollapsed ? '▶' : '▼'}
          &lt;/button&gt;
          {'{'}
          {!isCollapsed &amp;&amp; (
            &lt;div style={{ paddingLeft: '20px' }}&gt;
              {keys.map((key, index) =&gt; (
                &lt;div key={key} style={{ marginTop: '4px' }}&gt;
                  &lt;span style={{ color: '#df3e53' }}&gt;"{key}"&lt;/span&gt;
                  &lt;span style={{ color: 'rgba(255, 255, 255, 0.5)' }}&gt;: &lt;/span&gt;
                  {renderValue(value[key], `${path}.${key}`)}
                  {index &lt; keys.length - 1 &amp;&amp; &lt;span style={{ color: 'rgba(255, 255, 255, 0.5)' }}&gt;,&lt;/span&gt;}
                &lt;/div&gt;
              ))}
            &lt;/div&gt;
          )}
          {isCollapsed &amp;&amp; &lt;span style={{ color: 'rgba(255, 255, 255, 0.3)' }}&gt;...&lt;/span&gt;}
          {'}'}
        &lt;/span&gt;
      );
    }

    if (typeof value === 'string') return &lt;span style={{ color: '#51cf66' }}&gt;"{value}"&lt;/span&gt;;
    if (typeof value === 'boolean') return &lt;span style={{ color: '#ffd43b' }}&gt;{String(value)}&lt;/span&gt;;
    if (typeof value === 'number') return &lt;span style={{ color: '#74c0fc' }}&gt;{value}&lt;/span&gt;;
    return &lt;span style={{ color: '#ffffff' }}&gt;{String(value)}&lt;/span&gt;;
  };

  return (
    &lt;div style={{
      width: '100%',
      maxWidth: '700px',
      backgroundColor: '#0a0a0a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}&gt;
      &lt;div style={{
        padding: '12px 16px',
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}&gt;
        &lt;span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}&gt;
          JSON Viewer
        &lt;/span&gt;
        &lt;button style={{
          padding: '4px 12px',
          backgroundColor: 'rgba(223, 62, 83, 0.1)',
          color: '#df3e53',
          border: 'none',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer'
        }}&gt;
          Copy
        &lt;/button&gt;
      &lt;/div&gt;
      &lt;div style={{
        padding: '20px',
        fontFamily: 'monospace',
        fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.7)',
        maxHeight: '400px',
        overflow: 'auto'
      }}&gt;
        {renderValue(complexData, 'root')}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
```
