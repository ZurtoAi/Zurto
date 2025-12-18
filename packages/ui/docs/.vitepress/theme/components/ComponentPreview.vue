<script setup lang="ts">
import { ref, computed } from "vue";
import { Sandpack } from "sandpack-vue3";

const props = defineProps<{
  code: string;
  title?: string;
  showCode?: boolean;
  height?: string;
}>();

const showCodePanel = ref(props.showCode ?? true);
const isExpanded = ref(false);

const files = computed(() => ({
  "/App.tsx": {
    code: `import { ${extractImports(props.code)} } from '@zurto/ui'
import '@zurto/ui/styles.css'

export default function App() {
  return (
    <div className="preview-container">
      ${props.code}
    </div>
  )
}`,
    active: true,
  },
  "/styles.css": {
    code: `
.preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 24px;
  min-height: 100px;
  background: #0d0d0d;
  border-radius: 8px;
}
    `,
    hidden: true,
  },
}));

function extractImports(code: string): string {
  const componentRegex = /Z[A-Z][a-zA-Z]+/g;
  const matches = code.match(componentRegex) || [];
  return [...new Set(matches)].join(", ");
}

const customSetup = {
  dependencies: {
    "@zurto/ui": "latest",
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0",
  },
};

const options = computed(() => ({
  showNavigator: false,
  showTabs: false,
  showLineNumbers: true,
  editorHeight: isExpanded.value ? 400 : 200,
  wrapContent: true,
}));
</script>

<template>
  <div class="component-preview-wrapper">
    <div v-if="title" class="preview-header">
      <span class="preview-title">{{ title }}</span>
      <div class="preview-actions">
        <button
          class="preview-btn"
          @click="showCodePanel = !showCodePanel"
          :title="showCodePanel ? 'Hide code' : 'Show code'"
        >
          <svg
            v-if="showCodePanel"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          <svg
            v-else
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
        </button>
        <button
          class="preview-btn"
          @click="isExpanded = !isExpanded"
          :title="isExpanded ? 'Collapse' : 'Expand'"
        >
          <svg
            v-if="isExpanded"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="4 14 10 14 10 20"></polyline>
            <polyline points="20 10 14 10 14 4"></polyline>
            <line x1="14" y1="10" x2="21" y2="3"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </button>
      </div>
    </div>

    <Sandpack
      template="react-ts"
      theme="dark"
      :files="files"
      :customSetup="customSetup"
      :options="{
        ...options,
        showConsole: false,
        showConsoleButton: false,
        editorWidthPercentage: showCodePanel ? 50 : 0,
      }"
      :style="{
        '--sp-colors-surface1': '#0d0d0d',
        '--sp-colors-surface2': '#1a1a1a',
        '--sp-colors-surface3': '#252525',
        '--sp-colors-accent': '#df3e53',
        '--sp-colors-error': '#ff6b6b',
        '--sp-font-mono': 'JetBrains Mono, monospace',
        minHeight: height || '300px',
      }"
    />
  </div>
</template>

<style scoped>
.component-preview-wrapper {
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #2a2a2a;
  background: #0d0d0d;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
}

.preview-title {
  font-size: 14px;
  font-weight: 500;
  color: #e0e0e0;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.preview-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #252525;
  color: #a0a0a0;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-btn:hover {
  background: #333;
  color: #df3e53;
}
</style>
