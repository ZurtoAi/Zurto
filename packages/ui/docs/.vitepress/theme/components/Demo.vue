<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  code: string;
  height?: string;
  editable?: boolean;
}>();

const editableCode = ref(props.code.trim());
const isCopied = ref(false);
const showCode = ref(true);
const activeTab = ref<"preview" | "code">("preview");

watch(
  () => props.code,
  (newCode) => {
    editableCode.value = newCode.trim();
  }
);

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(editableCode.value);
    isCopied.value = true;
    setTimeout(() => (isCopied.value = false), 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

const handleCodeInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  editableCode.value = target.value;
};

// Extract component names for display
const extractComponents = computed(() => {
  const regex = /<(Z[A-Z][a-zA-Z]*)/g;
  const matches = [...editableCode.value.matchAll(regex)];
  return [...new Set(matches.map((m) => m[1]))];
});

const lineCount = computed(() => editableCode.value.split("\n").length);
</script>

<template>
  <div class="demo-block">
    <!-- Tab Header -->
    <div class="demo-header">
      <div class="demo-tabs">
        <button
          class="demo-tab"
          :class="{ active: activeTab === 'preview' }"
          @click="activeTab = 'preview'"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          Preview
        </button>
        <button
          class="demo-tab"
          :class="{ active: activeTab === 'code' }"
          @click="activeTab = 'code'"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          Code
        </button>
      </div>
      <div class="demo-actions">
        <span v-if="extractComponents.length" class="component-tags">
          <span
            v-for="comp in extractComponents"
            :key="comp"
            class="component-tag"
          >
            {{ comp }}
          </span>
        </span>
        <button
          class="action-btn"
          @click="copyCode"
          :title="isCopied ? 'Copied!' : 'Copy code'"
        >
          <svg
            v-if="!isCopied"
            width="14"
            height="14"
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
          <svg
            v-else
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="check-icon"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- Preview Panel -->
    <div
      v-show="activeTab === 'preview'"
      class="demo-preview"
      :style="{ minHeight: height || '120px' }"
    >
      <div class="preview-content">
        <slot>
          <div class="preview-placeholder">
            <span class="placeholder-icon">🎨</span>
            <span class="placeholder-text">Live preview renders here</span>
          </div>
        </slot>
      </div>
    </div>

    <!-- Code Panel -->
    <div v-show="activeTab === 'code'" class="demo-code">
      <div class="code-wrapper">
        <div class="line-numbers">
          <span v-for="n in lineCount" :key="n">{{ n }}</span>
        </div>
        <textarea
          v-if="editable"
          :value="editableCode"
          @input="handleCodeInput"
          class="code-editor"
          spellcheck="false"
        />
        <pre v-else class="code-display"><code>{{ editableCode }}</code></pre>
      </div>
    </div>

    <!-- Editable indicator -->
    <div v-if="editable && activeTab === 'code'" class="editable-indicator">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        ></path>
        <path
          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        ></path>
      </svg>
      Editable
    </div>
  </div>
</template>

<style scoped>
.demo-block {
  position: relative;
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #0d0d0d;
  border: 1px solid #2a2a2a;
}

.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #151515;
  border-bottom: 1px solid #2a2a2a;
}

.demo-tabs {
  display: flex;
  gap: 4px;
}

.demo-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #6b6b6b;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.demo-tab:hover {
  color: #a0a0a0;
}

.demo-tab.active {
  color: #df3e53;
  border-bottom-color: #df3e53;
}

.demo-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.component-tags {
  display: flex;
  gap: 6px;
}

.component-tag {
  font-size: 11px;
  color: #df3e53;
  background: rgba(223, 62, 83, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
  font-family: "JetBrains Mono", monospace;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #6b6b6b;
  background: transparent;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  color: #fff;
  border-color: #df3e53;
  background: rgba(223, 62, 83, 0.1);
}

.check-icon {
  color: #22c55e;
}

.demo-preview {
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0d0d0d 0%, #151515 100%);
}

.preview-content {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #4a4a4a;
}

.placeholder-icon {
  font-size: 32px;
}

.placeholder-text {
  font-size: 13px;
}

.demo-code {
  background: #0a0a0a;
  max-height: 400px;
  overflow: auto;
}

.code-wrapper {
  display: flex;
  min-height: 100%;
}

.line-numbers {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  min-width: 48px;
  text-align: right;
  background: #080808;
  border-right: 1px solid #1a1a1a;
  user-select: none;
  position: sticky;
  left: 0;
}

.line-numbers span {
  padding: 0 12px;
  font-size: 12px;
  line-height: 1.7;
  color: #3a3a3a;
  font-family: "JetBrains Mono", monospace;
}

.code-editor,
.code-display {
  flex: 1;
  padding: 16px;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 13px;
  line-height: 1.7;
  color: #e0e0e0;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  white-space: pre;
  overflow-x: auto;
  margin: 0;
}

.code-editor:focus {
  background: rgba(223, 62, 83, 0.02);
}

.code-display code {
  font-family: inherit;
}

.editable-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #4a4a4a;
  background: #1a1a1a;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
