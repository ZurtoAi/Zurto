<template>
  <div class="react-playground">
    <div class="playground-preview" ref="previewRef">
      <div class="preview-content" v-html="renderedPreview"></div>
    </div>

    <div class="playground-toolbar">
      <button
        @click="showCode = !showCode"
        class="toolbar-btn"
        :class="{ active: showCode }"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
        {{ showCode ? "Hide Code" : "Show Code" }}
      </button>
      <button @click="copyCode" class="toolbar-btn">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
          ></path>
        </svg>
        {{ copied ? "Copied!" : "Copy" }}
      </button>
      <button @click="resetCode" class="toolbar-btn" v-if="hasEdits">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
        Reset
      </button>
    </div>

    <div v-if="showCode" class="playground-code">
      <textarea
        v-model="editableCode"
        @input="handleCodeChange"
        class="code-editor"
        spellcheck="false"
      ></textarea>
    </div>

    <div v-if="error" class="playground-error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

const props = defineProps<{
  code: string;
  preview?: string;
}>();

const showCode = ref(false);
const copied = ref(false);
const error = ref("");
const editableCode = ref("");
const originalCode = ref("");
const renderedPreview = ref("");
const previewRef = ref<HTMLElement | null>(null);

const hasEdits = computed(() => editableCode.value !== originalCode.value);

onMounted(() => {
  // Decode HTML entities
  const decoded = props.code
    .replace(/&quot;/g, '"')
    .replace(/&#10;/g, "\n")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  editableCode.value = decoded;
  originalCode.value = decoded;
  renderedPreview.value = props.preview || "";
});

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(editableCode.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (e) {
    console.error("Copy failed", e);
  }
};

const resetCode = () => {
  editableCode.value = originalCode.value;
  error.value = "";
};

const handleCodeChange = () => {
  // For now, just syntax validation
  // Full live preview would need React runtime
  error.value = "";
};
</script>

<style scoped>
.react-playground {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.playground-preview {
  padding: 32px;
  background: linear-gradient(135deg, #0a0a0a 0%, #111 100%);
  border-bottom: 1px solid var(--vp-c-divider);
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-content {
  width: 100%;
}

.playground-toolbar {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
}

.toolbar-btn.active {
  background: rgba(199, 53, 72, 0.1);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.playground-code {
  background: #0d1117;
}

.code-editor {
  width: 100%;
  min-height: 200px;
  padding: 20px;
  background: transparent;
  border: none;
  color: #e6edf3;
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
}

.code-editor:focus {
  background: rgba(199, 53, 72, 0.02);
}

.playground-error {
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border-top: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  font-size: 13px;
  font-family: monospace;
}
</style>
