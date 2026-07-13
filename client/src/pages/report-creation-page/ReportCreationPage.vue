<template>
  <div class="report-creation-page container py-4">
    <h2 class="mb-4">{{ isEditMode ? 'Edit Report' : 'Create New Report' }}</h2>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <form @submit.prevent="onSubmit">
      <!-- EMBG Autocomplete -->
      <div class="mb-3">
        <label for="embg" class="form-label">Patient EMBG</label>
        <div class="position-relative">
          <input
            id="embg"
            v-model="form.embg"
            type="text"
            class="form-control"
            placeholder="Enter EMBG to search..."
            @input="onEmbgInput"
            @focus="showDropdown = true"
            @blur="hideDropdownDelayed"
            autocomplete="off"
          />
          <ul v-if="showDropdown && embgResults.length > 0" class="dropdown-menu show w-100" @mousedown.prevent>
            <li
              v-for="patient in embgResults"
              :key="patient.patientId"
            >
              <a
                class="dropdown-item"
                href="#"
                @click.prevent="selectPatient(patient)"
              >
                {{ patient.name }} ({{ patient.gender }}, {{ patient.sportsmanCategory }})
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Patient Type -->
      <div class="mb-3">
        <label class="form-label d-block">Patient Type</label>
        <div class="form-check form-check-inline">
          <input
            id="patientTypeNew"
            v-model="patientType"
            type="radio"
            class="form-check-input"
            name="patientType"
            :value="true"
          />
          <label for="patientTypeNew" class="form-check-label">New patients</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            id="patientTypeAssigned"
            v-model="patientType"
            type="radio"
            class="form-check-input"
            name="patientType"
            :value="false"
          />
          <label for="patientTypeAssigned" class="form-check-label">Assigned patients</label>
        </div>
      </div>

      <!-- Status -->
      <div class="mb-3">
        <label for="status" class="form-label">Status</label>
        <select id="status" v-model="form.status" class="form-select" required>
          <option value="" disabled>Select status</option>
          <option value="GOOD">GOOD</option>
          <option value="IMPROVED">IMPROVED</option>
          <option value="FOLLOWUP">FOLLOWUP</option>
        </select>
      </div>

      <!-- Numeric Fields -->
      <div class="row">
        <div
          v-for="field in fields"
          :key="field.name"
          class="col-md-6 mb-3"
        >
          <label :for="field.name" class="form-label">
            {{ field.label }}
            <span v-if="field.required" class="text-danger">*</span>
          </label>
          <input
            :id="field.name"
            v-model.number="form[field.name]"
            type="number"
            class="form-control"
            :step="field.step"
            :min="field.min"
            :max="field.max"
            :required="field.required"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-success" :disabled="submitting">
          <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
          {{ isEditMode ? 'Update Report' : 'Create Report' }}
        </button>
        <router-link to="/reports" class="btn btn-outline-secondary">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { reportService } from '../../services/reportService'
import { patientService } from '../../services/patientService'
import { useAuth } from '../../composables/useAuth'
import type { ReportForm, PatientDTO } from '../../types'

const router = useRouter()
const route = useRoute()
const { getCurrentUser } = useAuth()

const reportId = Number(route.params.id)
const isEditMode = !isNaN(reportId)

const submitting = ref(false)
const error = ref<string | null>(null)

// EMBG autocomplete
const embgResults = ref<PatientDTO[]>([])
const showDropdown = ref(false)
const patientType = ref(true)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Reactive form object
const form = ref<ReportForm>({
  doctorId: getCurrentUser()?.personId ?? 0,
  embg: '',
  status: 'GOOD',
  vo2Max: 0,
  restingHeartRate: 0,
  underPressureHeartRate: 0,
  bodyFatPercentage: 0,
  leanMuscleMass: undefined,
  boneDensity: 0,
  height: 0,
  weight: 0,
  oneRepMaxBench: undefined,
  oneRepMaxSquat: undefined,
  oneRepMaxDeadlift: undefined,
  jumpHeight: undefined,
  averageRunPerKilometer: 0,
  shoulderFlexibility: undefined,
  hipFlexibility: undefined,
  balanceTime: 0,
  reactionTime: 0,
  coreStabilityScore: 0,
  hemoglobin: 0,
  glucose: 0,
  creatinine: 0,
  vitaminD: 0,
  iron: 0,
  testosterone: 0,
  cortisol: 0
})

