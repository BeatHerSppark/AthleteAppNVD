<template>
  <div style="width: 450px; margin-right: 10px">
    <div class="d-flex flex-column align-items-center profile-card">
      <div class="card border-0 shadow-lg" style="background: linear-gradient(135deg, #F2E8CF 0%, #ffffff 100%); border-radius: 20px; overflow: hidden;">
        <div class="card-header border-0 py-4" style="background: linear-gradient(135deg, #386641 0%, #6A994E 100%);">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div class="d-flex align-items-center gap-3">
              <div class="position-relative">
                <img :src="patient?.gender === 'MALE' ? '/assets/icons/male-icon.png' : '/assets/icons/female-icon.png'"
                  alt="Profile" class="rounded-circle shadow"
                  style="width: 80px; height: 80px; border: 4px solid rgba(255,255,255,0.3);"
                  @error="(e: Event) => { const t = e.target as HTMLElement; t.style.display = 'none' }" />
                <div class="position-absolute bottom-0 end-0 bg-success rounded-circle border border-3 border-white"
                  style="width: 24px; height: 24px;"></div>
              </div>
              <div class="text-white">
                <h2 class="mb-2 text-uppercase fw-bold" style="letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                  {{ patient?.name }}
                </h2>
                <span class="badge rounded-pill px-3 py-2 fw-semibold me-2"
                  :style="{ backgroundColor: patient?.gender === 'MALE' ? 'rgba(255,255,255,0.2)' : '#BC4749', color: 'white', backdropFilter: 'blur(10px)' }">
                  {{ patient?.gender === 'MALE' ? 'Male' : 'Female' }}
                </span>
              </div>
            </div>
            <div class="badge rounded-pill px-4 py-3 fw-semibold text-white"
              style="background: linear-gradient(45deg, #A7C957, #6A994E); backdropFilter: blur(10px); font-size: 14px;">
              {{ patient?.sportsmanCategory }}
            </div>
          </div>
        </div>

        <div class="card-body bg-white p-4">
          <div class="row mb-3 py-3 border-bottom align-items-center" style="border-color: rgba(168, 201, 87, 0.3) !important;">
            <div class="col-sm-4">
              <div class="d-flex align-items-center">
                <span class="fw-semibold text-uppercase small" style="color: #386641; letter-spacing: 1px;">Email Address</span>
              </div>
            </div>
            <div class="col-sm-8 text-sm-end">
              <span class="fw-semibold" style="color: #6A994E;">{{ patient?.email }}</span>
            </div>
          </div>
          <div class="row mb-3 py-3 border-bottom align-items-center" style="border-color: rgba(168, 201, 87, 0.3) !important;">
            <div class="col-sm-4">
              <div class="d-flex align-items-center">
                <span class="fw-semibold text-uppercase small" style="color: #386641; letter-spacing: 1px;">Date of Birth</span>
              </div>
            </div>
            <div class="col-sm-8 text-sm-end">
              <span class="fw-semibold" style="color: #6A994E;">{{ formatDate(patient?.dateOfBirth) }}</span>
            </div>
          </div>
          <div class="row py-3 align-items-center text-center">
            <div><h5 style="color: #386641; letter-spacing: 1px;">Assigned Doctor Info</h5></div>
            <hr>
            <div class="col">
              <span class="fw-semibold" :style="{ color: patient?.doctor ? '#6A994E' : '#224228' }">{{ patient?.doctor }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="moodStatistics" class="mood-stats-container">
        <div class="switch-controls mb-4 text-center">
          <div class="switch-container">
            <button class="switch-btn" :class="{ active: view === 'pie' }" @click="view = 'pie'">
              <i class="bi bi-pie-chart-fill"></i>
            </button>
            <button class="switch-btn" :class="{ active: view === 'table' }" @click="view = 'table'">
              <i class="bi bi-table"></i>
            </button>
          </div>
        </div>

        <div class="stats-section">
          <h4 class="section-title">{{ view === 'pie' ? 'Progress Percentage PIE Chart' : 'Progress Percentage Statistics' }}</h4>
          <div v-if="view === 'table'" class="stats-grid">
            <div class="mood-card mood-progress-card">
              <div class="mood-badge mood-bad"><i class="bi bi-emoji-frown me-2"></i><span>BAD</span></div>
              <p class="mood-count">{{ moodStatistics.moodProgressCounts['BAD'] ?? 0 }}</p>
            </div>
            <div class="mood-card mood-progress-card">
              <div class="mood-badge mood-stall"><i class="bi bi-pause-circle me-2"></i><span>STALL</span></div>
              <p class="mood-count">{{ moodStatistics.moodProgressCounts['STALL'] ?? 0 }}</p>
            </div>
            <div class="mood-card mood-progress-card">
              <div class="mood-badge mood-good"><i class="bi bi-emoji-smile me-2"></i><span>GOOD</span></div>
              <p class="mood-count">{{ moodStatistics.moodProgressCounts['GOOD'] ?? 0 }}</p>
            </div>
          </div>
          <div v-if="view === 'pie'" class="chart-wrapper">
            <div class="simple-pie-chart">
              <div v-for="(entry, i) in progressPieData" :key="i" class="pie-segment"
                :style="{ backgroundColor: entry.color, flex: entry.value || 1 }">
                <span class="pie-label">{{ entry.name }}: {{ entry.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-section">
          <h4 class="section-title">{{ view === 'pie' ? 'Emotion Percentage PIE Chart' : 'Emotion Percentage Statistics' }}</h4>
          <div v-if="view === 'table'" class="row emotions-grid gap-3 justify-content-center text-center">
            <div v-for="e in emotionData" :key="e.name" class="mood-card emotion-card col-3">
              <div class="mood-badge d-flex justify-content-center" :class="e.badgeClass">
                <i :class="e.icon" class="me-2"></i><span>{{ e.name }}</span>
              </div>
              <p class="mood-count">{{ e.value }}</p>
            </div>
          </div>
          <div v-if="view === 'pie'" class="chart-wrapper">
            <div class="simple-pie-chart">
              <div v-for="(entry, i) in emotionPieData" :key="i" class="pie-segment"
                :style="{ backgroundColor: entry.color, flex: entry.value || 1 }">
                <span class="pie-label">{{ entry.name }}: {{ entry.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <LineChartComponent :moodStatistics="moodStatistics" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { patientService } from '../../services/patientService'
import { moodService } from '../../services/moodService'
import { useAuth } from '../../composables/useAuth'
import type { Patient, MoodStatistics } from '../../types'
import LineChartComponent from './LineChartComponent.vue'

const route = useRoute()
const auth = useAuth()
const patient = ref<Patient>()
const moodStatistics = ref<MoodStatistics>()
const view = ref<'pie' | 'table'>('pie')

const progressPieData = computed(() => {
  if (!moodStatistics.value) return []
  return [
    { name: 'Good', value: moodStatistics.value.moodProgressCounts['GOOD'] ?? 0, color: '#37b24d' },
    { name: 'Stall', value: moodStatistics.value.moodProgressCounts['STALL'] ?? 0, color: '#339af0' },
    { name: 'Bad', value: moodStatistics.value.moodProgressCounts['BAD'] ?? 0, color: '#ee5a52' }
  ]
})

const emotionPieData = computed(() => {
  if (!moodStatistics.value) return []
  const colors: Record<string, string> = {
    HAPPY: '#51cf66', EXCITED: '#ffd43b', NEUTRAL: '#868e96',
    TIRED: '#7986cb', STRESSED: '#ef4444', SAD: '#2563eb'
  }
  return Object.entries(moodStatistics.value.moodEmotionCounts).map(([name, value]) => ({
    name, value, color: colors[name] || '#868e96'
  }))
})

const emotionData = computed(() => {
  if (!moodStatistics.value) return []
  const icons: Record<string, string> = {
    HAPPY: 'bi bi-emoji-smile', EXCITED: 'bi bi-stars', NEUTRAL: 'bi bi-emoji-neutral',
    TIRED: 'bi bi-moon-stars', STRESSED: 'bi bi-exclamation-circle', SAD: 'bi bi-emoji-frown'
  }
  const badges: Record<string, string> = {
    HAPPY: 'badge-happy', EXCITED: 'badge-excited', NEUTRAL: 'badge-neutral',
    TIRED: 'badge-tired', STRESSED: 'badge-stressed', SAD: 'badge-sad'
  }
  return Object.entries(moodStatistics.value.moodEmotionCounts).map(([name, value]) => ({
    name, value, icon: icons[name], badgeClass: badges[name]
  }))
})

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(() => {
  const patientId = Number(route.params.id) || auth.getCurrentUser()?.personId
  if (!patientId) return
  patientService.getPatientById(patientId).then(res => {
    patient.value = res.data
    return moodService.getMoodStatistics(patientId)
  }).then(res => {
    moodStatistics.value = res.data
  })
})
</script>

<style scoped>
.profile-card { width: 450px; }

.mood-stats-container {
  width: 450px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: linear-gradient(135deg, #E3F2FD 0%, #90CAF9 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.mood-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.mood-badge {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  text-align: center;
}

.mood-bad { background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: white; }
.mood-stall { background: linear-gradient(135deg, #74c0fc, #339af0); color: white; }
.mood-good { background: linear-gradient(135deg, #51cf66, #37b24d); color: white; }
.badge-happy { background: #51cf66; color: white; }
.badge-excited { background: #ffd43b; color: #333; }
.badge-neutral { background: #868e96; color: white; }
.badge-tired { background: #7986cb; color: white; }
.badge-stressed { background: #ef4444; color: white; }
.badge-sad { background: #2563eb; color: white; }

.mood-count {
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0;
  color: #495057;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  justify-items: center;
}

.section-title {
  margin: 25px 0;
  text-align: center;
  font-weight: bolder;
}

.chart-wrapper {
  border: rgba(25, 25, 112, 0.3) 2px solid;
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(248, 249, 250, 0.5) 0%, rgba(233, 236, 239, 0.5) 100%);
}

.chart-wrapper:hover {
  background: linear-gradient(135deg, rgba(248, 249, 250, 0.7) 0%, rgba(141, 141, 141, 0.7) 100%);
}

.switch-controls { margin-bottom: 1rem; text-align: center; }

.switch-container {
  display: inline-flex;
  background: linear-gradient(145deg, rgba(41, 41, 41, 0.65), rgba(59, 59, 59, 0.5));
  border-radius: 50px;
  padding: 4px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #d1d5db;
}

.switch-btn {
  background: transparent;
  border: none;
  padding: 12px 20px;
  border-radius: 46px;
  cursor: pointer;
  font-size: 16px;
  color: rgb(255, 255, 255);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  font-weight: 500;
}

.switch-btn.active {
  color: #208b57;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.switch-btn i { font-size: 18px; }

.simple-pie-chart {
  display: flex;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem;
}

.pie-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: flex 0.3s ease;
  min-width: 2px;
}

.pie-label {
  font-size: 0.75rem;
  color: white;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
