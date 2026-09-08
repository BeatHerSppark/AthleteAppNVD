<template>
  <div v-if="recommendation" class="card w-100 recommendation-card h-100 mb-4" :class="typeClass">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h5 class="card-title theme-title mb-1">
            {{ recommendation.label }}
          </h5>
          <h6 class="text-muted small mb-2">
            Type:
            <span class="badge badge-type" :class="typeBadgeClass">{{ recommendation.type }}</span>
            &nbsp;&nbsp;
            Restriction:
            <span class="badge restriction-badge">{{ recommendation.restrictionLevel }}</span>
          </h6>
        </div>

        <div class="text-end">
          <span class="badge cost-badge">€{{ recommendation.costPerMonth }}/mo</span>
          <br />
          <small class="text-muted">Duration: {{ recommendation.durationWeeks }} weeks</small>
        </div>
      </div>

      <p class="mt-3 mb-2 text-body">
        {{ recommendation.description }}
      </p>

      <div class="mb-2">
        <strong>Target Goal:</strong> {{ recommendation.targetGoal }}
      </div>

      <div class="d-flex justify-content-between flex-wrap mt-3">
        <div>
          <strong>Frequency/Day:</strong> {{ recommendation.frequencyPerDay }}
        </div>
        <div>
          <strong>Effectiveness:</strong>
          <span class="badge effectiveness-badge">{{ recommendation.effectivenessRating }}/10</span>
        </div>
      </div>

      <div class="mt-3">
        <strong>Doctor Notes:</strong>
        <p class="fst-italic text-muted mb-0">{{ recommendation.doctorPersonalizedNotes }}</p>
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

const typeBadgeClass = computed(() => {
  switch ((props.recommendation?.type ?? '').toString().toUpperCase()) {
    case 'DIET': return 'badge-diet'
    case 'TRAINING': return 'badge-training'
    case 'SUPPLEMENT': return 'badge-supplement'
    default: return 'badge-secondary'
  }
})

const typeClass = computed(() => {
  switch ((props.recommendation?.type ?? '').toString().toUpperCase()) {
    case 'DIET': return 'type-diet'
    case 'TRAINING': return 'type-training'
    case 'SUPPLEMENT': return 'type-supplement'
    default: return ''
  }
})
</script>

<style scoped>
.recommendation-card {
  border-radius: var(--card-radius);
  border: none;
  overflow: hidden;
  box-shadow: var(--card-elev-shadow);
  background: var(--training-start);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.recommendation-card.type-training {
  background: var(--training-start);
  border-left: 6px solid var(--training-end);
}

.recommendation-card.type-diet {
  background: var(--diet-start);
  border-left: 6px solid var(--diet-end);
}

.recommendation-card.type-supplement {
  background: var(--supp-start);
  border-left: 6px solid var(--supp-end);
}

.recommendation-card .card-body {
  padding: 1.25rem;
}

.theme-title {
  color: var(--training-dark);
  font-weight: 700;
  margin: 0;
}

.recommendation-card.type-training .theme-title {
  color: var(--training-dark);
}

.recommendation-card.type-diet .theme-title {
  color: var(--diet-dark);
}

.recommendation-card.type-supplement .theme-title {
  color: var(--supp-dark);
}

.recommendation-card .badge {
  font-size: 0.8rem;
  padding: 0.45em 0.7em;
  border-radius: 999px;
  display: inline-block;
  font-weight: 600;
  box-shadow: none;
}

.recommendation-card .badge-diet {
  background: var(--diet-end);
  color: #fff;
  border: 0;
}

.recommendation-card .badge-training {
  background: var(--training-end);
  color: #fff;
  border: 0;
}

.recommendation-card .badge-supplement {
  background: var(--supp-end);
  color: #2b2b2b;
  border: 0;
}

.recommendation-card .restriction-badge {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.75);
  padding: 0.35em 0.6em;
  border-radius: 0.5rem;
}

.recommendation-card .cost-badge {
  background: rgba(255, 255, 255, 0.92);
  color: #222;
  font-weight: 700;
  padding: 0.35em 0.6em;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.recommendation-card.type-training .cost-badge {
  border-color: rgba(167, 201, 87, 0.25);
}

.recommendation-card.type-diet .cost-badge {
  border-color: rgba(43, 108, 176, 0.18);
}

.recommendation-card.type-supplement .cost-badge {
  border-color: rgba(255, 184, 77, 0.18);
}

.recommendation-card .effectiveness-badge {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.8);
  padding: 0.35em 0.6em;
  border-radius: 0.5rem;
}

.recommendation-card p.text-body {
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.45;
  margin-bottom: 0.5rem;
}

.recommendation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 36px rgba(56, 102, 65, 0.08);
}

.recommendation-card.type-training,
.recommendation-card.type-diet,
.recommendation-card.type-supplement {
  border-left-width: 6px !important;
  border-left-style: solid !important;
}

@media (max-width: 576px) {
  .recommendation-card .card-body {
    padding: 1rem;
  }

  .recommendation-card .card-title {
    font-size: 1.05rem;
  }
}
</style>