// Field definitions
const fields = [
  { name: 'vo2Max' as const, label: 'VO2 Max', type: 'number', step: 0.01, required: true, min: 0, max: 100 },
  { name: 'restingHeartRate' as const, label: 'Resting Heart Rate', type: 'number', step: 1, required: true, min: 20, max: 250 },
  { name: 'underPressureHeartRate' as const, label: 'Under Pressure Heart Rate', type: 'number', step: 1, required: true, min: 50, max: 250 },
  { name: 'bodyFatPercentage' as const, label: 'Body Fat %', type: 'number', step: 0.1, required: true, min: 0, max: 100 },
  { name: 'leanMuscleMass' as const, label: 'Lean Muscle Mass', type: 'number', step: 0.1, min: 0, max: 100 },
  { name: 'boneDensity' as const, label: 'Bone Density', type: 'number', step: 0.01, required: true, min: 0, max: 5 },
  { name: 'height' as const, label: 'Height', type: 'number', step: 0.1, required: true, min: 50, max: 300 },
  { name: 'weight' as const, label: 'Weight', type: 'number', step: 0.1, required: true, min: 2, max: 500 },
  { name: 'oneRepMaxBench' as const, label: 'One Rep Max Bench', type: 'number', step: 0.1, min: 0, max: 500 },
  { name: 'oneRepMaxSquat' as const, label: 'One Rep Max Squat', type: 'number', step: 0.1, min: 0, max: 1000 },
  { name: 'oneRepMaxDeadlift' as const, label: 'One Rep Max Deadlift', type: 'number', step: 0.1, min: 0, max: 1500 },
  { name: 'jumpHeight' as const, label: 'Jump Height', type: 'number', step: 0.1, min: 0, max: 100 },
  { name: 'averageRunPerKilometer' as const, label: 'Average Run per KM', type: 'number', step: 0.01, required: true, min: 60, max: 1000 },
  { name: 'shoulderFlexibility' as const, label: 'Shoulder Flexibility', type: 'number', step: 1, min: 0, max: 360 },
  { name: 'hipFlexibility' as const, label: 'Hip Flexibility', type: 'number', step: 1, min: 0, max: 360 },
  { name: 'balanceTime' as const, label: 'Balance Time', type: 'number', step: 0.1, required: true, min: 0, max: 100 },
  { name: 'reactionTime' as const, label: 'Reaction Time', type: 'number', step: 0.001, required: true, min: 0, max: 100 },
  { name: 'coreStabilityScore' as const, label: 'Core Stability Score', type: 'number', step: 1, required: true, min: 0, max: 100 },
  { name: 'hemoglobin' as const, label: 'Hemoglobin', type: 'number', step: 0.1, required: true, min: 0, max: 100 },
  { name: 'glucose' as const, label: 'Glucose', type: 'number', step: 0.1, required: true, min: 0, max: 100 },
  { name: 'creatinine' as const, label: 'Creatinine', type: 'number', step: 0.01, required: true, min: 0, max: 100 },
  { name: 'vitaminD' as const, label: 'Vitamin D', type: 'number', step: 0.1, required: true, min: 0, max: 100 },
  { name: 'iron' as const, label: 'Iron', type: 'number', step: 0.1, required: true, min: 0, max: 100 },
  { name: 'testosterone' as const, label: 'Testosterone', type: 'number', step: 0.1, required: true, min: 0, max: 100 },
  { name: 'cortisol' as const, label: 'Cortisol', type: 'number', step: 0.1, required: true, min: 0, max: 100 }
]

function onEmbgInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    const query = form.value.embg.trim()
    if (query.length < 3) {
      embgResults.value = []
      showDropdown.value = false
      return
    }
    try {
      const doctorId = getCurrentUser()?.personId
      if (!doctorId) return
      const res = await patientService.searchPatientsByEmbg(query, patientType.value, doctorId)
      embgResults.value = res.data.content
      showDropdown.value = true
    } catch {
      embgResults.value = []
    }
  }, 300)
}

function hideDropdownDelayed() {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

function selectPatient(patient: PatientDTO) {
  form.value.embg = patient.embg
  embgResults.value = []
  showDropdown.value = false
}

async function onSubmit() {
  submitting.value = true
  error.value = null

  try {
    if (isEditMode) {
      await reportService.updateReport(reportId, form.value)
      router.push(`/reports/${reportId}`)
    } else {
      const res = await reportService.createReport(form.value)
      const newReportId = res.data
      router.push(`/recommendations/new?reportId=${newReportId}`)
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to save report. Please check all required fields.'
  } finally {
    submitting.value = false
  }
}

// Load existing report in edit mode
onMounted(async () => {
  if (isEditMode) {
    try {
      const res = await reportService.getReportById(reportId)
      const r = res.data
      form.value = {
        doctorId: r.doctorId,
        embg: r.embg,
        status: r.status,
        vo2Max: r.vo2Max,
        restingHeartRate: r.restingHeartRate,
        underPressureHeartRate: r.underPressureHeartRate,
        bodyFatPercentage: r.bodyFatPercentage,
        leanMuscleMass: r.leanMuscleMass ?? undefined,
        boneDensity: r.boneDensity,
        height: r.height,
        weight: r.weight,
        oneRepMaxBench: r.oneRepMaxBench ?? undefined,
        oneRepMaxSquat: r.oneRepMaxSquat ?? undefined,
        oneRepMaxDeadlift: r.oneRepMaxDeadlift ?? undefined,
        jumpHeight: r.jumpHeight ?? undefined,
        averageRunPerKilometer: r.averageRunPerKilometer,
        shoulderFlexibility: r.shoulderFlexibility ?? undefined,
        hipFlexibility: r.hipFlexibility ?? undefined,
        balanceTime: r.balanceTime,
        reactionTime: r.reactionTime,
        coreStabilityScore: r.coreStabilityScore,
        hemoglobin: r.hemoglobin,
        glucose: r.glucose,
        creatinine: r.creatinine,
        vitaminD: r.vitaminD,
        iron: r.iron,
        testosterone: r.testosterone,
        cortisol: r.cortisol
      }
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to load report.'
    }
  }
})
</script>

<style scoped>
.report-creation-page {
  max-width: 900px;
}

.dropdown-menu {
  max-height: 200px;
  overflow-y: auto;
}
</style>
