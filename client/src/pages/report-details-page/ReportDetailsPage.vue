<template>
  <div v-if="report" class="report-container">
    <header class="report-top">
      <div class="report-title">
        <h1>Report Details</h1>
      </div>
    </header>
    <div>
      <router-link :to="`/reports/${report.reportId}/document`" class="paper-view-button my-3">Check Paper View</router-link>
    </div>
    <div class="report-layout">
      <main class="report-main">
        <div class="card report-summary mb-3">
          <div class="card-body p-3 d-flex justify-content-between align-items-start gap-3">
            <div>
              <h2 class="mb-0 report-patient">{{ report.patient }}</h2>
              <div class="text-muted small mt-1">{{ report.doctor }}</div>
            </div>
            <div class="text-end">
              <StatusPill :status="report.status" fontSize="fs-6" />
              <div class="small text-muted mt-2">{{ formatDate(report.createdAt) }}</div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center">
          <h3 class="mt-4 mb-4">Summary</h3>
          <router-link :to="`/summary/${report.reportId}`" class="btn btn-outline-primary">Edit</router-link>
        </div>
        <div class="card report-card shadow-sm mb-4 px-2">
          <div class="card-body" v-html="summary?.summarizedContent"></div>
        </div>

        <div class="masonry">
          <div class="card report-card shadow-sm">
            <div class="card-header bg-primary text-white">General</div>
            <div class="card-body">
              <p><strong>Doctor:</strong> {{ report.doctor }}</p>
              <p><strong>VO₂ Max:</strong> {{ report.vo2Max }}</p>
              <p><strong>Avg Run/km:</strong> {{ report.averageRunPerKilometer }} min</p>
            </div>
          </div>

          <div class="card report-card shadow-sm">
            <div class="card-header bg-success text-white">Vitals</div>
            <div class="card-body">
              <p><strong>Resting HR:</strong> {{ report.restingHeartRate }} bpm</p>
              <p><strong>Pressure HR:</strong> {{ report.underPressureHeartRate }} bpm</p>
              <p><strong>Balance Time:</strong> {{ report.balanceTime }} s</p>
              <p><strong>Reaction Time:</strong> {{ report.reactionTime }} s</p>
            </div>
          </div>

          <div class="card report-card shadow-sm">
            <div class="card-header bg-info text-white">Strength & Flexibility</div>
            <div class="card-body">
              <p><strong>1RM Bench:</strong> {{ report.oneRepMaxBench ?? '–' }} kg</p>
              <p><strong>1RM Squat:</strong> {{ report.oneRepMaxSquat ?? '–' }} kg</p>
              <p><strong>Jump Height:</strong> {{ report.jumpHeight ?? '–' }} cm</p>
              <p><strong>Shoulder Flex:</strong> {{ report.shoulderFlexibility ?? '–' }}°</p>
            </div>
          </div>

          <div class="card report-card shadow-sm">
            <div class="card-header bg-warning text-dark">Body Composition</div>
            <div class="card-body">
              <p><strong>Body Fat:</strong> {{ report.bodyFatPercentage }}%</p>
              <p><strong>Lean Muscle:</strong> {{ report.leanMuscleMass ?? '–' }} kg</p>
              <p><strong>Bone Density:</strong> {{ report.boneDensity }} g/cm³</p>
            </div>
          </div>

          <div class="card report-card shadow-sm">
            <div class="card-header bg-danger text-white">Lab Results</div>
            <div class="card-body">
              <p><strong>Hemoglobin:</strong> {{ report.hemoglobin }} g/dL</p>
              <p><strong>Glucose:</strong> {{ report.glucose }} mg/dL</p>
              <p><strong>Creatinine:</strong> {{ report.creatinine }} mg/dL</p>
              <p><strong>Vitamin D:</strong> {{ report.vitaminD }} ng/mL</p>
              <p><strong>Iron:</strong> {{ report.iron }} µg/dL</p>
              <p><strong>Testosterone:</strong> {{ report.testosterone }} ng/dL</p>
              <p><strong>Cortisol:</strong> {{ report.cortisol }} nmol/L</p>
            </div>
          </div>
        </div>

        <h3 class="mt-4">Recommendations</h3>
        <hr>

        <div class="row">
          <div v-for="r in recommendations" :key="r.recommendationId" class="col-12 col-md-6 g-2">
            <RecommendationCard :recommendation="r" />
          </div>

          <div v-if="currentUserId === report.doctorId" class="col-12 col-md-6 g-2">
            <div
              class="card w-100 recommendation-card h-100 mb-4 add-recommendation-card"
              role="button"
              tabindex="0"
              @click="goToNewRecommendation"
              aria-label="Add recommendation">
              <div class="card-body d-flex align-items-center justify-content-center">
                <div class="text-center">
                  <div class="plus-circle mb-2">+</div>
                  <div class="small text-muted">Add recommendation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <aside class="d-flex flex-column align-items-center sticky-top" aria-hidden="true">
        <div class="visual-square" role="img" aria-label="Report icon">
          <svg viewBox="0 0 64 64" width="96" height="96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <rect x="6" y="4" width="44" height="56" rx="4" fill="none" stroke="#fff" stroke-width="2"/>
            <path d="M34 4v14a4 4 0 0 0 4 4h14" fill="none" stroke="#fff" stroke-width="2"/>
            <path d="M18 22h28M18 30h28M18 38h18" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { reportService } from '../../services/reportService'
