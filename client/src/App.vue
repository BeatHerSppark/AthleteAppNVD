<template>
  <div class="app-layout d-flex">
    <Sidebar v-if="!hideSidebar" :role="role" />
    <div class="flex-grow-1 overflow-y-scroll" :class="{ 'p-3': !hideSidebar }">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth'
import Sidebar from './components/sidebar/Sidebar.vue'

const route = useRoute()
const auth = useAuth()
const role = ref<string | undefined>(auth.getRole() ?? undefined)
const hideSidebar = ref(true)

watchEffect(() => {
  const user = auth.getCurrentUser()
  role.value = user?.role

  const url = route.path
  const isDoctorOrPatient = role.value === 'DOCTOR' || role.value === 'PATIENT'
  const onAuthPage =
    url.startsWith('/login') ||
    url.startsWith('/register') ||
    url.startsWith('/doctor/setup') ||
    url.startsWith('/patient/setup')
  hideSidebar.value = onAuthPage || !isDoctorOrPatient
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
}
</style>
