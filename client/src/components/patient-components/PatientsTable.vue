<template>
  <input
    type="text"
    class="form-control"
    placeholder="Search by EMBG..."
    :value="searchQuery"
    @input="onSearchInput"
  />

  <div v-if="loading" class="text-center text-muted mt-3">Loading patients...</div>

  <div class="table-responsive mt-3">
    <table class="table w-100 table-hover">
      <thead>
        <tr>
          <th>EMBG</th>
          <th>
            Name
            <button
              type="button"
              class="btn btn-sm btn-link p-0 ms-2"
              @click="toggleSortByName"
              aria-label="Sort by name"
              title="Sort by name"
            >
              <span v-if="sortDirection === 'asc' && sortField === 'name'">&#9650;</span>
              <span v-else-if="sortDirection === 'desc' && sortField === 'name'">&#9660;</span>
              <span v-else>&#8645;</span>
            </button>
          </th>
          <th>Date of Birth</th>
          <th>Gender</th>
          <th>Sportsman Category</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="p in patients"
          :key="p.patientId"
          role="button"
          class="hover-row"
          @click="goToPatient(p.patientId)"
        >
          <td>{{ p.embg }}</td>
          <td>{{ p.name }}</td>
          <td>{{ formatDate(p.dateOfBirth) }}</td>
          <td>{{ p.gender }}</td>
          <td>{{ p.sportsmanCategory }}</td>
          <td>{{ p.email }}</td>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { doctorApiService } from '../../services/doctorApiService'
import type { PatientDTO } from '../../types'

const router = useRouter()
const { currentUser } = useAuth()

const patients = ref<PatientDTO[]>([])
const totalElements = ref(0)
const page = ref(0)
const size = ref(10)
const loading = ref(false)

const sortField = ref<string>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')

const searchQuery = ref('')
let searchTimeout: ReturnType<typeof setTimeout> | null = null

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString()
  } catch {
    return dateStr
  }
}

function goToPatient(patientId: number) {
  router.push(`/patient/${patientId}`)
}

async function loadPatients(targetPage: number = page.value) {
  loading.value = true
  const sortParam = `${sortField.value},${sortDirection.value}`
  const doctorId = currentUser.value?.personId
  if (!doctorId) {
    loading.value = false
    return
  }

  try {
    const res = await doctorApiService.getPatientsByDoctorId(doctorId, targetPage, size.value, sortParam)
    patients.value = res.data.content
    totalElements.value = res.data.totalElements
    page.value = res.data.number
  } catch (err) {
    console.error('Failed to load patients:', err)
  } finally {
    loading.value = false
  }
}

async function searchPatients(query: string, targetPage: number = 0) {
  loading.value = true
  const sortParam = `${sortField.value},${sortDirection.value}`
  const doctorId = currentUser.value?.personId
  if (!doctorId) {
    loading.value = false
    return
  }

  try {
    const res = await doctorApiService.searchPatients(doctorId, query, false, targetPage, size.value, sortParam)
    patients.value = res.data.content
    totalElements.value = res.data.totalElements
    page.value = res.data.number
  } catch (err) {
    console.error('Failed to search patients:', err)
  } finally {
    loading.value = false
  }
}

function onSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  const query = target.value
  searchQuery.value = query

  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (query) {
      searchPatients(query)
    } else {
      loadPatients(0)
    }
  }, 300)
}

function onPageChange(newPage: number) {
  if (searchQuery.value) {
    searchPatients(searchQuery.value, newPage)
  } else {
    loadPatients(newPage)
  }
}

function toggleSortByName() {
  if (sortField.value === 'name') {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = 'name'
    sortDirection.value = 'asc'
  }
  if (searchQuery.value) {
    searchPatients(searchQuery.value, 0)
  } else {
    loadPatients(0)
  }
}

onMounted(() => {
  loadPatients()
})
</script>

<style scoped>
.hover-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.hover-row:hover {
  background-color: #f3f4f6;
}
</style>
