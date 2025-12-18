# Zurto UI Library - Massive Expansion Plan

**Date**: December 18, 2025  
**Goal**: Build the holy grail of UI libraries - hundreds of components, 20+ templates, Mantine-style docs

---

## 📊 Current State Analysis

### Existing Components (41 total)

**Core** (13):

- ✅ ZAvatar, ZBadge, ZButton, ZCard, ZCheckbox, ZInput, ZModal, ZProgress, ZRadio, ZSelect, ZSpinner, ZSwitch, ZTooltip

**Advanced** (5):

- ✅ ZCanvas, ZChart, ZCodeEditor, ZTerminal, ZVirtualList

**Data Display** (3):

- ✅ ZList, ZStatCard, ZTable

**Feedback** (4):

- ✅ ZAlert, ZEmptyState, ZSkeleton, ZToast

**Forms** (6):

- ✅ ZColorPicker, ZDatePicker, ZFieldGroup, ZFileUpload, ZForm, ZInlineEdit

**Layout** (6):

- ✅ ZBox, ZContainer, ZDivider, ZGrid, ZSplitPane, ZStack

**Navigation** (3):

- ✅ ZBreadcrumbs, ZCommandPalette, ZPagination

**Provider**:

- ✅ ZProvider (theme/context)

---

## 🎯 Expansion Roadmap

### Phase 1: Foundation (Week 1-2)

**Goal**: Fix existing issues + build new docs website

1. **Color System Audit** ✅ DONE

   - Fixed: `--accent-color` from `#5865f2` → `#df3e53`
   - Fixed: Logo gradient `#c235a` → `#c2355a`
   - Fixed: All hardcoded blues replaced with CSS variables

2. **Build Mantine-Style Docs Website** 🔄 IN PROGRESS

   - URL: `https://ui.zurto.app` or `zurto-ui-docs.vercel.app`
   - Features:
     - Fuzzy search bar (Algolia or local)
     - Category sidebar navigation
     - Visual component grid
     - Interactive playground
     - Copy-paste code snippets
     - Dark/light theme toggle
   - Stack: Vitepress (current) or custom React app
   - Design inspiration: https://ui.mantine.dev/

3. **Component Testing Strategy**
   Testing options explained:

   - **Visual Regression**: Takes screenshots, compares changes (catches UI bugs)
   - **Unit Tests**: Tests logic (button clicks, state changes)
   - **E2E Tests**: Tests user flows (form submission, navigation)
   - **A11y Tests**: Checks accessibility (screen readers, keyboard nav)

   **Recommendation**: Start with **Unit tests (Vitest)** + **A11y tests (axe)** - most practical for component library

---

## 📦 New Components to Build (200+ total)

### Interactive Components (30+)

- [ ] ZAccordion - Collapsible content sections
- [ ] ZActionIcon - Icon-only button
- [ ] ZAffix - Floating element (sticky)
- [ ] ZAnchor - Enhanced link
- [ ] ZAppShell - App layout wrapper
- [ ] ZBlockquote - Styled quote block
- [ ] ZBurger - Hamburger menu icon
- [ ] ZCarousel - Image/content slider
- [ ] ZChip - Tag/chip component
- [ ] ZCloseButton - Close/dismiss button
- [ ] ZCollapse - Animated collapse
- [ ] ZColorInput - Color input field
- [ ] ZCombobox - Autocomplete select
- [ ] ZCopyButton - Click to copy
- [ ] ZDialog - Small modal dialog
- [ ] ZDrawer - Slide-out panel
- [ ] ZDropzone - File drag-drop area
- [ ] ZFab - Floating action button
- [ ] ZFocusTrap - Focus management
- [ ] ZGroup - Horizontal layout
- [ ] ZHighlight - Text highlighter
- [ ] ZHoverCard - Hover tooltip card
- [ ] ZJsonInput - JSON editor
- [ ] ZKbd - Keyboard shortcut display
- [ ] ZLoadingOverlay - Full-screen loader
- [ ] ZMark - Text marker
- [ ] ZMenu - Dropdown menu
- [ ] ZMultiSelect - Multiple selection
- [ ] ZNavLink - Navigation link
- [ ] ZNotification - Toast notification
- [ ] ZNumberInput - Number spinner
- [ ] ZOverlay - Dark overlay
- [ ] ZPasswordInput - Password field
- [ ] ZPill - Rounded badge
- [ ] ZPinInput - PIN/OTP input
- [ ] ZPopover - Floating content
- [ ] ZRangeSlider - Range selector
- [ ] ZRating - Star rating
- [ ] ZRingProgress - Circular progress
- [ ] ZScrollArea - Custom scrollbar
- [ ] ZSegmentedControl - Toggle group
- [ ] ZSlider - Range slider
- [ ] ZSpoiler - Expandable text
- [ ] ZStepper - Step indicator
- [ ] ZTabs - Tab navigation
- [ ] ZTagsInput - Tags input field
- [ ] ZTextarea - Multi-line input
- [ ] ZTimeline - Event timeline
- [ ] ZTransferList - Two-list transfer
- [ ] ZTree - Tree view

