<template>
  <div :form="form" class="card mb-3">
    <div class="card-body">
      <div class="row g-3">
        <input type="hidden" v-model.number="form.reportId" />

        <div class="col-md-4">
          <label class="form-label">Type</label>
          <select class="form-select" v-model="form.type">
            <option value="">Select type</option>
            <option value="TRAINING">TRAINING</option>
            <option value="DIET">DIET</option>
            <option value="SUPPLEMENT">SUPPLEMENT</option>
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label">Restriction Level</label>
          <select class="form-select" v-model="form.restrictionLevel">
            <option value="">Select restriction</option>
            <option value="NORMAL">NORMAL</option>
            <option value="HARD">HARD</option>
            <option value="EXTREME">EXTREME</option>
          </select>
        </div>

        <div class="col-12">
          <label class="form-label">Label</label>
          <input type="text" class="form-control" v-model="form.label" maxlength="70" placeholder="Short title (max 70 chars)" />
          <div class="form-text">Keep it short and descriptive.</div>
        </div>

        <div class="col-12">
          <label class="form-label">Description</label>
          <textarea class="form-control" rows="4" v-model="form.description" maxlength="2000" placeholder="Describe the recommendation"></textarea>
        </div>

        <div class="col-md-4">
          <label class="form-label">Cost / month (€)</label>
          <input type="number" class="form-control" v-model.number="form.costPerMonth" min="0" step="1" />
        </div>

        <div class="col-md-4">
          <label class="form-label">Duration (weeks)</label>
          <input type="number" class="form-control" v-model.number="form.durationWeeks" min="1" step="1" />
        </div>

        <div class="col-md-4">
          <label class="form-label">Frequency / day</label>
          <input type="number" class="form-control" v-model.number="form.frequencyPerDay" min="0" step="1" />
        </div>

        <div class="col-12">
          <label class="form-label">Target Goal</label>
          <textarea class="form-control" rows="2" v-model="form.targetGoal" maxlength="2000" placeholder="What is the desired outcome?"></textarea>
        </div>

        <div class="col-md-6">
          <label class="form-label">Effectiveness (0–10)</label>
          <input type="number" class="form-control" v-model.number="form.effectivenessRating" min="0" max="10" step="1" />
          <div class="form-text">Estimate how effective this recommendation is on a 0–10 scale.</div>
        </div>

        <div class="col-md-6">
          <label class="form-label">Doctor's notes</label>
          <textarea class="form-control" rows="3" v-model="form.doctorPersonalizedNotes" maxlength="2000" placeholder="Notes for the patient (required)"></textarea>
        </div>

        <div class="col-12 d-flex justify-content-end">
          <button class="btn btn-sm btn-outline-danger" type="button" @click="$emit('remove')">Remove</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecommendationFormDTO } from '../../types'

const form = defineModel<RecommendationFormDTO>({ required: true })

defineEmits<{ remove: [] }>()
</script>

<style scoped>
.card { border-radius: 8px; }
</style>
