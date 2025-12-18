<template>
  <div class="category-card" :class="{ 'is-large': isLarge }">
    <div class="category-header">
      <component :is="iconComponent" class="category-icon" :size="iconSize" />
      <h3 class="category-title">{{ title }}</h3>
      <span class="component-count"
        >{{ componentCount }}
        {{ componentCount === 1 ? "component" : "components" }}</span
      >
    </div>

    <div class="category-preview">
      <slot name="preview">
        <!-- Preview content goes here -->
      </slot>
    </div>

    <a :href="link" class="category-link">
      <span>Explore {{ title }}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M6 12L10 8L6 4"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import * as LucideIcons from "lucide-vue-next";

const props = defineProps<{
  title: string;
  componentCount: number;
  icon: string;
  link: string;
  isLarge?: boolean;
}>();

const iconComponent = computed(() => {
  return LucideIcons[props.icon] || LucideIcons.Box;
});

const iconSize = computed(() => (props.isLarge ? 32 : 24));
</script>

<style scoped>
.category-card {
  background: linear-gradient(
    135deg,
    rgba(28, 31, 38, 0.95) 0%,
    rgba(20, 22, 27, 0.98) 100%
  );
  border: 1px solid rgba(199, 53, 72, 0.2);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 280px;
}

.category-card.is-large {
  min-height: 360px;
  grid-column: span 2;
}

.category-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--zurto-primary) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-card:hover {
  border-color: var(--zurto-primary);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(199, 53, 72, 0.15),
    0 0 40px rgba(199, 53, 72, 0.1);
}

.category-card:hover::before {
  opacity: 1;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-icon {
  color: var(--zurto-primary);
  flex-shrink: 0;
}

.category-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  flex: 1;
}

.component-count {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(199, 53, 72, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(199, 53, 72, 0.2);
}

.category-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  margin-bottom: 16px;
  min-height: 120px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.category-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(
    135deg,
    var(--zurto-primary-dark) 0%,
    var(--zurto-primary) 100%
  );
  border-radius: 8px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: auto;
}

.category-link:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(199, 53, 72, 0.3);
  background: linear-gradient(
    135deg,
    var(--zurto-primary) 0%,
    var(--zurto-primary-light) 100%
  );
  color: #ffffff;
}

.category-link svg {
  transition: transform 0.3s ease;
}

.category-link:hover svg {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .category-card.is-large {
    grid-column: span 1;
    min-height: 280px;
  }

  .category-title {
    font-size: 1.1rem;
  }
}
</style>
