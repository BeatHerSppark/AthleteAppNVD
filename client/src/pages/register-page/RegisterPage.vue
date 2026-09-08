<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-7">
        <div class="card shadow-sm register-card">
          <div class="card-header text-white">
            <h5 class="mb-0">Create your account</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="onSubmit" novalidate>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">First name</label>
                  <input type="text" class="form-control" :class="{ 'is-invalid': touched.firstName && errors.firstName }" v-model="form.firstName" @blur="touched.firstName = true" />
                  <div class="invalid-feedback" v-if="touched.firstName && errors.firstName">First name is required.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Last name</label>
                  <input type="text" class="form-control" :class="{ 'is-invalid': touched.lastName && errors.lastName }" v-model="form.lastName" @blur="touched.lastName = true" />
                  <div class="invalid-feedback" v-if="touched.lastName && errors.lastName">Last name is required.</div>
                </div>
              </div>

              <div class="row g-3 mt-1">
                <div class="col-md-6">
                  <label class="form-label">EMBG</label>
                  <input type="text" inputmode="numeric" class="form-control" :class="{ 'is-invalid': touched.embg && errors.embg }" v-model="form.embg" placeholder="e.g. 1007991450xxx" @blur="touched.embg = true" />
                  <div class="invalid-feedback" v-if="touched.embg && errors.embg">{{ errors.embg }}</div>
                  <div class="form-text">Format: ddmmyyy + 450xxx (male) / 455xxx (female)</div>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Date of birth</label>
                  <input type="date" class="form-control" :class="{ 'is-invalid': touched.dateOfBirth && errors.dateOfBirth }" v-model="form.dateOfBirth" @blur="touched.dateOfBirth = true" />
                  <div class="invalid-feedback" v-if="touched.dateOfBirth && errors.dateOfBirth">Date of birth is required.</div>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Gender</label>
                  <select class="form-select" :class="{ 'is-invalid': touched.gender && errors.gender }" v-model="form.gender" @blur="touched.gender = true">
                    <option value="" disabled>Select...</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                  <div class="invalid-feedback" v-if="touched.gender && errors.gender">Gender is required.</div>
                </div>
              </div>

              <div class="mt-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" :class="{ 'is-invalid': touched.email && errors.email }" v-model="form.email" placeholder="name@example.com" @blur="touched.email = true" />
                <div class="invalid-feedback" v-if="touched.email && errors.email">
                  {{ errors.email === 'required' ? 'Email is required.' : 'Please enter a valid email.' }}
                </div>
              </div>

              <div class="row g-3 mt-1">
                <div class="col-md-6">
                  <label class="form-label">Password</label>
                  <input :type="showPass ? 'text' : 'password'" class="form-control" :class="{ 'is-invalid': touched.password && errors.password }" v-model="form.password" placeholder="min 8 chars, 1 number, 1 symbol, no uppercase" @blur="touched.password = true" />
                  <div class="invalid-feedback" v-if="touched.password && errors.password">
                    <template v-if="errors.password === 'required'">Password is required.</template>
                    <template v-if="errors.password === 'minlength'">Min length is 8.</template>
                    <template v-if="errors.password === 'pattern'">Must have at least one number and one special character, lowercase only.</template>
                  </div>
                  <div class="form-check mt-2">
                    <input class="form-check-input" type="checkbox" id="showPass" @click="showPass = !showPass" />
                    <label for="showPass" class="form-check-label">Show password</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Confirm password</label>
                  <input :type="showPass ? 'text' : 'password'" class="form-control" :class="{ 'is-invalid': touched.confirmPassword && errors.confirmPassword }" v-model="form.confirmPassword" @blur="touched.confirmPassword = true" />
                  <div class="invalid-feedback" v-if="touched.confirmPassword && errors.confirmPassword">
                    <template v-if="errors.confirmPassword === 'required'">Confirmation is required.</template>
                    <template v-if="errors.confirmPassword === 'mismatch'">Passwords do not match.</template>
                  </div>
                </div>
              </div>
              <div class="d-grid mt-4">
                <button class="btn btn-brand" type="submit" :disabled="!allValid || submitting">Create Account</button>
              </div>
            </form>
          </div>
          <div class="card-footer text-muted small text-center">By registering you agree to our Terms & Privacy.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import type { CreateAppUserDTO } from '../../types'

const router = useRouter()
const auth = useAuth()
const showPass = ref(false)
const submitting = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  embg: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const touched = ref({
  firstName: false,
  lastName: false,
  embg: false,
  dateOfBirth: false,
  gender: false,
  email: false,
  password: false,
  confirmPassword: false
})

