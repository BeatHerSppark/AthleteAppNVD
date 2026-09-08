<template>
  <div v-if="reports.length === 0" class="empty-placeholder text-center p-5">
    <div class="fw-medium text-muted">No reports available</div>
  </div>
  <div v-else>
    <div class="table-responsive mt-3">
      <table class="table w-100 table-hover">
        <thead>
          <tr>
            <th scope="col">Patient</th>
            <th scope="col">Doctor</th>
            <th scope="col">Status</th>
            <th scope="col">
              Date
              <button
                type="button"
                class="btn btn-sm btn-link p-0 ms-2"
                @click="toggleSortByCreatedAt"
                aria-label="Sort by name"
                title="Sort by name"
              >
                <span v-if="sortDirection === 'asc' && sortField === 'createdAt'">&#9650;</span>
                <span v-else-if="sortDirection === 'desc' && sortField === 'createdAt'">&#9660;</span>
                <span v-else>&#8645;</span>
              </button>
            </th>
            <th scope="col">VO2 max</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report.id">
            <td>{{ report.patientName }}</td>
            <td>{{ report.doctorName }}</td>
            <td><StatusPill :status="report.status" /></td>
            <td>{{ formatDate(report.createdAt) }}</td>
            <td>{{ report.vo2Max }}</td>
            <td>
              <router-link :to="`/reports/${report.id}`" class="btn btn-outline-secondary btn-sm">
                Details
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ul v-if="totalElements > size" class="pagination">
      <li class="page-item" :class="{ disabled: page === 0 }">
        <button class="page-link" @click="onPageChange(page - 1)">Previous</button>
      </li>
      <li class="page-item" :class="{ disabled: (page + 1) * size >= totalElements }">
        <button class="page-link" @click="onPageChange(page + 1)">Next</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reportService } from '../../services/reportService'
import { useAuth } from '../../composables/useAuth'
import StatusPill from '../status-pill/StatusPill.vue'
import type { ReportShort } from '../../types'

const props = defineProps<{
  id?: number | null
}>()

const { getCurrentUser } = useAuth()

const reports = ref<ReportShort[]>([])
const totalElements = ref(0)
const page = ref(0)
const size = ref(10)

const sortField = ref('createdAt')
const sortDirection = ref<'asc' | 'desc'>('desc')

async function loadReports(targetPage: number = page.value) {
  const sortParam = `${sortField.value},${sortDirection.value}`
  let response
  if (props.id != null) {
    response = await reportService.getReportsByPatientId(props.id, targetPage, size.value, sortParam)
  } else {
    const user = getCurrentUser()
    const personId = user?.personId
    if (!personId) return
    response = user?.role === 'DOCTOR'
      ? await reportService.getReportsByDoctorId(personId, targetPage, size.value, sortParam)
      : await reportService.getReportsByPatientId(personId, targetPage, size.value, sortParam)
  }
  reports.value = response.data.content
  totalElements.value = response.data.totalElements
  page.value = response.data.number
}

function onPageChange(newPage: number) {
  loadReports(newPage)
}

function toggleSortByCreatedAt() {
  if (sortField.value === 'createdAt') {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = 'createdAt'
    sortDirection.value = 'asc'
  }
  loadReports(0)
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

onMounted(() => loadReports())
</script>

<style scoped>
.empty-placeholder {
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 1rem;
}
</style>
