/** * ============================================ * ENHANCED COMPONENT PREVIEW
COMPONENT * ============================================ * * Auto-loads and
renders component examples * Works with both code strings and component imports
*/

<template>
  <div class="zurto-preview">
    <!-- Preview Header -->
    <div class="zurto-preview__header">
      <span class="zurto-preview__label">{{ title || "Preview" }}</span>
      <div class="zurto-preview__controls">
        <button
          @click="copyCode"
          class="zurto-preview__btn"
          :class="{ 'is-copied': copied }"
        >
          {{ copied ? "✓ Copied" : "📋 Copy" }}
        </button>
        <button @click="toggleCode" class="zurto-preview__btn">
          {{ showCode ? "👁️ Hide Code" : "💻 Show Code" }}
        </button>
      </div>
    </div>

    <!-- Live Preview Area -->
    <div class="zurto-preview__viewport">
      <div class="zurto-preview__content" v-html="renderedPreview"></div>
    </div>

    <!-- Code Block (collapsible) -->
    <div v-if="showCode" class="zurto-preview__code">
      <pre><code>{{ cleanCode }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const props = defineProps<{
  title?: string;
  code?: string;
  component?: string; // Component name to auto-load
  height?: string;
}>();

const showCode = ref(false);
const copied = ref(false);
const renderedPreview = ref("");

const cleanCode = computed(() => {
  if (props.code) {
    return props.code.trim();
  }
  return "<div>No code provided</div>";
});

function toggleCode() {
  showCode.value = !showCode.value;
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(cleanCode.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

onMounted(() => {
  // For now, display code as HTML-safe preview
  // In production, you'd use a sandboxed iframe or similar
  const safeHtml = cleanCode.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  renderedPreview.value = `<div class="code-display">${safeHtml}</div>`;
});
</script>

<style scoped>
.zurto-preview {
  margin: 32px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}

.zurto-preview:hover {
  border-color: rgba(223, 62, 83, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Header */
.zurto-preview__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.zurto-preview__label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.5);
}

.zurto-preview__controls {
  display: flex;
  gap: 8px;
}

.zurto-preview__btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
}

.zurto-preview__btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(223, 62, 83, 0.5);
  color: #df3e53;
}

.zurto-preview__btn.is-copied {
  background: rgba(0, 212, 170, 0.2);
  border-color: #00d4aa;
  color: #00d4aa;
}

/* Viewport */
.zurto-preview__viewport {
  padding: 40px;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(10, 10, 10, 0.4) 100%
  );
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zurto-preview__content {
  width: 100%;
}

/* Code Block */
.zurto-preview__code {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: #000000;
}

.zurto-preview__code pre {
  margin: 0;
  padding: 20px;
  overflow-x: auto;
}

.zurto-preview__code code {
  font-family: "Monaco", "Menlo", "Consolas", monospace;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

/* Animations */
@keyframes slideDown {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 500px;
    opacity: 1;
  }
}

.zurto-preview__code {
  animation: slideDown 0.3s ease;
}
</style>
