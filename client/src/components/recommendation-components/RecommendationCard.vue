<template>
  <div class="recommendation-card card h-100">
    <div class="card-header d-flex justify-content-between align-items-center" :class="typeClass">
      <span class="fw-bold">{{ recommendation.type }}</span>
      <span class="badge" :class="restrictionClass">{{ recommendation.restrictionLevel }}</span>
    </div>
    <div class="card-body">
      <h5 class="card-title">{{ recommendation.label }}</h5>
      <p class="card-text text-muted small">{{ recommendation.description }}</p>
      <div class="row g-2 mt-3">
        <div class="col-6">
          <small class="text-muted d-block">Cost/Month</small>
          <span class="fw-semibold">${{ recommendation.costPerMonth }}</span>
        </div>
        <div class="col-6">
          <small class="text-muted d-block">Duration</small>
          <span class="fw-semibold">{{ recommendation.durationWeeks }} weeks</span>
        </div>
        <div class="col-6">
          <small class="text-muted d-block">Frequency</small>
          <span class="fw-semibold">{{ recommendation.frequencyPerDay }}x/day</span>
        </div>
        <div class="col-6">
          <small class="text-muted d-block">Effectiveness</small>
          <span class="fw-semibold">{{ recommendation.effectivenessRating ?? '-' }}/10</span>
        </div>
      </div>
      <div class="mt-3">
        <small class="text-muted d-block">Target Goal</small>
        <p class="small mb-0">{{ recommendation.targetGoal }}</p>
      </div>
      <div class="mt-3" v-if="recommendation.doctorPersonalizedNotes">
        <small class="text-muted d-block">Doctor's Notes</small>
        <p class="small mb-0 fst-italic">{{ recommendation.doctorPersonalizedNotes }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Recommendation } from '../../types'

const props = defineProps<{
  recommendation: Recommendation
}>()

const typeClass = computed(() => {
  switch (props.recommendation.type) {
    case 'TRAINING': return 'bg-primary text-white'
    case 'DIET': return 'bg-success text-white'
    case 'SUPPLEMENT': return 'bg-warning text-dark'
    default: return 'bg-secondary text-white'
  }
})

const restrictionClass = computed(() => {
  switch (props.recommendation.restrictionLevel) {
    case 'NORMAL': return 'bg-success'
    case 'HARD': return 'bg-warning text-dark'
    case 'EXTREME': return 'bg-danger'
    default: return 'bg-secondary'
  }
})
</script>

<style scoped>
.recommendation-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.recommendation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
  border-radius: 12px 12px 0 0;
}
</style>
