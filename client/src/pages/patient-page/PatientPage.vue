<template>
  <div v-if="patient" class="d-flex align-items-center mb-4">
    <div
      class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
    >
      {{ avatarName }}
    </div>
    <h1 class="fw-semibold mb-0">{{ patient.name }}</h1>
  </div>

  <div class="container-fluid">
    <div class="row mt-4">
      <h3 class="section-title mb-3">Recommendations</h3>

      <template v-if="loadingRecommendations">
        <div class="text-center text-muted">Loading recommendations...</div>
      </template>
      <template v-else-if="recommendations.length > 0">
        <div class="row g-3">
          <div
            v-for="r in recommendations"
            :key="r.recommendationId"
            class="recommendation-card col-md-12 col-lg-6 col-xxl-4"
          >
            <RecommendationCard :recommendation="r" />
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="currentUser?.role === 'PATIENT'">
          <div class="empty-placeholder card-modern p-4 text-center">
            <div class="fw-medium text-muted">No reports yet</div>
          </div>
        </template>
        <template v-else>
          <div
            class="add-recommendation-card h-100 d-flex flex-column justify-content-center align-items-center rounded-4 border border-dashed"
            role="button"
            tabindex="0"
            aria-label="Add recommendation"
            @click="goToCreateReport"
          >
            <div class="text-center p-4">
              <div class="plus-circle mb-2">+</div>
              <div class="fw-medium text-muted">Create Report</div>
            </div>
          </div>
        </template>
      </template>
    </div>

    <div class="row mt-5">
      <h3 class="section-title mb-3">Reports</h3>

      <div class="col-md-9">
        <div class="card-modern p-3 h-100 d-flex flex-column">
          <ReportsTable :id="patientId ?? undefined" class="flex-grow-1" />
          <div class="text-end mt-3">
            <button class="btn-modern" @click="goToAllReports">All Reports</button>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card-modern h-100 d-flex align-items-center justify-content-center">
          <template v-if="averageScore !== null && averageScore > 0">
            <MoodGauge :value="averageScore" />
          </template>
          <template v-else>
            <div class="text-center text-secondary">
              <h3>
                No mood information is provided for now, check when a new mood entry is stored.
              </h3>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { patientService } from '../../services/patientService'
import { recommendationService } from '../../services/recommendationService'
import { moodService } from '../../services/moodService'
import type { PatientDTO, Recommendation } from '../../types'
import MoodGauge from '../../components/patient-components/MoodGauge.vue'

const RecommendationCard = defineAsyncComponent(
  () => import('../../components/recommendation-components/RecommendationCard.vue')
)
const ReportsTable = defineAsyncComponent(
  () => import('../../components/report-components/ReportsTable.vue')
)

const router = useRouter()
const route = useRoute()
const { currentUser } = useAuth()

const patient = ref<PatientDTO | null>(null)
const patientId = ref<number | null>(null)
const avatarName = ref('')
const recommendations = ref<Recommendation[]>([])
const loadingRecommendations = ref(false)
const averageScore = ref<number | null>(null)

function setAvatarName() {
  if (patient.value) {
    const name = patient.value.name.split(' ')
    if (name.length >= 2) {
      avatarName.value = `${name[0][0].toUpperCase()}${name[1][0].toUpperCase()}`
    } else if (name.length === 1) {
      avatarName.value = name[0][0].toUpperCase()
    }
  }
}

function goToCreateReport() {
  if (patient.value) {
    router.push({ path: '/reports/new', query: { embg: patient.value.embg } })
  } else {
    router.push('/reports/new')
  }
}

function goToAllReports() {
  router.push('/reports')
}

onMounted(async () => {
  const user = currentUser.value
  if (!user) return

  let id: number | null = null

  if (user.role === 'PATIENT') {
    id = user.personId
  } else {
    const idParam = route.params.id
    if (idParam) {
      id = Number(idParam)
    }
  }

  if (!id) return
  patientId.value = id

  try {
    const patientRes = await patientService.getPatientById(id)
    patient.value = patientRes.data
    setAvatarName()

    if (user.role === 'PATIENT' && router.currentRoute.value.path !== '/patient') {
      router.replace('/patient')
    }
  } catch (err) {
    console.error('Failed to load patient:', err)
    return
  }

  // Load mood data
  try {
    const moodsRes = await moodService.getMoodsForSpecificPatient(id)
    const moods = moodsRes.data
    if (moods && moods.length > 0) {
      const total = moods.reduce(
        (acc, m) => acc + (m.moodDescriptionScore ?? 0),
        0
      )
      averageScore.value = Math.round((total / moods.length) * 100) / 100
    } else {
      averageScore.value = -1
    }
  } catch (err) {
    console.error('Failed to load mood data:', err)
    averageScore.value = null
  }

  // Load recommendations
  loadingRecommendations.value = true
  try {
    const recsRes = await recommendationService.getLatestRecommendations(id)
    recommendations.value = recsRes.data ?? []
  } catch (err) {
    console.error('Failed to load recommendations:', err)
    recommendations.value = []
  } finally {
    loadingRecommendations.value = false
  }
})
</script>

<style scoped>
.section-title {
  font-weight: 600;
  font-size: 1.25rem;
  color: #2c4731;
}

.avatar {
  width: 48px;
  height: 48px;
  font-size: 1.1rem;
  font-weight: 600;
  background: #386641;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-modern {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.add-recommendation-card {
  background: #f6faf7;
  border-radius: 16px;
  border: 2px dashed #a4b8a4;
  color: #6c757d;
  transition: all 0.2s ease;
}

.add-recommendation-card:hover {
  background: #e9f3eb;
  border-color: #386641;
  cursor: pointer;
}

.plus-circle {
  width: 48px;
  height: 48px;
  background: #386641;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-modern {
  background: #386641;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-modern:hover {
  background: #2c4f32;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(56, 102, 65, 0.25);
}

.empty-placeholder {
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 1rem;
}
</style>
