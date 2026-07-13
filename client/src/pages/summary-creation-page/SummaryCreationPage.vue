<template>
  <button class="btn btn-outline-primary mb-3" @click="router.push(`/reports/${reportId}`)">Back to Report</button>

  <form @submit.prevent="onSubmit" class="p-3 rounded shadow-sm bg-light">
    <input type="hidden" v-model.number="form.reportId" />

    <div class="d-flex justify-content-between align-items-start mb-3">
      <h5 class="mb-0">Report Summary</h5>
      <div class="text-end">
        <div v-if="successMessage" class="alert alert-success py-1 px-2 mb-1" role="alert">{{ successMessage }}</div>
        <div v-else-if="errorMessage" class="alert alert-danger py-1 px-2 mb-1" role="alert">{{ errorMessage }}</div>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label fw-semibold">Summary</label>
      <quill-editor v-model:content="form.summarizedContent" contentType="html" :options="editorOptions"
        style="height: 400px" :class="{ 'is-invalid': formErrors.summarizedContent }" />
      <div v-if="formErrors.summarizedContent" class="invalid-feedback">Summary is required.</div>
    </div>

    <div class="d-flex flex-column flex-md-row gap-2 mb-3">
      <button type="button" @click="generateSummary" class="btn btn-outline-success flex-fill flex-md-grow-0"
        :disabled="aiLoading || saving || !form.reportId">
        <template v-if="!aiLoading"><span>Generate with AI</span></template>
        <template v-else><span>Generating... <span class="spinner-border spinner-border-sm" role="status"></span></span></template>
      </button>

      <button type="submit" class="btn btn-primary flex-fill flex-md-grow-0" :disabled="saving">
        <template v-if="!saving"><span>{{ hasSummary ? 'Update Summary' : 'Create Summary' }}</span></template>
        <template v-else><span>Saving... <span class="spinner-border spinner-border-sm" role="status"></span></span></template>
      </button>
    </div>

    <div v-if="aiLoading" class="mb-3">
      <div class="card">
        <div class="card-body d-flex align-items-center">
          <div class="spinner-border me-3" role="status"></div>
          <div>Generating AI summary...</div>
        </div>
      </div>
    </div>

    <div v-if="aiError" class="mb-3">
      <div class="alert alert-warning mb-0">{{ aiError }}</div>
    </div>

    <div v-if="aiResult" class="mb-3">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <strong>AI-generated suggestion</strong>
          <div class="btn-group btn-group-sm">
            <button type="button" class="btn btn-outline-secondary" @click="applyAi(true)">Apply</button>
            <button type="button" class="btn btn-outline-secondary" @click="applyAi(false)">Append</button>
            <button type="button" class="btn btn-outline-secondary" @click="copyAi()">Copy</button>
          </div>
        </div>
        <div class="card-body" v-html="aiResult"></div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { summaryService } from '../../services/summaryService'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const router = useRouter()
const route = useRoute()

const form = ref({ reportId: 0, summarizedContent: '' })
const hasSummary = ref(false)
const saving = ref(false)
const aiLoading = ref(false)
const aiResult = ref<string | null>(null)
const aiError = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const formErrors = ref({ summarizedContent: false })
const reportId = ref<number | undefined>()

const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean']
    ]
  },
  placeholder: 'Write or generate the summary here...'
}

function clearMessages() {
  successMessage.value = null
  errorMessage.value = null
  aiError.value = null
}

function generateSummary() {
  clearMessages()
  if (!reportId.value) { aiError.value = 'No report id found.'; return }
  aiLoading.value = true
  aiResult.value = null
  aiError.value = null
  summaryService.getSummaryAI(reportId.value).then(res => {
    aiResult.value = res.data ?? ''
    aiLoading.value = false
  }).catch(() => {
    aiError.value = 'Failed to generate summary. Try again.'
    aiLoading.value = false
  })
}

function applyAi(replace = true) {
  if (!aiResult.value) return
  const current = form.value.summarizedContent || ''
  form.value.summarizedContent = replace ? aiResult.value : (current ? `${current}\n\n${aiResult.value}` : aiResult.value)
}

function copyAi() {
  if (!aiResult.value) return
  navigator.clipboard?.writeText(aiResult.value).then(
    () => { successMessage.value = 'AI text copied to clipboard.'; setTimeout(() => successMessage.value = null, 2500) },
    () => { errorMessage.value = 'Could not copy to clipboard.'; setTimeout(() => errorMessage.value = null, 2500) }
  )
}

function onSubmit() {
  clearMessages()
  formErrors.value = { summarizedContent: false }

  if (!form.value.summarizedContent || form.value.summarizedContent.trim() === '' || form.value.summarizedContent === '<p><br></p>') {
    formErrors.value.summarizedContent = true
    errorMessage.value = 'Please fix the form errors before submitting.'
    setTimeout(() => errorMessage.value = null, 3000)
    return
  }

  if (!reportId.value) { errorMessage.value = 'Report id missing.'; return }
  saving.value = true

  if (hasSummary.value) {
    summaryService.patchSummary(reportId.value, form.value).then(() => {
      saving.value = false
      successMessage.value = 'Summary updated successfully.'
      setTimeout(() => successMessage.value = null, 3000)
    }).catch(() => {
      saving.value = false
      errorMessage.value = 'Failed to update summary.'
      setTimeout(() => errorMessage.value = null, 4000)
    })
  } else {
    summaryService.createSummary(form.value).then(() => {
      saving.value = false
      hasSummary.value = true
      successMessage.value = 'Summary created successfully.'
      setTimeout(() => successMessage.value = null, 3000)
    }).catch(() => {
      saving.value = false
      errorMessage.value = 'Failed to create summary.'
      setTimeout(() => errorMessage.value = null, 4000)
    })
  }
}

onMounted(() => {
  const rid = Number(route.params.reportId)
  reportId.value = rid
  form.value.reportId = rid
  summaryService.getSummaryByReportId(rid).then(res => {
    if (res.data) {
      hasSummary.value = true
      form.value.summarizedContent = res.data.summarizedContent ?? ''
    }
  }).catch(err => console.error('Error fetching summary', err))
})
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545 !important;
}

.invalid-feedback {
  display: block;
  font-size: 0.875rem;
  color: #dc3545;
}
</style>
