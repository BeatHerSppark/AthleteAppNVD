<template>
  <div v-if="mood_object" class="mood-details container">
    <div class="card mood-card">
      <div class="card-header mood-header d-flex justify-content-between align-items-center" :class="emotionClass">
        <div class="d-flex align-items-center gap-3">
          <div>
            <h5 class="mb-1">Mood #{{ mood_object.moodId }}</h5>
            <div class="chips">
              <span class="chip chip-emotion">{{ mood_object.moodEmotion }}</span>
              <span class="chip chip-progress">{{ mood_object.moodProgress }}</span>
            </div>
          </div>
        </div>
        <router-link :to="{ path: `/moods/${mood_object.patientId}/search` }" class="btn btn-sm btn-outline-light">
          Back to Moods
        </router-link>
      </div>

      <div class="card-body mood-body">
        <dl class="details-grid">
          <div class="detail">
            <dt>Hours Slept</dt>
            <dd>{{ mood_object.hoursSleptAverage }}h</dd>
          </div>
          <div class="detail">
            <dt>Created</dt>
            <dd>{{ formatDate(mood_object.createdAt) }}</dd>
          </div>
          <div class="detail full">
            <dt>Patient</dt>
            <dd>{{ mood_object.patientName }} (ID: {{ mood_object.patientId }})</dd>
          </div>
          <div class="detail full">
            <dt>Description</dt>
            <dd class="desc">{{ mood_object.moodDescription }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
  <div v-else class="text-center mt-4 text-muted">Loading mood details...</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { moodService } from '../../services/moodService'
import type { Mood } from '../../types'

const route = useRoute()
const router = useRouter()
const mood_object = ref<Mood>()

const emotionClass = computed(() => {
  if (!mood_object.value) return ''
  return `mood-${mood_object.value.moodEmotion.toLowerCase()}`
})

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  const mood_id = Number(route.params.id)
  if (mood_id) {
    moodService.getMoodById(mood_id).then(res => {
      mood_object.value = res.data
    })
  } else {
    router.push('/moods')
  }
})
</script>

<style scoped>
.mood-details {
  max-width: 980px;
  margin-top: 1.25rem;
}

.mood-card {
  border: none;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  background: #fff;
}

.mood-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #A7C957, #7BAE3B);
  color: #fff;
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  display: inline-block;
  padding: 4px 10px;
  font-size: .8rem;
  border-radius: 999px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.mood-body {
  background: #FAF6EA;
  padding: 20px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 24px;
  margin: 0;
}

.detail dt {
  margin: 0;
  font-size: .78rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b7280;
}

.detail dd {
  margin: 2px 0 0 0;
  font-weight: 600;
  color: #1f2937;
}

.detail.full {
  grid-column: 1 / -1;
}

.desc {
  background: #fff;
  border-radius: 10px;
  padding: 12px 14px;
  line-height: 1.5;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
}

.mood-neutral .mood-header {
  background: linear-gradient(135deg, #B0BEC5, #78909C);
}

.mood-happy .mood-header {
  background: linear-gradient(135deg, #F6C445, #F59E0B);
}

.mood-excited .mood-header {
  background: linear-gradient(135deg, #5C6BC0, #3949AB);
}

.mood-tired .mood-header {
  background: linear-gradient(135deg, #9FA8DA, #7986CB);
}

.mood-stressed .mood-header {
  background: linear-gradient(135deg, #EF4444, #B91C1C);
}

.mood-sad .mood-header {
  background: linear-gradient(135deg, #60A5FA, #2563EB);
}
</style>
