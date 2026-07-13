<template>
  <div class="container mt-4">
    <div class="row g-3">
      <div class="col-lg-8 col-12">
        <div class="d-flex justify-content-center">
          <router-link :to="{ path: '/moods/add-mood', query: { patientId } }"
            class="btn btn-lg rounded shadow mb-4 text-center btn-new-mood">
            + New Mood Entry
          </router-link>
        </div>
        <div class="row g-3">
          <div class="filter-panel card p-4 mb-4">
            <form @submit.prevent="applyFilters">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">From</label>
                  <input type="datetime-local" v-model="filters.from" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">To</label>
                  <input type="datetime-local" v-model="filters.to" class="form-control" />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold mb-3">Emotion</label>
                <div class="row">
                  <div v-for="option in moodEmotionOptions" :key="option" class="col-md-4 col-sm-6 mb-2">
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" :value="option"
                        :checked="filters.moodEmotion.includes(option)" @change="onCheckboxChange($event, 'moodEmotion')"
                        :id="'emotion-' + option" />
                      <label class="form-check-label" :for="'emotion-' + option">{{ option }}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-semibold mb-3">Progress</label>
                <div class="row">
                  <div v-for="option in moodProgressOptions" :key="option" class="col-md-4 col-sm-6 mb-2">
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" :value="option"
                        :checked="filters.moodProgress.includes(option)" @change="onCheckboxChange($event, 'moodProgress')"
                        :id="'progress-' + option" />
                      <label class="form-check-label" :for="'progress-' + option">{{ option }}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button type="submit" class="btn btn-custom-green px-4">Filter Results</button>
                <button type="button" class="btn-reset" @click="resetFilters">Reset</button>
              </div>
            </form>
          </div>

          <div v-for="mood in moodObjects" :key="mood.moodId" class="col-lg-6 col-md-6 col-12">
            <div class="card h-100 border-0 shadow mood-card">
              <div class="card-header border-0 py-3 mood-card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <h6 class="mb-0 text-white fw-bold">{{ mood.moodEmotion }}</h6>
                  <span class="badge rounded-pill" :class="progressBadgeClass(mood.moodProgress)">{{ mood.moodProgress }}</span>
                </div>
              </div>
              <div class="card-body py-4">
                <div class="mb-3">
                  <div class="d-flex align-items-center mb-2">
                    <span class="fw-semibold sleep-label">Sleep Average</span>
                    <p class="mb-0 ms-1 text-muted">{{ mood.hoursSleptAverage }}h per day</p>
                  </div>
                </div>
                <div class="mb-3">
                  <h6 class="fw-semibold mb-2 desc-label">Description</h6>
                  <p class="card-text text-muted mb-0 desc-text">
                    {{ mood.moodDescription.slice(0, 30) }}{{ mood.moodDescription.length > 30 ? '...' : '' }}
                  </p>
                </div>
                <div class="border-top pt-3 footer-border">
                  <div class="row g-2 text-sm">
                    <div class="col-6">
                      <small class="text-muted d-block">Created</small>
                      <small class="fw-semibold created-date">{{ formatDate(mood.createdAt) }}</small>
                    </div>
                    <div class="col-6">
                      <small class="text-muted d-block">Patient Identification</small>
                      <small class="fw-semibold patient-id">#{{ mood.patientId }}</small>
                    </div>
                  </div>
                  <div class="mt-2">
                    <small class="text-muted d-block">Name</small>
                    <small class="fw-bold patient-name">{{ mood.patientName }}</small>
                  </div>
                </div>
              </div>
              <div class="card-footer border-0 py-3 mood-card-footer">
                <div class="d-grid">
                  <router-link :to="{ path: `/moods/info/${mood.moodId}` }" class="btn btn-outline-light btn-sm fw-semibold btn-view-details">
                    View Details
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3 d-flex align-items-center gap-2 pagination-container">
          <button @click="prev" :disabled="page?.first">Prev</button>
          <template v-if="page">
            <button v-for="pageNum in getPageNumbers()" :key="pageNum" @click="goToPage(pageNum)"
              :class="{ active: page.number === pageNum - 1 }" class="page-btn">{{ pageNum }}</button>
          </template>
          <button @click="next" :disabled="page?.last">Next</button>
        </div>
      </div>

      <div class="col-lg-4 col-12">
        <div class="position-sticky" style="top: 20px;">
          <MoodStatisticsComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { moodService } from '../../services/moodService'
import { useAuth } from '../../composables/useAuth'
import type { Mood, Page } from '../../types'
import MoodStatisticsComponent from '../../components/mood-components/MoodStatisticsComponent.vue'

const route = useRoute()
const auth = useAuth()
const moodEmotionOptions = ['EXCITED', 'HAPPY', 'NEUTRAL', 'TIRED', 'STRESSED', 'SAD']
const moodProgressOptions = ['GOOD', 'BAD', 'STALL']
const moodObjects = ref<Mood[]>([])
const page = ref<Page<Mood> | undefined>()
const pageSize = 4
const pageNumber = ref(1)
const patientId = ref<number | undefined>()

