<template>
  <nav class="sidebar d-flex flex-column" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header d-flex align-items-center justify-content-between px-3 py-3">
      <span class="brand fw-bold fs-5" v-show="!isCollapsed">Athlete360</span>
      <button class="btn btn-sm btn-link text-white p-0" @click="toggleCollapse">
        <i class="bi" :class="isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
      </button>
    </div>
    <div class="sidebar-body flex-grow-1">
      <ul class="nav flex-column">
        <li class="nav-item" v-if="role === 'DOCTOR' || role === 'ADMIN'">
          <router-link to="/doctor" class="nav-link" active-class="active" exact-active-class="active">
            <i class="bi bi-person-badge me-2"></i>
            <span v-show="!isCollapsed">Dashboard</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="role === 'PATIENT'">
          <router-link to="/patient" class="nav-link" active-class="active" exact-active-class="active">
            <i class="bi bi-person me-2"></i>
            <span v-show="!isCollapsed">My Profile</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="role === 'PATIENT'">
          <router-link to="/moods" class="nav-link" active-class="active" exact-active-class="active">
            <i class="bi bi-emoji-smile me-2"></i>
            <span v-show="!isCollapsed">Moods</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="role === 'DOCTOR' || role === 'PATIENT' || role === 'ADMIN'">
          <router-link to="/reports" class="nav-link" active-class="active" exact-active-class="active">
            <i class="bi bi-file-earmark-medical me-2"></i>
            <span v-show="!isCollapsed">Reports</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="role === 'DOCTOR'">
          <router-link to="/reports/new" class="nav-link" active-class="active" exact-active-class="active">
            <i class="bi bi-plus-circle me-2"></i>
            <span v-show="!isCollapsed">New Report</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="sidebar-footer px-3 py-3 border-top">
      <div class="user-info d-flex align-items-center mb-2" v-show="!isCollapsed">
        <div class="avatar-circle me-2 d-flex align-items-center justify-content-center">
          {{ userInitials }}
        </div>
        <div>
          <div class="fw-semibold small">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</div>
          <div class="text-muted small">{{ role }}</div>
        </div>
      </div>
      <button class="btn btn-sm btn-outline-light w-100" @click="handleLogout">
        <i class="bi bi-box-arrow-left me-1"></i>
        <span v-show="!isCollapsed">Logout</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const props = defineProps<{
  role?: string
}>()

const router = useRouter()
const { logout, getCurrentUser } = useAuth()
const isCollapsed = ref(false)

const currentUser = computed(() => getCurrentUser())
const userInitials = computed(() => {
  const user = getCurrentUser()
  if (!user) return ''
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
})

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  min-height: 100vh;
  background: linear-gradient(180deg, #386641, #2c5034);
  color: #fff;
  transition: width 0.3s ease;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand {
  color: #F2E8CF;
}

.sidebar-body .nav-link {
  color: rgba(255, 255, 255, 0.85);
  padding: 12px 16px;
  border-radius: 8px;
  margin: 2px 8px;
  transition: all 0.2s ease;
}

.sidebar-body .nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sidebar-body .nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 600;
}

.sidebar-body .nav-link i {
  font-size: 1.1rem;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  font-size: 0.85rem;
  font-weight: 600;
}

.sidebar-footer .btn-outline-light {
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.sidebar-footer .btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
}
</style>
