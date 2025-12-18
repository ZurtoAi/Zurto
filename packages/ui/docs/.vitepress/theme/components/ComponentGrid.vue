<template>
  <div class="component-grid-container">
    <div class="grid-header">
      <h2 class="grid-title">{{ title }}</h2>
      <p class="grid-subtitle">{{ subtitle }}</p>
    </div>
    <div class="component-grid" :class="gridClass">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  subtitle: String,
  columns: {
    type: Number,
    default: 3,
  },
});

const gridClass = computed(() => {
  const cols = props.columns || 3;
  return `grid-cols-${cols}`;
});
</script>

<style scoped>
.component-grid-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 24px;
}

.grid-header {
  text-align: center;
  margin-bottom: 48px;
}

.grid-title {
  font-size: 3rem;
  font-weight: 900;
  background: var(--zurto-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.grid-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto;
}

.component-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
}

.component-grid.grid-cols-2 {
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
}

.component-grid.grid-cols-3 {
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
}

.component-grid.grid-cols-4 {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

@media (max-width: 1200px) {
  .component-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .component-grid-container {
    padding: 32px 16px;
  }

  .grid-header {
    margin-bottom: 32px;
  }

  .grid-title {
    font-size: 2rem;
  }

  .grid-subtitle {
    font-size: 1.05rem;
  }

  .component-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
