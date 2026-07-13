<template>
  <div class="report-details-page container-fluid py-4">
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

    <!-- Content -->
    <template v-else-if="report">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Report Details</h2>
        <router-link
          :to="`/reports/${reportId}/document`"
          class="btn btn-outline-success"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text me-1" viewBox="0 0 16 16">
            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"/>
            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6.5v1H3v12h10V4.5h-2V3z"/>
          </svg>
          Check Paper View
        </router-link>
      </div>

      <!-- Report Info -->
      <div class="row mb-4">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-6 mb-2">
                  <strong class="text-muted d-block">Patient</strong>
                  {{ report.patient }}
                </div>
                <div class="col-sm-6 mb-2">
                  <strong class="text-muted d-block">Doctor</strong>
                  {{ report.doctor }}
                </div>
                <div class="col-sm-6 mb-2">
                  <strong class="text-muted d-block">Status</strong>
                  <StatusPill :status="report.status" />
                </div>
                <div class="col-sm-6 mb-2">
                  <strong class="text-muted d-block">Created</strong>
                  {{ formatDate(report.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Right sidebar: SVG document icon -->
        <div class="col-md-4 d-flex align-items-center justify-content-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="#386641" class="bi bi-file-earmark-medical" viewBox="0 0 16 16">
            <path d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5zm-1 5.5H8v1H7v-1H6V9h1V8h1v1h1v.5zM11 4H4.5a.5.5 0 0 0-.5.5V12a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V4z"/>
            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6.5v1H3v12h10V4.5h-2V3z"/>
            <path d="M10.854 4.146a.5.5 0 0 1 0 .708L8.707 7l2.147 2.146a.5.5 0 0 1-.708.708L7.293 7 5.146 4.854a.5.5 0 1 1 .708-.708L7.293 5.5l2.147-2.146a.5.5 0 0 1 .708 0z"/>
          </svg>
        </div>
      </div>

      <!-- Summary Section -->
      <div v-if="summary" class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Summary</h5>
          <router-link
            :to="`/summary/${reportId}`"
            class="btn btn-sm btn-outline-secondary"
          >
            Edit
          </router-link>
        </div>
        <div class="card-body">
          <div v-html="summary.summarizedContent"></div>
        </div>
      </div>
      <div v-else-if="!summaryLoading" class="card mb-4">
        <div class="card-body text-muted">No summary available.</div>
      </div>

      <!-- Masonry Grid of Metric Cards -->
      <div class="row mb-4">
        <!-- General Card -->
        <div class="col-md-6 col-lg-4 mb-3">
          <div class="card h-100">
            <div class="card-header bg-success text-white">
              <h6 class="mb-0">General</h6>
            </div>
            <div class="card-body">
              <p class="mb-1"><strong>VO2 Max:</strong> {{ report.vo2Max.toFixed(2) }}</p>
              <p class="mb-1"><strong>Avg Run/km:</strong> {{ report.averageRunPerKilometer.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- Vitals Card -->
        <div class="col-md-6 col-lg-4 mb-3">
          <div class="card h-100">
            <div class="card-header bg-info text-white">
              <h6 class="mb-0">Vitals</h6>
            </div>
            <div class="card-body">
              <p class="mb-1"><strong>Resting HR:</strong> {{ report.restingHeartRate }}</p>
              <p class="mb-1"><strong>Balance Time:</strong> {{ report.balanceTime }}s</p>
              <p class="mb-1"><strong>Reaction Time:</strong> {{ report.reactionTime.toFixed(3) }}s</p>
            </div>
          </div>
        </div>

        <!-- Strength & Flexibility Card -->
        <div class="col-md-6 col-lg-4 mb-3">
          <div class="card h-100">
            <div class="card-header bg-warning">
              <h6 class="mb-0">Strength & Flexibility</h6>
            </div>
            <div class="card-body">
              <p v-if="report.oneRepMaxBench != null" class="mb-1"><strong>1RM Bench:</strong> {{ report.oneRepMaxBench }}</p>
              <p v-if="report.oneRepMaxSquat != null" class="mb-1"><strong>1RM Squat:</strong> {{ report.oneRepMaxSquat }}</p>
              <p v-if="report.oneRepMaxDeadlift != null" class="mb-1"><strong>1RM Deadlift:</strong> {{ report.oneRepMaxDeadlift }}</p>
              <p v-if="report.shoulderFlexibility != null" class="mb-1"><strong>Shoulder Flex:</strong> {{ report.shoulderFlexibility }}</p>
              <p v-if="report.hipFlexibility != null" class="mb-1"><strong>Hip Flex:</strong> {{ report.hipFlexibility }}</p>
              <p v-if="report.jumpHeight != null" class="mb-1"><strong>Jump Height:</strong> {{ report.jumpHeight }}</p>
            </div>
          </div>
        </div>

        <!-- Body Composition Card -->
        <div class="col-md-6 col-lg-4 mb-3">
          <div class="card h-100">
            <div class="card-header bg-secondary text-white">
              <h6 class="mb-0">Body Composition</h6>
            </div>
            <div class="card-body">
              <p class="mb-1"><strong>Body Fat:</strong> {{ report.bodyFatPercentage }}%</p>
              <p v-if="report.leanMuscleMass != null" class="mb-1"><strong>Lean Muscle:</strong> {{ report.leanMuscleMass }}</p>
              <p class="mb-1"><strong>Bone Density:</strong> {{ report.boneDensity }}</p>
              <p class="mb-1"><strong>Height:</strong> {{ report.height }} cm</p>
              <p class="mb-1"><strong>Weight:</strong> {{ report.weight }} kg</p>
            </div>
          </div>
        </div>

        <!-- Lab Results Card -->
        <div class="col-md-6 col-lg-4 mb-3">
          <div class="card h-100">
            <div class="card-header bg-danger text-white">
              <h6 class="mb-0">Lab Results</h6>
            </div>
            <div class="card-body">
              <p class="mb-1"><strong>Hemoglobin:</strong> {{ report.hemoglobin }}</p>
              <p class="mb-1"><strong>Glucose:</strong> {{ report.glucose }}</p>
              <p class="mb-1"><strong>Creatinine:</strong> {{ report.creatinine }}</p>
              <p class="mb-1"><strong>Vitamin D:</strong> {{ report.vitaminD }}</p>
              <p class="mb-1"><strong>Iron:</strong> {{ report.iron }}</p>
              <p class="mb-1"><strong>Testosterone:</strong> {{ report.testosterone }}</p>
              <p class="mb-1"><strong>Cortisol:</strong> {{ report.cortisol }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <h4 class="mb-3">Recommendations</h4>
      <div v-if="recommendations.length > 0" class="row mb-4">
        <div v-for="rec in recommendations" :key="rec.recommendationId" class="col-md-6 col-lg-4 mb-3">
          <RecommendationCard :recommendation="rec" />
        </div>
      </div>
      <div v-else class="card mb-4">
        <div class="card-body text-muted">No recommendations yet.</div>
      </div>

      <!-- Add recommendation card (only for the report's doctor) -->
      <div v-if="currentUserId === report.doctorId" class="card mb-4 border-dashed">
        <div class="card-body text-center py-4">
          <p class="mb-3 text-muted">Want to add a recommendation?</p>
          <router-link
            :to="`/recommendations/new?reportId=${reportId}`"
            class="btn btn-success"
          >
            Add Recommendation
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { reportService } from '../../services/reportService'
import { recommendationService } from '../../services/recommendationService'
import { summaryService } from '../../services/summaryService'
import StatusPill from '../../components/status-pill/StatusPill.vue'
import RecommendationCard from '../../components/recommendation-components/RecommendationCard.vue'
import type { ReportDetails, Recommendation, Summary } from '../../types'

const route = useRoute()
const { getCurrentUser } = useAuth()

const reportId = computed(() => Number(route.params.id))
const report = ref<ReportDetails | null>(null)
const recommendations = ref<Recommendation[]>([])
const summary = ref<Summary | null>(null)
const summaryLoading = ref(true)
const loading = ref(true)
const error = ref<string | null>(null)
const currentUserId = computed(() => getCurrentUser()?.personId ?? null)

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
    const [reportRes, recsRes, summaryRes] = await Promise.all([
      reportService.getReportById(reportId.value),
      recommendationService.getRecommendationsByReportId(reportId.value),
      summaryService.getSummaryByReportId(reportId.value).catch(() => null)
    ])
    report.value = reportRes.data
    recommendations.value = recsRes.data
    if (summaryRes?.data) {
      summary.value = summaryRes.data
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to load report.'
  } finally {
    loading.value = false
    summaryLoading.value = false
  }
})
</script>

<style scoped>
.border-dashed {
  border-style: dashed !important;
  border-color: #386641 !important;
}

.card-header {
  font-weight: 600;
}
</style>
