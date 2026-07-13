<template>
  <div class="paper-view">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading report...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Report -->
    <template v-else-if="report">
      <div class="paper-header d-flex justify-content-between align-items-center mb-4 no-print">
        <router-link to="/reports" class="btn btn-outline-success">
          Back to Report
        </router-link>
        <button class="btn btn-outline-secondary" @click="printReport">
          Print
        </button>
      </div>

      <div class="paper-title text-center mb-4">
        <h1>Athlete Health Report</h1>
        <p class="text-muted">Generated {{ formatDate(report.createdAt) }}</p>
      </div>

      <!-- Patient Info -->
      <section class="paper-section mb-4">
        <h2 class="section-title">Patient Information</h2>
        <div class="row">
          <div class="col-sm-6 mb-2">
            <strong>Patient:</strong> {{ report.patient }}
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Doctor:</strong> {{ report.doctor }}
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Status:</strong> {{ report.status }}
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Created:</strong> {{ formatDate(report.createdAt) }}
          </div>
        </div>
      </section>

      <!-- Physical Metrics -->
      <section class="paper-section mb-4">
        <h2 class="section-title">Physical Metrics</h2>
        <div class="row">
          <div class="col-sm-6 mb-2">
            <strong>VO2 Max:</strong> {{ report.vo2Max.toFixed(2) }}
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Resting Heart Rate:</strong> {{ report.restingHeartRate }} bpm
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Under Pressure HR:</strong> {{ report.underPressureHeartRate }} bpm
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Avg Run per KM:</strong> {{ report.averageRunPerKilometer.toFixed(2) }}
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Height:</strong> {{ report.height }} cm
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Weight:</strong> {{ report.weight }} kg
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Body Fat:</strong> {{ report.bodyFatPercentage }}%
          </div>
          <div class="col-sm-6 mb-2" v-if="report.leanMuscleMass != null">
            <strong>Lean Muscle Mass:</strong> {{ report.leanMuscleMass }}
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Bone Density:</strong> {{ report.boneDensity }}
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Balance Time:</strong> {{ report.balanceTime }}s
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Reaction Time:</strong> {{ report.reactionTime.toFixed(3) }}s
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Core Stability:</strong> {{ report.coreStabilityScore }}
          </div>
          <div class="col-sm-6 mb-2" v-if="report.shoulderFlexibility != null">
            <strong>Shoulder Flexibility:</strong> {{ report.shoulderFlexibility }}
          </div>
          <div class="col-sm-6 mb-2" v-if="report.hipFlexibility != null">
            <strong>Hip Flexibility:</strong> {{ report.hipFlexibility }}
          </div>
        </div>
      </section>

      <!-- Strength Metrics -->
      <section class="paper-section mb-4">
        <h2 class="section-title">Strength Metrics</h2>
        <div class="row">
          <div class="col-sm-6 mb-2" v-if="report.oneRepMaxBench != null">
            <strong>One Rep Max Bench:</strong> {{ report.oneRepMaxBench }} kg
          </div>
          <div class="col-sm-6 mb-2" v-if="report.oneRepMaxSquat != null">
            <strong>One Rep Max Squat:</strong> {{ report.oneRepMaxSquat }} kg
          </div>
          <div class="col-sm-6 mb-2" v-if="report.oneRepMaxDeadlift != null">
            <strong>One Rep Max Deadlift:</strong> {{ report.oneRepMaxDeadlift }} kg
          </div>
          <div class="col-sm-6 mb-2" v-if="report.jumpHeight != null">
            <strong>Jump Height:</strong> {{ report.jumpHeight }} cm
          </div>
          <div v-if="!hasAnyStrengthMetric" class="col-12 text-muted">
            No strength metrics recorded.
          </div>
        </div>
      </section>

      <!-- Lab Results -->
      <section class="paper-section mb-4">
        <h2 class="section-title">Lab Results</h2>
        <div class="row">
          <div class="col-sm-6 mb-2">
            <strong>Hemoglobin:</strong> {{ report.hemoglobin }}
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Glucose:</strong> {{ report.glucose }}
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Creatinine:</strong> {{ report.creatinine }}
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Vitamin D:</strong> {{ report.vitaminD }}
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Iron:</strong> {{ report.iron }}
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Testosterone:</strong> {{ report.testosterone }}
          </div>
          <div class="col-sm-6 mb-2">
            <strong>Cortisol:</strong> {{ report.cortisol }}
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { reportService } from '../../services/reportService'
import type { ReportDetails } from '../../types'

const route = useRoute()
const reportId = computed(() => Number(route.params.id))
const report = ref<ReportDetails | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const hasAnyStrengthMetric = computed(() => {
  if (!report.value) return false
  return (
    report.value.oneRepMaxBench != null ||
    report.value.oneRepMaxSquat != null ||
    report.value.oneRepMaxDeadlift != null ||
    report.value.jumpHeight != null
  )
})

function printReport() {
  window.print()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  try {
    const res = await reportService.getReportById(reportId.value)
    report.value = res.data
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to load report.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.paper-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Times New Roman', Times, serif;
  color: #1a1a1a;
}

.section-title {
  font-size: 1.25rem;
  border-bottom: 2px solid #386641;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  color: #386641;
}

.paper-title h1 {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.paper-section .row > div {
  padding: 0.25rem 0;
}

@media print {
  .no-print {
    display: none !important;
  }

  .paper-view {
    max-width: none;
    padding: 0;
  }

  .paper-section {
    page-break-inside: avoid;
  }

  .section-title {
    border-bottom-color: #000;
  }
}
</style>