### Data Display & Visualization (25+)

- [ ] ZAccordion - Data accordion
- [ ] ZBackgroundImage - Image container
- [ ] ZBarChart - Bar chart
- [ ] ZDonutChart - Donut chart
- [ ] ZFunnelChart - Funnel chart
- [ ] ZGaugeChart - Gauge meter
- [ ] ZHeatmap - Heat map
- [ ] ZImage - Enhanced image
- [ ] ZIndicator - Badge indicator
- [ ] ZLineChart - Line chart
- [ ] ZPieChart - Pie chart
- [ ] ZRadarChart - Radar chart
- [ ] ZScatterChart - Scatter plot
- [ ] ZSimpleGrid - Responsive grid
- [ ] ZSparkline - Mini chart
- [ ] ZText - Typography component
- [ ] ZThemeIcon - Themed icon
- [ ] ZTimestamp - Formatted time
- [ ] ZTitle - Heading component

### Marketing & Landing Components (30+)

- [ ] ZHero - Hero section
- [ ] ZCTA - Call-to-action
- [ ] ZFeatureGrid - Feature showcase
- [ ] ZTestimonial - Customer review
- [ ] ZPricingCard - Pricing table
- [ ] ZLogoCloud - Logo grid
- [ ] ZFAQSection - FAQ accordion
- [ ] ZStatsSection - Statistics display
- [ ] ZTeamGrid - Team member cards
- [ ] ZBlogCard - Blog post card
- [ ] ZContactForm - Contact section
- [ ] ZNewsletterForm - Newsletter signup
- [ ] ZFooter - Footer layouts
- [ ] ZNavbar - Navigation bars
- [ ] ZSidebar - Sidebar layouts
- [ ] ZBento - Bento grid layout
- [ ] ZMarquee - Scrolling text
- [ ] ZGradientText - Gradient text
- [ ] ZAnimatedBeam - Animated line
- [ ] ZGlobe - 3D globe
- [ ] ZMagicCard - Hover effect card
- [ ] ZMeteors - Meteor animation
- [ ] ZParticles - Particle background
- [ ] ZRipple - Ripple effect
- [ ] ZShimmer - Shimmer effect
- [ ] ZSparkles - Sparkle animation
- [ ] ZTextReveal - Text reveal animation
- [ ] ZWavyBackground - Wavy background

### E-commerce Components (15+)

- [ ] ZProductCard - Product display
- [ ] ZProductGrid - Product grid
- [ ] ZCartDrawer - Shopping cart
- [ ] ZCheckoutForm - Checkout flow
- [ ] ZOrderSummary - Order details
- [ ] ZPaymentMethod - Payment selector
- [ ] ZShippingMethod - Shipping options
- [ ] ZReviewCard - Product review
- [ ] ZWishlistButton - Wishlist toggle
- [ ] ZQuantitySelector - Quantity input
- [ ] ZPriceDisplay - Price formatter
- [ ] ZDiscountBadge - Sale badge
- [ ] ZCategoryCard - Category tile
- [ ] ZFilterPanel - Product filters
- [ ] ZSortDropdown - Sort options

### Dashboard Components (20+)

