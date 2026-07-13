<template>
  <div class="mood-gauge" :style="{ width: '300px', height: '180px' }">
    <svg width="300" height="180" viewBox="0 0 300 180">
      <!-- Background arc -->
      <path
        d="M 30 150 A 120 120 0 0 1 270 150"
        fill="none"
        stroke="#6d6d6d"
        :stroke-width="8"
        stroke-linecap="round"
      />
      <!-- Progress arc -->
      <path
        d="M 30 150 A 120 120 0 0 1 270 150"
        fill="none"
        :stroke="moodParams.color"
        :stroke-width="8"
        stroke-linecap="round"
        :stroke-dasharray="`${progress} ${circumference}`"
        style="transition: stroke-dasharray 0.5s ease"
      />
      <!-- Value label -->
      <text
        x="150"
        y="140"
        text-anchor="middle"
        :font-size="36"
        font-weight="bold"
        :fill="moodParams.color"
      >
        {{ value.toFixed(1) }}
      </text>
      <!-- Label -->
      <text
        x="150"
        y="165"
        text-anchor="middle"
        :font-size="16"
        :fill="moodParams.color"
      >
        {{ moodParams.label }}
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ value: number }>()

const circumference = Math.PI * 120

const progress = computed(() => {
  return (props.value / 10) * circumference
})

const moodParams = computed(() => {
  if (props.value <= 3) return { color: '#ef4444', label: 'BAD' }
  if (props.value <= 7) return { color: '#f59e0b', label: 'STALL' }
  return { color: '#22c55e', label: 'GOOD' }
})
</script>

<style scoped>
.mood-gauge {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
