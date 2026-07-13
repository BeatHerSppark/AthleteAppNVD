<template>
  <div class="line-chart-container">
    <h5 class="text-center">Mood Progress Over Time</h5>
    <div v-if="chartData.length > 0" class="chart-visual">
      <div v-for="(point, i) in chartData" :key="i" class="chart-point"
        :style="{ bottom: `${point.yPercent}%`, left: `${point.xPercent}%` }"
        :title="point.label">
        <div class="point-dot" :class="point.class"></div>
        <span class="point-label">{{ point.label }}</span>
      </div>
      <svg class="chart-line" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline :points="linePoints" fill="none" stroke="#386641" stroke-width="2" />
      </svg>
    </div>
    <div v-else class="text-center text-muted">No progress data available</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MoodStatistics } from '../../types'

const props = defineProps<{ moodStatistics: MoodStatistics | null }>()

const moodToNumber: Record<string, number> = { BAD: 0, STALL: 1, GOOD: 2 }
const numberToLabel: Record<number, string> = { 0: 'Bad', 1: 'Stall', 2: 'Good' }
const numberToClass: Record<number, string> = { 0: 'point-bad', 1: 'point-stall', 2: 'point-good' }

const sortedData = computed(() => {
  if (!props.moodStatistics?.progressOverTime) return []
  return [...props.moodStatistics.progressOverTime]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(d => ({ date: new Date(d.date), value: moodToNumber[d.progress] ?? 1, label: numberToLabel[moodToNumber[d.progress] ?? 1] }))
})

const chartData = computed(() => {
  if (sortedData.value.length === 0) return []
  const minDate = sortedData.value[0].date.getTime()
  const maxDate = sortedData.value[sortedData.value.length - 1].date.getTime()
  const range = maxDate - minDate || 1
  return sortedData.value.map(d => ({
    xPercent: ((d.date.getTime() - minDate) / range) * 90 + 5,
    yPercent: (d.value / 2) * 80 + 10,
    label: numberToLabel[d.value],
    class: numberToClass[d.value]
  }))
})

const linePoints = computed(() => {
  return chartData.value.map(p => `${p.xPercent},${100 - p.yPercent}`).join(' ')
})
</script>

<style scoped>
.line-chart-container {
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.chart-visual {
  position: relative;
  height: 200px;
  border-left: 2px solid #ddd;
  border-bottom: 2px solid #ddd;
  margin: 1rem;
}

.chart-point {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, 50%);
}

.point-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-bottom: 4px;
}

.point-bad { background: #ee5a52; }
.point-stall { background: #339af0; }
.point-good { background: #37b24d; }

.point-label {
  font-size: 0.65rem;
  color: #666;
  white-space: nowrap;
}

.chart-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
