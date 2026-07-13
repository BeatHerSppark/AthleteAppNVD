<template>
  <div class="container mt-4">
    <h2>Create Recommendation(s)</h2>

    <form @submit.prevent="onSubmit" class="mt-3">
      <div v-for="(rec, i) in forms" :key="i">
        <RecommendationForm :model-value="rec" @update:model-value="forms[i] = $event" @remove="removeForm(i)" />
      </div>

      <div class="mt-3">
        <button class="btn btn-primary" type="submit" :disabled="submitting || !allValid">
          {{ submitting ? 'Saving...' : 'Create All Recommendations' }}
        </button>
        <button class="btn btn-outline-secondary ms-2" type="button" @click="cancel">Cancel</button>
      </div>
    </form>

    <button class="btn btn-success add-btn" type="button" @click="addForm">+ Add recommendation</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { recommendationService } from '../../services/recommendationService'
import RecommendationForm from '../../components/recommendation-components/RecommendationForm.vue'

import type { RecommendationFormDTO, RecommendationType, RestrictionLevel } from '../../types'

const router = useRouter()
const route = useRoute()

const forms = ref<RecommendationFormDTO[]>([])
const reportId = ref<number | null>(null)
const submitting = ref(false)

const allValid = computed(() => {
  return forms.value.every(f => f.label && f.description && f.targetGoal && f.doctorPersonalizedNotes && f.type && f.restrictionLevel)
})

function createEmptyForm(): RecommendationFormDTO {
  return {
    reportId: reportId.value ?? 0,
    type: 'TRAINING' as RecommendationType,
    restrictionLevel: 'NORMAL' as RestrictionLevel,
    label: '',
    description: '',
    costPerMonth: 0,
    durationWeeks: 1,
    frequencyPerDay: 0,
    targetGoal: '',
    effectivenessRating: 0,
    doctorPersonalizedNotes: ''
  }
}

function addForm() {
  forms.value.push(createEmptyForm())
  setTimeout(() => {
    const cards = document.querySelectorAll('.card')
    if (cards.length) {
      const el = cards[cards.length - 1] as HTMLElement
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 50)
}

function removeForm(index: number) {
  if (forms.value.length <= 1) {
    forms.value.splice(index, 1)
    if (forms.value.length === 0) addForm()
  } else {
    forms.value.splice(index, 1)
  }
}

function cancel() {
  router.push(`/reports/${reportId.value ?? ''}`)
}

function onSubmit() {
  if (!allValid.value) {
    forms.value.forEach(f => {
      if (!f.label) f.label = ' '
      if (!f.description) f.description = ' '
      if (!f.targetGoal) f.targetGoal = ' '
      if (!f.doctorPersonalizedNotes) f.doctorPersonalizedNotes = ' '
    })
    return
  }
  submitting.value = true
  const calls = forms.value.map(r => recommendationService.createRecommendation(r).catch(err => {
    console.error('createRecommendation failed', r, err)
    return null
  }))
  Promise.all(calls).then(() => {
    submitting.value = false
    router.push(`/summary/${reportId.value}`)
  }).catch(err => {
    console.error('Error creating recommendations', err)
    submitting.value = false
  })
}

onMounted(() => {
  const rid = Number(route.query.reportId)
  if (rid) {
    reportId.value = rid
    addForm()
  }
})
</script>

<style scoped>
.add-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1100;
  border-radius: 999px;
  padding: 10px 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}
</style>