import { recommendationService } from '../../services/recommendationService'
import { summaryService } from '../../services/summaryService'
import StatusPill from '../../components/status-pill/StatusPill.vue'
import RecommendationCard from '../../components/recommendation-components/RecommendationCard.vue'
import type { ReportDetails, Recommendation, Summary } from '../../types'

const route = useRoute()
const router = useRouter()
const { getCurrentUser } = useAuth()

const report = ref<ReportDetails | null>(null)
const recommendations = ref<Recommendation[]>([])
const summary = ref<Summary | null>(null)
const currentUserId = computed(() => getCurrentUser()?.personId ?? null)

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
  })
}

function goToNewRecommendation() {
  if (!report.value?.reportId) return
  router.push({ path: '/recommendations/new', query: { reportId: report.value.reportId } })
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) return
  const reportRes = await reportService.getReportById(id)
  report.value = reportRes.data
  const [recsRes, summaryRes] = await Promise.all([
    recommendationService.getRecommendationsByReportId(id),
    summaryService.getSummaryByReportId(id).catch(() => null)
  ])
  recommendations.value = recsRes.data
  summary.value = summaryRes?.data ?? null
})
</script>

<style scoped>
.paper-view-button {
  display: inline-block;
  text-decoration: none;
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: #fff !important;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  letter-spacing: 1px;
}

.report-container {
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

.report-top h1 {
  margin: 0 0 0.25rem 0;
  font-size: 1.6rem;
  color: var(--training-dark);
  letter-spacing: -0.2px;
}

.report-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
  align-items: start;
  margin-top: 1rem;
}

.report-main {
  min-width: 0;
}

.visual-square {
  width: 220px;
  height: 220px;
  border-radius: 12px;
  background: var(--training-end);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 28px rgba(56, 102, 65, 0.08);
  flex-shrink: 0;
}

.visual-square svg {
  display: block;
}

.report-summary {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(56, 102, 65, 0.06);
}

.report-patient {
  color: var(--training-dark);
  font-weight: 700;
  margin: 0;
}

.report-card {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.report-card .card-header.bg-primary {
  background: var(--training-end) !important;
  color: #fff !important;
  font-weight: 700;
}

.report-card .card-header.bg-success {
  background: var(--training-start) !important;
  color: var(--training-dark) !important;
  font-weight: 700;
}

.report-card .card-header.bg-info {
  background: var(--diet-end) !important;
  color: #fff !important;
  font-weight: 700;
}

.report-card .card-header.bg-warning {
  background: var(--supp-end) !important;
  color: #2b2b2b !important;
  font-weight: 700;
}

.report-card .card-header.bg-danger {
  background: #BC4749 !important;
  color: #fff !important;
  font-weight: 700;
}

.masonry {
  column-count: 2;
  column-gap: 1rem;
}

.masonry .card {
  display: inline-block;
  width: 100%;
  margin-bottom: 1rem;
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
}

.report-main h3 {
  margin-top: 1.5rem;
  color: var(--training-dark);
}

.report-card .card-body h2,
.report-card .card-body h3 {
  margin-top: 1rem;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  color: var(--training-dark);
}

.report-card .card-body p {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.report-card .card-body ul {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

@media (max-width: 991px) {
  .report-layout {
    grid-template-columns: 1fr 200px;
  }

  .visual-square {
    width: 180px;
    height: 180px;
  }
}

@media (max-width: 1100px) {
  .report-layout {
    grid-template-columns: 1fr;
  }

  aside {
    order: -1;
    margin-bottom: 1rem;
    justify-content: center;
  }

  .visual-square {
    width: 140px;
    height: 140px;
    margin: 0 auto;
  }

  .masonry {
    column-count: 1;
  }
}

.add-recommendation-card {
  border: 2px dashed rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform .12s ease, background-color .12s ease;
  display: flex;
  align-items: stretch;
}

.add-recommendation-card:hover {
  transform: translateY(-3px);
  background-color: #f8f9fa;
}

.add-recommendation-card .plus-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  line-height: 1;
  border: 2px solid rgba(13, 110, 253, 0.15);
  color: #0d6efd;
  margin: 0 auto;
}
</style>