const filters = ref({
  from: '',
  to: '',
  moodEmotion: [] as string[],
  moodProgress: [] as string[]
})

function onCheckboxChange(event: Event, name: 'moodEmotion' | 'moodProgress') {
  const checkbox = event.target as HTMLInputElement
  const arr = name === 'moodEmotion' ? filters.value.moodEmotion : filters.value.moodProgress
  if (checkbox.checked) {
    arr.push(checkbox.value)
  } else {
    const idx = arr.indexOf(checkbox.value)
    if (idx > -1) arr.splice(idx, 1)
  }
}

function applyFilters() {
  pageNumber.value = 1
  loadData()
}

function resetFilters() {
  filters.value = { from: '', to: '', moodEmotion: [], moodProgress: [] }
  pageNumber.value = 1
  loadData()
}

function loadData() {
  const pid = patientId.value || auth.getCurrentUser()?.personId
  if (!pid) return
  moodService.filterSearch(
    pid,
    filters.value.from || undefined,
    filters.value.to || undefined,
    filters.value.moodEmotion.length ? filters.value.moodEmotion : undefined,
    filters.value.moodProgress.length ? filters.value.moodProgress : undefined,
    pageSize,
    pageNumber.value
  ).then(res => {
    page.value = res.data
    moodObjects.value = res.data.content
  })
}

function getPageNumbers(): number[] {
  if (!page.value) return []
  return Array.from({ length: page.value.totalPages }, (_, i) => i + 1)
}

function goToPage(pageNum: number) {
  if (!page.value || pageNum < 1 || pageNum > page.value.totalPages) return
  pageNumber.value = pageNum
  loadData()
}

function prev() {
  if (page.value?.first) return
  pageNumber.value -= 1
  loadData()
}

function next() {
  if (page.value?.last) return
  pageNumber.value += 1
  loadData()
}

function progressBadgeClass(progress: string) {
  if (progress === 'GOOD') return 'bg-good'
  if (progress === 'STALL') return 'bg-stall'
  return 'bg-bad'
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  const id = Number(route.params.id)
  if (id) patientId.value = id
  loadData()
})
</script>

<style scoped>
.btn-new-mood {
  background-color: #386641;
  color: #F2E8CF !important;
  width: 230px;
  height: 50px;
}

.mood-card {
  background: linear-gradient(135deg, #F2E8CF 0%, #A7C957 100%);
}

.mood-card-header {
  background-color: #386641;
}

.bg-good {
  background-color: #6A994E;
  color: white;
}

.bg-stall {
  background-color: #A7C957;
  color: #386641;
}

.bg-bad {
  background-color: #BC4749;
  color: white;
}

.sleep-label {
  color: #386641;
}

.desc-label {
  color: #386641;
}

.desc-text {
  line-height: 1.5;
}

.footer-border {
  border-color: #A7C957 !important;
}

.created-date {
  color: #386641;
}

.patient-id {
  color: #386641;
}

.patient-name {
  color: #386641;
}

.mood-card-footer {
  background-color: #6A994E;
}

.btn-view-details {
  border-color: #F2E8CF;
  color: #F2E8CF;
}

.btn-view-details:hover {
  background-color: #F2E8CF;
  color: #386641;
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 3px;
  text-align: center;
  margin: auto;
}

.pagination-container button {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  background-color: #d7ffe7;
  color: #006933;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-container button.active {
  background-color: #208b57;
  color: #ffffff;
  border-color: rgba(30, 30, 30, 0.1);
}

.pagination-container button:disabled {
  background-color: #f9f9f9;
  color: #9ca3af;
  border-color: #e5e7eb;
  cursor: not-allowed;
  transform: none;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.pagination-container button:not(.page-btn) {
  padding: 8px 16px;
  font-weight: 600;
}

.filter-panel {
  background: linear-gradient(135deg, #f2e8cf, #ffffff);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.2rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.filter-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.filter-panel .form-control,
.filter-panel .form-select {
  border-radius: 8px;
  border: 1px solid #cbd5c0;
  background-color: #ffffff;
  padding: 0.6rem 0.8rem;
  font-size: 0.95rem;
}

.filter-panel .form-control:focus,
.filter-panel .form-select:focus {
  border-color: #A7C957;
  box-shadow: 0 0 0 0.2rem rgba(167, 201, 87, 0.35);
}

.filter-panel .form-check-input:checked {
  background-color: #386641;
  border-color: #386641;
}

.btn-custom-green {
  background-color: #5cb85c;
  border-color: #5cb85c;
  color: white;
}

.btn-custom-green:hover {
  background-color: #449d44;
  border-color: #449d44;
  color: white;
}

.btn-reset {
  background-color: darkred;
  color: #f2e8cf;
  border-radius: 0.5em;
  border: none;
  padding: 0 19px;
}
</style>
