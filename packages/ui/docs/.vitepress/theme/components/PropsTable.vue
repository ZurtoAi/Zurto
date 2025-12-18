<script setup lang="ts">
interface Prop {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

defineProps<{
  props: Prop[];
}>();
</script>

<template>
  <div class="props-table-wrapper">
    <table class="props-table">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prop in props" :key="prop.name">
          <td class="prop-name">
            <code>{{ prop.name }}</code>
            <span v-if="prop.required" class="required-badge">Required</span>
          </td>
          <td class="prop-type">
            <code>{{ prop.type }}</code>
          </td>
          <td class="prop-default">
            <code v-if="prop.default">{{ prop.default }}</code>
            <span v-else class="no-default">–</span>
          </td>
          <td class="prop-description">{{ prop.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.props-table-wrapper {
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #2a2a2a;
}

.props-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.props-table th {
  text-align: left;
  padding: 12px 16px;
  background: #1a1a1a;
  color: #a0a0a0;
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #2a2a2a;
}

.props-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #1a1a1a;
  vertical-align: top;
}

.props-table tr:last-child td {
  border-bottom: none;
}

.props-table tr:hover td {
  background: rgba(223, 62, 83, 0.03);
}

.prop-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prop-name code {
  color: #df3e53;
  background: rgba(223, 62, 83, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.required-badge {
  font-size: 10px;
  color: #ff9f43;
  background: rgba(255, 159, 67, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 600;
}

.prop-type code {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.prop-default code {
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.no-default {
  color: #4a4a4a;
}

.prop-description {
  color: #b0b0b0;
  line-height: 1.5;
}
</style>
