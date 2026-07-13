<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="text-center">
      <div class="spinner-border text-primary mb-3" role="status"></div>
      <p class="text-muted">Redirecting...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { getRole, getCurrentUser } = useAuth()

onMounted(() => {
  const role = getRole()
  const user = getCurrentUser()

  if (role === 'ADMIN') {
    router.replace('/admin')
  } else if (role === 'DOCTOR') {
    if (user?.personId) {
      router.replace('/doctor')
    } else {
      router.replace('/doctor/setup')
    }
  } else if (role === 'PATIENT') {
    if (user?.personId) {
      router.replace('/patient')
    } else {
      router.replace('/patient/setup')
    }
  } else if (role === 'PENDING') {
    router.replace('/pending')
  } else {
    router.replace('/login')
  }
})
</script>
