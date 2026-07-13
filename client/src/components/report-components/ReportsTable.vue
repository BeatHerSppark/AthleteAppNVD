<template>
  <div class="reports-table-container">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading reports...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else>
      <table class="table table-hover table-striped table-bordered align-middle">
        <thead class="table-dark">
          <tr>
            <th scope="col">Created At</th>
            <th v-if="!id" scope="col">{{ userRole === 'DOCTOR' ? 'Patient' : 'Doctor' }}</th>
            <th scope="col">Status</th>
            <th scope="col">VO2 Max</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report.id">
            <td>{{ formatDate(report.createdAt) }}</td>
            <td v-if="!id">
              {{ userRole === 'DOCTOR' ? report.patientName : report.doctorName }}
            </td>
            <td>
              <StatusPill :status="report.status" />
            </td>
            <td>{{ report.vo2Max.toFixed(2) }}</td>
            <td>
              <router-link
                :to="`/reports/${report.id}`"
                class="btn btn-sm btn-outline-primary"
              >
                View
              </router-link>
            </td>
          </tr>
          <tr v-if="reports.length === 0">
            <td :colspan="!id ? 5 : 4" class="text-center text-muted">
              No reports found.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" aria-label="Reports pagination">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 0 }">
            <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: page - 1 === currentPage }"
          >
            <button class="page-link" @click="changePage(page - 1)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
            <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { reportService } from '../../services/reportService'
import { useAuth } from '../../composables/useAuth'
import StatusPill from '../status-pill/StatusPill.vue'
import type { ReportShort } from '../../types'

const props = defineProps<{
  id?: number
}>()

const { getCurrentUser } = useAuth()
const reports = ref<ReportShort[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(0)
const totalPages = ref(1)
const pageSize = 10

const userRole = computed(() => getCurrentUser()?.role ?? null)

async function loadReports(page = 0) {
  loading.value = true
  error.value = null
  try {
    let response
    if (props.id !== undefined) {
      response = await reportService.getReportsByPatientId(props.id, page, pageSize)
    } else {
      const user = getCurrentUser()
      const personId = user?.personId
      if (!personId) {
        error.value = 'Unable to determine user ID.'
        loading.value = false
        return
      }
      if (user?.role === 'DOCTOR') {
        response = await reportService.getReportsByDoctorId(personId, page, pageSize)
      } else {
        response = await reportService.getReportsByPatientId(personId, page, pageSize)
      }
    }
    reports.value = response.data.content
    totalPages.value = response.data.totalPages
    currentPage.value = response.data.number
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to load reports.'
  } finally {
    loading.value = false
  }
}

function changePage(page: number) {
  if (page < 0 || page >= totalPages.value) return
  loadReports(page)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => loadReports(0))
</script>

<style scoped>
.reports-table-container {
  padding: 1rem 0;
}
</style>
