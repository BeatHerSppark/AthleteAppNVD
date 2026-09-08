<template>
  <div class="pie-chart-root">
    <svg viewBox="0 0 200 200" width="220" height="220">
      <template v-if="total > 0">
        <path v-for="(s, i) in slices" :key="i" :d="s.path" :fill="s.color" stroke="#fff" stroke-width="1" />
      </template>
      <circle v-else cx="100" cy="100" r="90" fill="#e9ecef" />
      <text v-for="(s, i) in slices" :key="'label-' + i" :x="s.labelX" :y="s.labelY"
        text-anchor="middle" dominant-baseline="middle" class="slice-label">
        {{ s.percent }}%
      </text>
    </svg>
    <div class="pie-legend">
      <div v-for="d in data" :key="d.name" class="legend-item">
        <span class="legend-swatch" :style="{ backgroundColor: d.color }"></span>
        <span>{{ d.name }} ({{ d.value }})</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ data: { name: string; value: number; color: string }[] }>()

const total = computed(() => props.data.reduce((sum, d) => sum + (d.value || 0), 0))

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`
}

const slices = computed(() => {
  if (total.value <= 0) return []
  let angle = 0
  return props.data
    .filter(d => d.value > 0)
    .map(d => {
      const sweep = (d.value / total.value) * 360
      const startAngle = angle
      const endAngle = angle + sweep
      angle = endAngle
      const mid = (startAngle + endAngle) / 2
      const labelPos = polarToCartesian(100, 100, 60, mid)
      return {
        path: arcPath(100, 100, 90, startAngle, endAngle),
        color: d.color,
        percent: Math.round((d.value / total.value) * 100),
        labelX: labelPos.x,
        labelY: labelPos.y
      }
    })
})
</script>

<style scoped>
.pie-chart-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.slice-label {
  font-size: 11px;
  font-weight: 600;
  fill: #fff;
  pointer-events: none;
}

.pie-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #333;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.legend-swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
}
</style>
