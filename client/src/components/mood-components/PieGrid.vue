<template>
  <div class="pie-grid-root">
    <div v-for="d in data" :key="d.name" class="pie-grid-cell">
      <div class="pie-grid-circle" :style="{ width: sizeFor(d.value) + 'px', height: sizeFor(d.value) + 'px', backgroundColor: d.color }">
        <span class="pie-grid-value">{{ d.value }}</span>
      </div>
      <span class="pie-grid-label">{{ d.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ data: { name: string; value: number; color: string }[] }>()

const maxValue = computed(() => Math.max(1, ...props.data.map(d => d.value || 0)))

function sizeFor(value: number) {
  const minSize = 40
  const maxSize = 90
  const ratio = value / maxValue.value
  return Math.round(minSize + ratio * (maxSize - minSize))
}
</script>

<style scoped>
.pie-grid-root {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  gap: 1.25rem;
  padding: 1.25rem 1rem;
}

.pie-grid-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.pie-grid-circle {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  transition: width 0.3s ease, height 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.pie-grid-value {
  font-size: 0.9rem;
}

.pie-grid-label {
  font-size: 0.75rem;
  color: #495057;
  font-weight: 600;
  text-align: center;
}
</style>