- [ ] ZMetricCard - KPI display
- [ ] ZAreaChart - Area chart
- [ ] ZCandlestickChart - Stock chart
- [ ] ZActivityFeed - Activity stream
- [ ] ZUserMenu - User dropdown
- [ ] ZNotificationBell - Notifications
- [ ] ZSearchBar - Search input
- [ ] ZQuickActions - Action buttons
- [ ] ZWidgetCard - Dashboard widget
- [ ] ZDataTable - Advanced table
- [ ] ZKanbanBoard - Kanban view
- [ ] ZCalendar - Calendar view
- [ ] ZDateRangePicker - Date range
- [ ] ZFilterBar - Advanced filters
- [ ] ZExportButton - Data export
- [ ] ZRefreshButton - Refresh data
- [ ] ZBulkActions - Bulk operations
- [ ] ZStatusIndicator - Status badge
- [ ] ZProgressTracker - Progress steps
- [ ] ZCommentThread - Comments section

### Utility Components (15+)

- [ ] ZPortal - React portal
- [ ] ZTransition - CSS transitions
- [ ] ZVisuallyHidden - Screen reader only
- [ ] ZMediaQuery - Responsive helper
- [ ] ZUseClickOutside - Click outside hook
- [ ] ZUseIntersection - Intersection observer
- [ ] ZUseLocalStorage - Local storage hook
- [ ] ZUseWindowScroll - Scroll hook
- [ ] ZErrorBoundary - Error catcher
- [ ] ZLazyLoad - Lazy loading
- [ ] ZInfiniteScroll - Infinite scroll
- [ ] ZMasonry - Masonry layout
- [ ] ZVirtualScroll - Virtual scrolling
- [ ] ZResizable - Resizable panel
- [ ] ZDraggable - Draggable element

---

## 🎨 Website Templates (20 Categories)

### 1. Landing Pages

- SaaS product landing
- App download landing
- Event landing
- Waitlist/coming soon

### 2. SaaS Dashboards

- Analytics dashboard
- Project management
- CRM dashboard
- Admin panel

### 3. E-commerce

- Product listing
- Product detail
- Shopping cart
- Checkout flow

### 4. Portfolio/Agency

- Creative portfolio
- Agency homepage
- Case study layout
- Team page

### 5. Blog/Content

- Blog homepage
- Article layout
- Author page
- Category archive

### 6. Authentication

- Login/signup
- Forgot password
- Email verification
- Two-factor auth

### 7. Error Pages

- 404 not found
- 500 server error
- Maintenance mode
- Access denied

### 8. Marketing Pages

- Pricing page
- Features overview
- About us
- Contact us

### 9. Documentation

- Docs homepage
- API reference
- Changelog
- Getting started

### 10. Social/Community

- User profile
- Feed/timeline
- Chat interface
- Forum layout

### 11. Finance/Fintech

- Wallet dashboard
- Transaction history
- Invoice template
- Payment portal

### 12. Healthcare

- Patient portal
- Appointment booking
- Medical records
- Telemedicine interface

### 13. Education

- Course catalog
- Lesson player
- Student dashboard
- Quiz interface

### 14. Real Estate

- Property listing
- Property details
- Agent profile
- Search filters

### 15. Travel/Booking

- Hotel listing
- Booking flow
- Itinerary view
- Review page

### 16. Restaurant/Food

- Menu display
- Online ordering
- Table reservation
- Restaurant profile

### 17. Events/Tickets

- Event listing
- Event details
- Ticket selection
- Registration form

### 18. Job Board

- Job listings
- Job details
- Application form
- Company profile

### 19. Productivity Tools

- Task manager
- Note-taking app
- Time tracker
- Calendar app

### 20. Creative Tools

- Photo editor
- Design tool
- Music player
- Video player

---

## 🎨 Color Theme System

### Brand Colors

```css
--zurto-red: #df3e53;
--zurto-red-dark: #661520ff;
--zurto-red-light: #e85566;
```

### Theme Variations

1. **Dark Theme** (Default) - `#0a0a0a` background
2. **Light Theme** - `#ffffff` background
3. **Midnight** - Deep blue-black
4. **Sunset** - Warm reds/oranges
5. **Ocean** - Cool blues/teals
6. **Forest** - Greens/browns
7. **Monochrome** - Pure black/white
8. **High Contrast** - Accessibility focused

---

## 🚀 Implementation Strategy

### Option A: Components First (Recommended)

