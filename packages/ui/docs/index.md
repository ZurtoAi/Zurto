---
layout: home
title: Zurto UI - 32 Premium React Components
---

<script setup>
import CategoryCard from './.vitepress/theme/components/CategoryCard.vue';
import ComponentGrid from './.vitepress/theme/components/ComponentGrid.vue';
</script>

<div class="hero-section">
  <div class="hero-content">
    <div class="hero-badge">
      <span class="badge-dot"></span>
      32 Production-Ready Components
    </div>
    <h1 class="hero-title">
      Build Beautiful Apps<br/>
      <span class="hero-gradient">Lightning Fast</span>
    </h1>
    <p class="hero-description">
      The ultimate dark-theme React component library with glassmorphism effects, 
      interactive previews, and stunning visual design. Built for developers who demand excellence.
    </p>
    <div class="hero-actions">
      <a href="/guide/getting-started" class="hero-btn hero-btn-primary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        Get Started
      </a>
      <a href="#categories" class="hero-btn hero-btn-secondary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        Browse Components
      </a>
      <a href="https://github.com/zurto/zurto-ui" class="hero-btn hero-btn-ghost">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
        GitHub
      </a>
    </div>
  </div>
  <div class="hero-visual">
    <div class="hero-card hero-card-1"></div>
    <div class="hero-card hero-card-2"></div>
    <div class="hero-card hero-card-3"></div>
  </div>
</div>

<ComponentGrid
  id="categories"
  title="Component Categories"
  subtitle="32 components organized into 7 categories. Click any card to explore.">
<CategoryCard
    title="Buttons"
    :component-count="4"
    icon="MousePointerClick"
    link="/components/button/">
<template #preview>
<div style="display: flex; gap: 12px; flex-wrap: wrap;">
<button class="preview-btn preview-btn-primary">Primary</button>
<button class="preview-btn preview-btn-secondary">Secondary</button>
<button class="preview-btn preview-btn-ghost">Ghost</button>
</div>
</template>
</CategoryCard>
<CategoryCard
    title="Forms & Inputs"
    :component-count="6"
    icon="FormInput"
    link="/components/form/">
<template #preview>
<div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
<input class="preview-input" placeholder="Email address..." />
<input class="preview-input" type="password" placeholder="Password..." />
</div>
</template>
</CategoryCard>
<CategoryCard
    title="Feedback"
    :component-count="7"
    icon="MessageSquare"
    link="/components/feedback/">
<template #preview>
<div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
<div class="preview-alert preview-alert-success">Success message</div>
<div class="preview-alert preview-alert-error">Error message</div>
</div>
</template>
</CategoryCard>
<CategoryCard
    title="Layout"
    :component-count="5"
    icon="LayoutGrid"
    link="/components/layout/">
<template #preview>
<div class="preview-grid">
<div class="preview-grid-item"></div>
<div class="preview-grid-item"></div>
<div class="preview-grid-item"></div>
<div class="preview-grid-item"></div>
</div>
</template>
</CategoryCard>
<CategoryCard
    title="Navigation"
    :component-count="4"
    icon="Navigation"
    link="/components/navigation/">
<template #preview>
<div class="preview-nav">
<div class="preview-nav-item active">Home</div>
<div class="preview-nav-item">Products</div>
<div class="preview-nav-item">About</div>
</div>
</template>
</CategoryCard>
<CategoryCard
    title="Data Display"
    :component-count="4"
    icon="Table"
    link="/components/data-display/">
<template #preview>
<div class="preview-table">
<div class="preview-table-row preview-table-header">
<div>Name</div>
<div>Status</div>
<div>Value</div>
</div>
<div class="preview-table-row">
<div>Item 1</div>
<div><span class="preview-badge">Active</span></div>
<div>$500</div>
</div>
</div>
</template>
</CategoryCard>
<CategoryCard
    title="Typography"
    :component-count="2"
    icon="Type"
    link="/components/typography/">
