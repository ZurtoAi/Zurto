<script setup lang="ts">
import { ref, watch, computed } from "vue";

const props = defineProps<{
  code: string;
  language?: string;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: "update", code: string): void;
}>();

const editableCode = ref(props.code);
const isCopied = ref(false);

watch(
  () => props.code,
  (newCode) => {
    editableCode.value = newCode;
  }
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  editableCode.value = target.value;
  emit("update", target.value);
};

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(editableCode.value);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

const lineNumbers = computed(() => {
  return editableCode.value.split("\n").map((_, i) => i + 1);
});
</script>

<template>
  <div class="live-editor">
    <div class="editor-header">
      <span class="language-badge">{{ language || "tsx" }}</span>
      <div class="editor-actions">
        <span v-if="!readonly" class="editable-hint">Editable</span>
        <button class="copy-btn" @click="copyCode">
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
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {{ isCopied ? "Copied!" : "Copy" }}
        </button>
      </div>
    </div>
    <div class="editor-body">
      <div class="line-numbers">
        <span v-for="num in lineNumbers" :key="num">{{ num }}</span>
      </div>
      <textarea
        v-model="editableCode"
        @input="handleInput"
        :readonly="readonly"
        class="code-textarea"
        spellcheck="false"
      />
    </div>
  </div>
</template>

<style scoped>
.live-editor {
  border-radius: 8px;
  overflow: hidden;
  background: #0d0d0d;
  border: 1px solid #2a2a2a;
  font-family: "JetBrains Mono", "Fira Code", monospace;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
}

.language-badge {
  font-size: 12px;
  color: #df3e53;
  background: rgba(223, 62, 83, 0.15);
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 500;
}

.editor-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.editable-hint {
  font-size: 11px;
  color: #6b6b6b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 12px;
  color: #a0a0a0;
  background: transparent;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  color: #fff;
  border-color: #df3e53;
}

.editor-body {
  display: flex;
  min-height: 120px;
  max-height: 400px;
  overflow: auto;
}

.line-numbers {
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  min-width: 40px;
  text-align: right;
  background: #0a0a0a;
  border-right: 1px solid #2a2a2a;
  user-select: none;
}

.line-numbers span {
  padding: 0 12px;
  font-size: 13px;
  line-height: 1.6;
  color: #4a4a4a;
}

.code-textarea {
  flex: 1;
  padding: 12px;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.6;
  color: #e0e0e0;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
}

.code-textarea:read-only {
  cursor: default;
}

.code-textarea:not(:read-only):focus {
  background: rgba(223, 62, 83, 0.03);
}
</style>
