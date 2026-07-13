<template>
  <div v-if="!isProcessing" class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="col-lg-8 col-xl-7">
      <div class="card mood-form-card shadow-lg">
        <div class="card-header text-white">
          <h4 class="mb-0">Add Mood</h4>
        </div>
        <div class="card-body">
          <form @submit.prevent="onSubmit">
            <input type="hidden" v-model.number="form.patientId" />

            <div class="mb-3">
              <label class="form-label">Hours Slept</label>
              <input type="number" class="form-control" v-model.number="form.hoursSleptAverage" min="0" max="24" />
            </div>

            <div class="mb-3">
              <label class="form-label">Mood Description</label>
              <textarea class="form-control" rows="4" v-model="form.moodDescription"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Emotion</label>
              <select class="form-select" v-model="form.moodEmotion">
                <option value="" disabled>Select emotion</option>
                <option v-for="option in moodEmotionOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>

            <div class="d-grid">
              <button class="btn btn-custom-green" type="submit">Submit</button>
            </div>
          </form>
        </div>

        <div class="card-footer description-box">
          <p class="description-text">
            Logging your moods regularly helps us provide you with better insights
            and personalized recommendations. Your data is private and secure. Make sure you feel comfortable and write
            how do you feel in the last period.
            <br><span class="fw-bolder">Express your feelings and explain your period as it realistically is.</span>
          </p>
        </div>
      </div>
    </div>
  </div>
  <OpenAiGeneratingLoader v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { moodService } from '../../services/moodService'
import OpenAiGeneratingLoader from '../open-ai-generating-loader/OpenAiGeneratingLoader.vue'

const route = useRoute()
const router = useRouter()
const moodEmotionOptions = ['EXCITED', 'HAPPY', 'NEUTRAL', 'TIRED', 'STRESSED', 'SAD']
const patientId = ref<number>(0)
const isProcessing = ref(false)

const form = ref({
  patientId: 0,
  moodEmotion: '',
  moodDescription: '',
  hoursSleptAverage: 0
})

function onSubmit() {
  isProcessing.value = true
  moodService.createMood(form.value).then(() => {
    isProcessing.value = false
    router.push(`/moods/${patientId.value}/search`)
  }).catch(err => {
    isProcessing.value = false
    console.error('Error creating mood:', err)
  })
}

onMounted(() => {
  const pid = Number(route.query.patientId)
  patientId.value = pid
  form.value.patientId = pid
})
</script>

<style scoped>
.mood-form-card {
  width: 100%;
  max-width: 720px;
  border-radius: 12px;
  overflow: hidden;
}

.mood-form-card .card-header {
  background: linear-gradient(135deg, #386641, #6A994E);
  font-weight: 600;
  text-align: center;
  font-size: 1.2rem;
  border: none;
}

.mood-form-card .form-control,
.mood-form-card .form-select {
  border-radius: 8px;
  border: 1px solid #cbd5c0;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.mood-form-card .form-control:focus,
.mood-form-card .form-select:focus {
  border-color: #A7C957;
  box-shadow: 0 0 0 0.2rem rgba(167, 201, 87, 0.35);
}

.btn-custom-green {
  background-color: #5cb85c;
  border-color: #5cb85c;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  padding: 0.65rem;
  transition: all 0.2s ease;
}

.btn-custom-green:hover {
  background-color: #449d44;
  border-color: #449d44;
}

.mood-form-card textarea {
  min-height: 140px;
}

.mood-form-card .form-label {
  color: #1f7a1f;
  font-size: 1rem;
  font-weight: 600;
}

.description-box {
  background-color: #f2e8cf;
  text-align: center;
  padding: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.description-text {
  font-size: 0.9rem;
  color: #386641;
  font-style: italic;
  margin: 0;
  line-height: 1.4;
}
</style>
