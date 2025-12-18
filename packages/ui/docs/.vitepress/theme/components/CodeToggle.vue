<template>
  <div class="code-toggle">
    <div class="preview-section">
      <slot />
    </div>

    <button @click="showCode = !showCode" class="toggle-code-btn">
      {{ showCode ? "✕ Hide Code" : "< > Show Code" }}
    </button>

    <div v-if="showCode" class="code-section">
      <pre><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  code: string;
}>();

const showCode = ref(false);
</script>

<style scoped>
.code-toggle {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.preview-section {
  padding: 32px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.toggle-code-btn {
  width: 100%;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border: none;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.toggle-code-btn:hover {
  background: rgba(199, 53, 72, 0.1);
  color: #ff6b7a;
}

.code-section {
  padding: 0;
  background: var(--vp-code-block-bg);
}

.code-section pre {
  margin: 0;
  padding: 20px;
  overflow-x: auto;
  background: transparent;
}

.code-section code {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-code-color);
}
</style>
