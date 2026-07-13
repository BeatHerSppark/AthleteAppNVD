<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div
      class="card shadow-lg p-4 border-0"
      style="max-width: 600px; background: linear-gradient(135deg, #F2E8CF 0%, #ffffff 100%); border-radius: 16px;"
    >
      <form @submit.prevent="submit" class="card-body">
        <h2
          class="card-title text-center mb-2 fw-bold"
          style="color: #386641;"
        >
          Hey {{ loggedUser?.firstName }} {{ loggedUser?.lastName }},
        </h2>
        <p class="text-center mb-4">
          you have been assigned as role
          <span class="fw-bolder text-danger"> {{ loggedUser?.role }} </span>.<br />
          Finish your registration and welcome to the system of
          <span class="fw-bold" style="color: #6A994E;">Athlete360</span>.
        </p>

        <div class="mb-4">
          <label for="category" class="form-label fw-semibold">Sportsman Category</label>
          <select
            id="category"
            v-model="selectedCategory"
            class="form-select border-2"
            :class="{ 'is-invalid': categoryInvalid }"
          >
            <option :value="null">Select category</option>
            <option
              v-for="c in categories"
              :key="c"
              :value="c"
            >
              {{ c.replace('_', ' ') }}
            </option>
          </select>
          <div v-if="categoryInvalid" class="text-danger small mt-1">
            Sportsman category is required.
          </div>
        </div>

        <div class="d-grid">
          <button
            type="submit"
            :disabled="!selectedCategory"
            class="btn fw-bold text-white py-2"
            style="background-color: #386641; border-radius: 8px;"
          >
            Finish The Registration
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { patientService } from '../../services/patientService'
import type { SportsmanCategory } from '../../types'

const router = useRouter()
const { currentUser, logout } = useAuth()

const loggedUser = currentUser.value

const categories: SportsmanCategory[] = ['RECREATION', 'AMATEUR', 'SEMI_PROFESSIONAL', 'PROFESSIONAL']
const selectedCategory = ref<SportsmanCategory | null>(null)

const categoryInvalid = computed(() => !selectedCategory.value)

async function submit() {
  if (!selectedCategory.value || !loggedUser?.userId) return

  try {
    await patientService.createPatientFromUser({
      id: loggedUser.userId,
      sportsmanCategory: selectedCategory.value
    })
    logout()
    router.push('/login')
  } catch (err) {
    console.error(`Error creating patient profile: ${err}`)
  }
}
</script>

<style scoped>
</style>