<template #preview>
<div style="display: flex; flex-direction: column; gap: 8px;">
<div style="font-size: 1.25rem; font-weight: 700; color: white;">Heading</div>
<div style="font-size: 0.95rem; color: rgba(255,255,255,0.7);">Body text</div>
</div>
</template>
</CategoryCard>
</ComponentGrid>

<div class="features-section">
  <h2 class="features-title">Why Zurto UI?</h2>
  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <h3>Tree-Shakable</h3>
      <p>Import only what you need. Optimized bundle size with zero unused code in production.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <h3>TypeScript Native</h3>
      <p>Full type safety with comprehensive definitions. Excellent IDE support and autocomplete.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
      <h3>Blazing Fast</h3>
      <p>Optimized for performance with virtualized lists, lazy loading, and minimal re-renders.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"/><path d="M12 6v6l4 2"/>
        </svg>
      </div>
      <h3>Dark Theme Perfect</h3>
      <p>Stunning dark theme with glassmorphism effects and carefully crafted color palettes.</p>
    </div>
  </div>
</div>

<style scoped>
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  padding: 80px 48px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 600px;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(199, 53, 72, 0.1);
  border: 1px solid rgba(199, 53, 72, 0.3);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--zurto-primary);
  margin-bottom: 24px;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: var(--zurto-primary);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.9); }
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1.1;
  color: white;
  margin-bottom: 24px;
  letter-spacing: -0.03em;
}

