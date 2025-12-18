<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  name: string;
  value: string;
  textColor?: string;
}>();

const isCopied = ref(false);

const copyColor = async () => {
  try {
    await navigator.clipboard.writeText(props.value);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};
</script>

<template>
  <div class="color-swatch" @click="copyColor">
    <div class="swatch-color" :style="{ backgroundColor: value }">
      <span class="copy-indicator" :class="{ visible: isCopied }">
        Copied!
      </span>
    </div>
    <div class="swatch-info">
      <span class="swatch-name">{{ name }}</span>
      <code class="swatch-value">{{ value }}</code>
    </div>
  </div>
</template>

<style scoped>
.color-swatch {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  cursor: pointer;
  transition: all 0.2s;
}

.color-swatch:hover {
  border-color: #3a3a3a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.swatch-color {
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-indicator {
  font-size: 12px;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  padding: 4px 12px;
  border-radius: 4px;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.2s;
}

.copy-indicator.visible {
  opacity: 1;
  transform: scale(1);
}

.swatch-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.swatch-name {
  font-size: 13px;
  font-weight: 500;
  color: #e0e0e0;
}

.swatch-value {
  font-size: 11px;
  color: #6b6b6b;
  font-family: "JetBrains Mono", monospace;
}
</style>