**Week 1-2**: Build 50 new core components
**Week 3-4**: Build docs website using our own components
**Week 5-6**: Build 20 templates using our components

✅ **Pros**:

- We use our own library to build docs (dogfooding)
- Find bugs/issues early
- Better component testing

### Option B: Docs First

**Week 1-2**: Build docs website with existing components
**Week 3-6**: Add new components to existing docs

❌ **Cons**:

- Need to rebuild docs as components change
- Less component validation

### **DECISION: Option A - Components First**

---

## 📝 Immediate Action Items

### This Week (December 18-24, 2025)

**Day 1-2: Component Expansion (Priority Batch)**

- [ ] ZAccordion
- [ ] ZTabs
- [ ] ZMenu
- [ ] ZDrawer
- [ ] ZPopover
- [ ] ZDropdown
- [ ] ZSlider
- [ ] ZTextarea
- [ ] ZNumberInput
- [ ] ZPasswordInput

**Day 3-4: Testing Setup**

- [ ] Setup Vitest for unit tests
- [ ] Setup @axe-core/react for a11y tests
- [ ] Write tests for existing components
- [ ] Create test templates for new components

**Day 5-7: Docs Website Foundation**

- [ ] Design Mantine-inspired layout
- [ ] Build homepage (component grid)
- [ ] Build component detail pages
- [ ] Add search functionality
- [ ] Deploy to Vercel

---

## 🔮 V4 Preview (Drag-Drop Builder)

### Vision

Figma-like website builder using Zurto UI components

- Drag components from palette to canvas
- AI-powered template generation
- AI-assisted editing ("Make this section blue", "Add a contact form")
- Non-programmer friendly (Lego blocks)
- Export to React/HTML code

### Core Features

1. **Component Palette** - Draggable component library
2. **Canvas** - Visual editing area (built on React Flow)
3. **Property Panel** - Edit props visually
4. **AI Assistant** - Natural language editing
5. **Code Export** - Generate clean React code
6. **Template Gallery** - Pre-built templates
7. **Collaboration** - Multiplayer editing (optional)

### Tech Stack

- React Flow for canvas
- Monaco Editor for code view
- Claude AI for natural language
- WebContainer for live preview
- Custom AST manipulation for code generation

**Timeline**: After UI library is mature (Q2 2026)

---

## 📊 Success Metrics

### Month 1

- [ ] 100+ components built
- [ ] Docs website live
- [ ] 10 templates completed
- [ ] 80%+ test coverage

### Month 3

- [ ] 200+ components
- [ ] 20 templates
- [ ] 1,000+ npm downloads/week
- [ ] Community contributions

### Month 6

- [ ] 300+ components
- [ ] 50+ templates
- [ ] 10,000+ npm downloads/week
- [ ] V4 builder alpha released

---

## 🛠️ Development Workflow

### Component Creation Process

1. Create component folder: `src/components/[category]/Z[Name]/`
2. Files needed:
   - `Z[Name].tsx` - Component logic
   - `Z[Name].module.css` - Styles
   - `Z[Name].stories.tsx` - Storybook stories
   - `Z[Name].test.tsx` - Unit tests
   - `index.ts` - Export
3. Add to category `index.ts`
4. Add to docs
5. Test and review
6. Merge and publish

### Props Pattern

```tsx
interface Z[Name]Props {
  // Visual variants
  variant?: 'filled' | 'outline' | 'ghost' | 'subtle';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  // State
  disabled?: boolean;
  loading?: boolean;

  // Common
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

---

## 📚 Documentation Structure

```
docs/
├── index.md (Homepage)
├── getting-started/
│   ├── installation.md
│   ├── usage.md
│   └── theming.md
├── components/
│   ├── core/
│   │   ├── button.md
│   │   ├── input.md
│   │   └── ...
│   ├── advanced/
│   ├── data-display/
│   ├── feedback/
│   ├── forms/
│   ├── layout/
│   └── navigation/
├── templates/
│   ├── landing-pages.md
│   ├── dashboards.md
│   └── ...
├── guides/
│   ├── accessibility.md
│   ├── performance.md
│   └── best-practices.md
└── playground/
    └── sandbox.md
```

---

**Next Steps**: Backup current folder, then start Phase 1 - Component Expansion batch