.hero-gradient {
  background: var(--zurto-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.hero-btn-primary {
  background: linear-gradient(135deg, var(--zurto-primary-dark) 0%, var(--zurto-primary) 100%);
  color: white;
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(199, 53, 72, 0.3);
  background: linear-gradient(135deg, var(--zurto-primary) 0%, #ff6b7a 100%);
  color: #ffffff;
}

.hero-btn-secondary {
  background: rgba(199, 53, 72, 0.1);
  border-color: var(--zurto-primary);
  color: var(--zurto-primary);
}

.hero-btn-secondary:hover {
  background: rgba(199, 53, 72, 0.25);
  border-color: #ff6b7a;
  color: #ff6b7a;
}

.hero-btn-ghost {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}

.hero-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
}

.hero-visual {
  flex: 1;
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-card {
  position: absolute;
  background: linear-gradient(135deg, rgba(28, 31, 38, 0.9) 0%, rgba(20, 22, 27, 0.95) 100%);
  border: 1px solid rgba(199, 53, 72, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.hero-card-1 {
  width: 300px;
  height: 180px;
  z-index: 3;
  animation: float 6s ease-in-out infinite;
}

.hero-card-2 {
  width: 250px;
  height: 150px;
  top: 40px;
  right: 20px;
  z-index: 2;
  animation: float 6s ease-in-out infinite 1s;
}

.hero-card-3 {
  width: 220px;
  height: 130px;
  bottom: 60px;
  left: 40px;
  z-index: 1;
  animation: float 6s ease-in-out infinite 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Preview Styles */
.preview-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-btn-primary {
  background: linear-gradient(135deg, var(--zurto-primary-dark), var(--zurto-primary));
  color: white;
}

.preview-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(199, 53, 72, 0.4);
  filter: brightness(1.1);
}

.preview-btn-secondary {
  background: rgba(199, 53, 72, 0.15);
  color: var(--zurto-primary-light);
  border: 1px solid rgba(199, 53, 72, 0.3);
}

.preview-btn-secondary:hover {
  background: rgba(199, 53, 72, 0.25);
  border-color: var(--zurto-primary);
  color: #ff6b7a;
}

.preview-btn-ghost {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.preview-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
}

.preview-input {
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.preview-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.preview-input:hover {
  border-color: rgba(199, 53, 72, 0.3);
  background: rgba(0, 0, 0, 0.4);
}

.preview-input:focus {
  outline: none;
  border-color: var(--zurto-primary);
  box-shadow: 0 0 0 3px rgba(199, 53, 72, 0.2);
}

.preview-nav {
  display: flex;
  gap: 8px;
  width: 100%;
}

.preview-nav-item {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
}

.preview-nav-item.active {
  background: rgba(199, 53, 72, 0.2);
  color: var(--zurto-primary-light);
}

.preview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
}

.preview-grid-item {
  aspect-ratio: 1;
  background: rgba(199, 53, 72, 0.1);
  border: 1px solid rgba(199, 53, 72, 0.2);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.preview-grid-item:hover {
  background: rgba(199, 53, 72, 0.2);
  border-color: var(--zurto-primary);
  transform: scale(1.02);
}

.preview-table {
  width: 100%;
  font-size: 0.85rem;
}

.preview-table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

.preview-table-row:not(.preview-table-header):hover {
  background: rgba(199, 53, 72, 0.08);
}

.preview-table-header {
  font-weight: 700;
  color: var(--zurto-primary-light);
}

.preview-badge {
  padding: 4px 8px;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  color: rgb(74, 222, 128);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.preview-alert {
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.preview-alert-success {
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  color: rgb(74, 222, 128);
}

.preview-alert-error {
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: rgb(248, 113, 113);
}

.preview-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.preview-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(199, 53, 72, 0.2) 0%, rgba(160, 32, 48, 0.3) 100%);
  transition: all 0.3s ease;
}

.preview-media:hover .preview-image {
  transform: scale(1.05);
}

.preview-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: rgba(199, 53, 72, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.preview-media:hover .preview-play-btn {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 8px 24px rgba(199, 53, 72, 0.5);
}

.preview-slider {
  width: 100%;
  cursor: pointer;
}

.preview-slider-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  position: relative;
  transition: all 0.2s ease;
}

.preview-slider:hover .preview-slider-track {
  background: rgba(255, 255, 255, 0.15);
  height: 8px;
}

.preview-slider-thumb {
  position: absolute;
  left: 60%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: var(--zurto-primary);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(199, 53, 72, 0.4);
  transition: all 0.2s ease;
}

.preview-slider:hover .preview-slider-thumb {
  width: 20px;
  height: 20px;
  box-shadow: 0 4px 16px rgba(199, 53, 72, 0.5);
}

.preview-animation {
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(199, 53, 72, 0.2);
  border-top-color: var(--zurto-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.preview-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 80px;
  width: 100%;
}

.preview-bar {
  flex: 1;
  background: linear-gradient(to top, var(--zurto-primary-dark), var(--zurto-primary));
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.preview-bar:hover {
  filter: brightness(1.2);
  transform: scaleY(1.05);
  transform-origin: bottom;
}

/* Features Section */
.features-section {
  padding: 80px 48px;
  max-width: 1400px;
  margin: 0 auto;
}

.features-title {
  font-size: 3rem;
  font-weight: 900;
  text-align: center;
  background: var(--zurto-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.feature-card {
  padding: 32px;
  background: linear-gradient(135deg, rgba(28, 31, 38, 0.5) 0%, rgba(20, 22, 27, 0.7) 100%);
  border: 1px solid rgba(199, 53, 72, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: rgba(199, 53, 72, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3), 0 0 24px rgba(199, 53, 72, 0.1);
}

.feature-card:hover .feature-icon {
  background: linear-gradient(135deg, rgba(199, 53, 72, 0.3) 0%, rgba(160, 32, 48, 0.4) 100%);
  transform: scale(1.05);
}

.feature-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(199, 53, 72, 0.2) 0%, rgba(160, 32, 48, 0.3) 100%);
  border-radius: 16px;
  color: var(--zurto-primary);
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}

.feature-card p {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    padding: 60px 32px;
  }
  
  .hero-content {
    max-width: 100%;
    text-align: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-visual {
    width: 100%;
    max-width: 500px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-description {
    font-size: 1.1rem;
  }
  
  .features-section {
    padding: 60px 24px;
  }
  
  .features-title {
    font-size: 2rem;
  }
}
</style>
