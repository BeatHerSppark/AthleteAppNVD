<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-lg p-4 border-0" style="max-width: 600px; background: linear-gradient(135deg, #F2E8CF 0%, #ffffff 100%); border-radius: 16px;">
      <form @submit.prevent="submit" class="card-body">
        <h2 class="card-title text-center mb-4 fw-bold" style="color: #386641;">
          Hey {{ loggedUser?.firstName }} {{ loggedUser?.lastName }},
        </h2>
        <p class="text-center mb-4">
          you have been assigned as role
          <span class="fw-bolder text-danger"> {{ loggedUser?.role }} </span>.<br>
          Finish your registration and welcome to the system of <span class="fw-bold" style="color: #6A994E;">Athlete360</span>
        </p>

        <div class="mb-3">
          <label for="specialization" class="form-label fw-semibold">Enter the Specialization you finished for</label>
          <input type="text" id="specialization" class="form-control border-2"
            v-model="form.specialization"
            placeholder="e.g. Psychiatry, Dermatology, Radiology ..." />
          <div v-if="errors.specialization" class="text-danger small mt-1">
            Specialization is required for the registration to be completed.
          </div>
        </div>

        <div class="d-grid">
          <button :disabled="!isValid" type="submit"
            class="btn fw-bold text-white py-2"
            style="background-color: #386641; border-radius: 8px;">
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
import { doctorService } from '../../services/doctorService'

const auth = useAuth()
const router = useRouter()
const loggedUser = auth.getCurrentUser()

const form = ref({ specialization: '' })
const errors = ref({ specialization: '' })

const isValid = computed(() => !!form.value.specialization)

function submit() {
  if (!isValid.value) {
    errors.value.specialization = 'required'
    return
  }
  doctorService.saveDoctorEntity({ userId: loggedUser!.userId, specialization: form.value.specialization })
    .then(() => {
      auth.logout()
      router.push('/login')
    })
    .catch(err => console.error('Error creating doctor profile:', err))
}
</script>