const errors = ref({
  firstName: '',
  lastName: '',
  embg: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function validateEmbg() {
  const embgValue = form.value.embg.trim()
  const regex = /^\d{7}(450|455)\d{3}$/
  if (!regex.test(embgValue)) {
    return 'EMBG must be ddmmyyy followed by 450xxx (male) or 455xxx (female), and the end with 3 numbers'
  }
  const dd = parseInt(embgValue.slice(0, 2), 10)
  const mm = parseInt(embgValue.slice(2, 4), 10)
  const yyy = parseInt(embgValue.slice(4, 7), 10)
  const year = yyy < 100 ? 2000 + yyy : 1000 + yyy
  if (!isValidDate(dd, mm, year)) return 'Invalid date encoded in EMBG'
  if (form.value.dateOfBirth) {
    const dob = new Date(form.value.dateOfBirth)
    if (!isNaN(dob.getTime())) {
      const same = dob.getFullYear() === year && (dob.getMonth() + 1) === mm && dob.getDate() === dd
      if (!same) return 'Date of birth does not match EMBG'
    }
  }
  if (form.value.gender) {
    const gCode = embgValue.slice(7, 10)
    if ((gCode === '450' && form.value.gender !== 'MALE') || (gCode === '455' && form.value.gender !== 'FEMALE')) {
      return 'Gender does not match EMBG'
    }
  }
  return ''
}

function isValidDate(d: number, m: number, y: number): boolean {
  if (m < 1 || m > 12 || d < 1 || d > 31) return false
  const dt = new Date(y, m - 1, d)
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
}

function validate() {
  errors.value = { firstName: '', lastName: '', embg: '', dateOfBirth: '', gender: '', email: '', password: '', confirmPassword: '' }

  if (!form.value.firstName) errors.value.firstName = 'required'
  if (!form.value.lastName) errors.value.lastName = 'required'
  if (!form.value.embg) errors.value.embg = 'required'
  else errors.value.embg = validateEmbg()
  if (!form.value.dateOfBirth) errors.value.dateOfBirth = 'required'
  if (!form.value.gender) errors.value.gender = 'required'
  if (!form.value.email) errors.value.email = 'required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = 'invalid'

  if (!form.value.password) errors.value.password = 'required'
  else if (form.value.password.length < 8) errors.value.password = 'minlength'
  else if (!/^(?=.*\d)(?=.*[^A-Za-z0-9])[a-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/.test(form.value.password)) errors.value.password = 'pattern'

  if (!form.value.confirmPassword) errors.value.confirmPassword = 'required'
  else if (form.value.password !== form.value.confirmPassword) errors.value.confirmPassword = 'mismatch'
}

const allValid = computed(() => {
  validate()
  return Object.values(errors.value).every(e => e === '')
})

async function onSubmit() {
  if (!allValid.value) return
  const payload: CreateAppUserDTO = {
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    embg: form.value.embg,
    password: form.value.password,
    confirmPassword: form.value.confirmPassword,
    email: form.value.email
  }
  try {
    await auth.register(payload)
    router.push('/pending')
  } catch (err) {
    console.error('Error:', err)
  }
}

watch(() => form.value.dateOfBirth, () => { touched.value.embg = true })
watch(() => form.value.gender, () => { touched.value.embg = true })
</script>

<style scoped>
.register-card {
  border: none;
  overflow: hidden;
  background: #fff;
  transition: all 0.3s ease;
}

.register-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.register-card .card-header {
  background: linear-gradient(135deg, #386641, #6a994e);
  font-weight: 600;
  font-size: 1.2rem;
  border: none;
}

.form-control, .form-select {
  border-radius: 0.6rem;
  border: 1px solid #e5e7eb;
  padding: 0.65rem 0.9rem;
  font-size: 0.95rem;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.form-control:focus, .form-select:focus {
  border-color: #6a994e;
  box-shadow: 0 0 0 0.2rem rgba(106, 153, 78, 0.25);
}

.form-label {
  font-weight: 500;
  color: #386641;
}

.is-invalid {
  border-color: #dc3545 !important;
}

.invalid-feedback {
  font-size: 0.85rem;
  color: #dc3545;
}

.form-text {
  font-size: 0.8rem;
  color: #6b7280;
}

.btn-brand {
  background: linear-gradient(135deg, #386641, #6a994e);
  border: none;
  border-radius: 0.6rem;
  font-weight: 600;
  padding: 0.75rem;
  color: #fff;
  transition: all 0.3s ease;
}

.btn-brand:hover {
  background: linear-gradient(135deg, #6a994e, #a7c957);
  transform: translateY(-1px);
}

.register-card .card-footer {
  background: #f8f9fa;
  border-top: none;
}
</style>
