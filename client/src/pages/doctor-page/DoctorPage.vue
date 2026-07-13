<template>
  <div v-if="currentUser">
    <h1>Dr. {{ currentUser.firstName }} {{ currentUser.lastName }}</h1>
    <hr />
    <h3 class="mt-4">Patients:</h3>
    <PatientsTable />

    <div class="d-flex justify-content-between align-items-center">
      <h3 class="mt-3">Reports:</h3>
      <RouterLink to="/reports/new" class="btn btn-primary">
        + Create Report
      </RouterLink>
    </div>
    <ReportsTable />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import type { CurrentUser } from '../../types'

const PatientsTable = defineAsyncComponent(() => import('../../components/patient-components/PatientsTable.vue'))
const ReportsTable = defineAsyncComponent(() => import('../../components/report-components/ReportsTable.vue'))

const { currentUser: currentUserRef } = useAuth()
const currentUser = ref<CurrentUser | null>(null)

onMounted(() => {
  currentUser.value = currentUserRef.value
})
</script>

<style scoped>
</style>
