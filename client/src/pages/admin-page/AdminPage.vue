<template>
  <div class="container admin-page p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="mb-0">Pending Users</h3>
      <button class="btn btn-primary btn-sm" @click="onLogout">Sign Out</button>
    </div>

    <div class="row mb-3 g-3">
      <div class="col-md-6">
        <input class="form-control shadow-sm rounded" placeholder="Search by EMBG" :value="embgSearch" @input="onSearch" />
      </div>
      <div class="col-md-6 text-md-end">
        <button class="btn btn-outline-secondary btn-sm shadow-sm" @click="toggleSort">Sort by Created At</button>
      </div>
    </div>

    <div class="table-responsive shadow-sm rounded bg-white p-3">
      <table class="table table-borderless table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>EMBG</th>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Role</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.userId" class="align-middle">
            <td>{{ u.embg }}</td>
            <td>{{ u.firstName }}</td>
            <td>{{ u.lastName }}</td>
            <td>{{ u.email || '-' }}</td>
            <td>{{ u.createdAt ? formatDate(u.createdAt) : '-' }}</td>
            <td>
              <select class="form-select form-select-sm shadow-sm" :value="u.role" @change="onRoleChange(u, ($event.target as HTMLSelectElement).value)">
                <option value="PATIENT">PATIENT</option>
                <option value="DOCTOR">DOCTOR</option>
                <option value="PENDING">PENDING</option>
              </select>
            </td>
            <td class="text-end">
              <button class="btn btn-outline-danger btn-sm shadow-sm" @click="confirmAndDelete(u)" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav v-if="totalPages > 1" class="mt-4 d-flex justify-content-center">
      <ul class="pagination pagination-sm shadow-sm rounded">
        <li class="page-item" :class="{ disabled: page === 0 }">
          <a class="page-link" @click="goToPage(page - 1)">Previous</a>
        </li>
        <li v-for="i in totalPages" :key="i" class="page-item" :class="{ active: i - 1 === page }">
          <a class="page-link" @click="goToPage(i - 1)">{{ i }}</a>
        </li>
        <li class="page-item" :class="{ disabled: page >= totalPages - 1 }">
          <a class="page-link" @click="goToPage(page + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { adminService } from '../../services/adminService'
import type { AppUserDTO, UserRole } from '../../types'

const router = useRouter()
const auth = useAuth()
const users = ref<AppUserDTO[]>([])
const page = ref(0)
const size = ref(20)
const sort = ref('createdAt,desc')
const embgSearch = ref('')
const loading = ref(false)
const totalElements = ref(0)
const totalPages = ref(0)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function load() {
  loading.value = true
  adminService.getPending(page.value, size.value, sort.value, embgSearch.value.trim() || undefined)
    .then(res => {
      users.value = res.data.content
      totalElements.value = res.data.totalElements
      totalPages.value = res.data.totalPages
      page.value = res.data.number
      loading.value = false
    })
}

function onSearch(event: Event) {
  const query = (event.target as HTMLInputElement).value
  embgSearch.value = query
  page.value = 0
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => load(), 400)
}

function toggleSort() {
  if (sort.value.endsWith('desc')) sort.value = 'createdAt,asc'
  else sort.value = 'createdAt,desc'
  load()
}

function onRoleChange(user: AppUserDTO, newRole: string) {
  if (user.userId == null) return
  adminService.updateUserRole(user.userId, newRole as UserRole).then(res => {
    const updated = res.data
    users.value = users.value.map(u => u.userId === updated.userId ? { ...u, role: updated.role } : u)
    load()
  })
}

function confirmAndDelete(user: AppUserDTO) {
  if (!user.userId) return
  if (!confirm(`Delete user ${user.firstName} ${user.lastName} (${user.embg})?`)) return
  adminService.deleteUser(user.userId).then(() => {
    users.value = users.value.filter(u => u.userId !== user.userId)
    load()
  })
}

function goToPage(p: number) {
  if (p < 0 || p >= totalPages.value) return
  page.value = p
  load()
}

function onLogout() {
  auth.logout()
  router.push('/login')
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString()
}

onMounted(() => load())
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.table-responsive {
  border-radius: 0.75rem;
  overflow: hidden;
}

.table-hover tbody tr:hover {
  background-color: #eaf5ec;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.btn-primary {
  background-color: #386641;
  border-color: #386641;
}

.btn-primary:hover {
  background-color: #2c5034;
  border-color: #2c5034;
}

.btn-outline-secondary {
  border-color: #b0b0b0;
}

.btn-outline-secondary:hover {
  background-color: #f0f0f0;
}

.btn-outline-danger i {
  color: #e63946;
}

.pagination .page-item.active .page-link {
  background-color: #386641;
  border-color: #386641;
  color: #fff;
}

.pagination .page-link {
  border-radius: 0.5rem;
  margin: 0 2px;
  min-width: 35px;
  text-align: center;
  cursor: pointer;
}
</style>
