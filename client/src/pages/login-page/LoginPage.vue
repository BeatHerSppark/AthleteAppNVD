<template>
  <div class="login-container d-flex justify-content-center align-items-center vh-100 bg-light">
    <form @submit.prevent="submit" class="login-card shadow-lg p-4 rounded bg-white">
      <h2 class="title text-center mb-4">Sign in</h2>

      <div class="mb-3">
        <label class="form-label">EMBG</label>
        <input type="text" class="form-control" v-model="form.embg" placeholder="e.g. 1212005455321" />
        <div v-if="errors.embg" class="error text-danger small mt-1">{{ errors.embg }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password" class="form-control" v-model="form.password" placeholder="xxxxxxx" />
        <div v-if="errors.password" class="error text-danger small mt-1">{{ errors.password }}</div>
      </div>

      <div class="button-sequence d-flex gap-3">
        <div class="d-grid flex-fill">
          <button :disabled="loading || !isValid" type="submit" class="btn btn-signin">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
        <div class="d-grid flex-fill">
          <button :disabled="loading || !isValid" type="button" class="btn btn-register" @click="goToRegister">
            Register
          </button>
        </div>
      </div>

      <div v-if="serverError" class="alert">
        <span class="alert-text">{{ serverError }}</span>
        <button class="alert-close" type="button" @click="serverError = ''" aria-label="Close">x</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const auth = useAuth()

const form = ref({
  embg: '1104003450027',
  password: 'p@ssw0rd'
})
const loading = ref(false)
const serverError = ref('')
const errors = ref({ embg: '', password: '' })

const isValid = computed(() => {
  return form.value.embg.length === 13 && form.value.password.length >= 8
})

function validate() {
  errors.value = { embg: '', password: '' }
  if (!form.value.embg) errors.value.embg = 'EMBG is required'
  else if (form.value.embg.length !== 13) errors.value.embg = 'EMBG must be 13 characters'
  if (!form.value.password) errors.value.password = 'Password is required'
  else if (form.value.password.length < 8) errors.value.password = 'Password must be at least 8 characters'
  return !errors.value.embg && !errors.value.password
}

async function submit() {
  serverError.value = ''
  if (!validate() || loading.value) return
  loading.value = true
  try {
    await auth.login(form.value.embg, form.value.password)
    const user = auth.getCurrentUser()
    if (!user) throw new Error('No user session after login')
    const role = user.role
    if (role === 'DOCTOR') {
      router.push(user.personId ? '/doctor' : '/doctor/setup')
    } else if (role === 'PATIENT') {
      router.push(user.personId ? '/patient' : '/patient/setup')
    } else if (role === 'PENDING') {
      router.push('/pending')
    } else if (role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (err: any) {
    serverError.value = err?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}

function goToRegister() {
  router.push('/register')
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  border: none;
}

.login-card .form-control {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 0.95rem;
}

.login-card .form-control:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(80, 144, 94, 0.25);
  border-color: #0e5d1b;
}

.button-sequence .btn {
  border-radius: 12px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.25s ease-in-out;
  width: 100%;
}

.button-sequence .btn {
  background: linear-gradient(135deg, #386641, #6a994e);
  color: #fff;
  border: none;
  box-shadow: 0 4px 10px rgb(45, 64, 34);
}

.button-sequence .btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #6a994e, rgb(56, 102, 65));
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(50, 53, 57, 0.35);
}

.button-sequence .btn:disabled {
  background: rgba(41, 95, 8, 0.29);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.login-card .title {
  font-weight: 600;
  color: #333;
}

.alert {
  position: relative;
  margin-top: 12px;
  padding: 12px 36px 12px 12px;
  border-radius: 8px;
  background: #fdecea;
  color: #611a15;
  border: 1px solid #f5c2c0;
  text-align: center;
}

.alert .alert-close {
  position: absolute;
  right: 8px;
  top: 6px;
  border: 0;
  background: transparent;
  font-size: 20px;
  line-height: 20px;
  cursor: pointer;
  color: inherit;
}

.alert .alert-close:hover {
  opacity: 0.7;
}
</style>
