import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('../pages/login-page/LoginPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: () => import('../pages/register-page/RegisterPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/admin',
    name: 'AdminPage',
    component: () => import('../pages/admin-page/AdminPage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '',
    meta: { requiresAuth: true, adminLock: true },
    children: [
      {
        path: 'patient',
        name: 'PatientPage',
        component: () => import('../pages/patient-page/PatientPage.vue')
      },
      {
        path: 'patient/setup',
        name: 'PatientFormSetup',
        component: () => import('../components/patient-components/PatientFormSetup.vue')
      },
      {
        path: 'patient/:id',
        name: 'PatientPageById',
        component: () => import('../pages/patient-page/PatientPage.vue')
      },
      {
        path: 'doctor',
        name: 'DoctorPage',
        component: () => import('../pages/doctor-page/DoctorPage.vue')
      },
      {
        path: 'doctor/setup',
        name: 'DoctorFormSetup',
        component: () => import('../components/doctor-components/DoctorFormSetup.vue')
      },
      {
        path: 'moods',
        name: 'MoodPage',
        component: () => import('../pages/mood-page/MoodPage.vue'),
        meta: { requiresPatient: true }
      },
      {
        path: 'moods/add-mood',
        name: 'MoodForm',
        component: () => import('../components/mood-components/MoodForm.vue'),
        meta: { requiresPatient: true }
      },
      {
        path: 'moods/:id/search',
        name: 'MoodPageSearch',
        component: () => import('../pages/mood-page/MoodPage.vue'),
        meta: { requiresPatient: true }
      },
      {
        path: 'moods/info/:id',
        name: 'MoodDetails',
        component: () => import('../components/mood-components/MoodDetails.vue'),
        meta: { requiresPatient: true }
      },
      {
        path: 'reports',
        name: 'ReportsPage',
        component: () => import('../pages/reports-page/ReportsPage.vue')
      },
      {
        path: 'reports/new',
        name: 'ReportCreationPage',
        component: () => import('../pages/report-creation-page/ReportCreationPage.vue')
      },
      {
        path: 'reports/new/:id',
        name: 'ReportCreationPageEdit',
        component: () => import('../pages/report-creation-page/ReportCreationPage.vue')
      },
      {
        path: 'reports/:id',
        name: 'ReportDetailsPage',
        component: () => import('../pages/report-details-page/ReportDetailsPage.vue')
      },
      {
        path: 'reports/:id/document',
        name: 'PaperView',
        component: () => import('../components/report-components/PaperView.vue')
      },
      {
        path: 'summary/:reportId',
        name: 'SummaryCreationPage',
        component: () => import('../pages/summary-creation-page/SummaryCreationPage.vue')
      },
      {
        path: 'recommendations/new',
        name: 'RecommendationCreationPage',
        component: () => import('../pages/recommendation-creation-page/RecommendationCreationPage.vue')
      },
      {
        path: 'pending',
        name: 'PendingPage',
        component: () => import('../pages/pending-page/PendingPage.vue')
      },
      {
        path: '',
        name: 'RoleRedirect',
        component: () => import('../components/role-redirect/RoleRedirect.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guards
router.beforeEach((to) => {
  const { isLoggedIn, getRole } = useAuth()

  // Guest guard: redirect to / if already logged in
  if (to.meta.guest) {
    if (isLoggedIn()) {
      return { path: '/' }
    }
    return true
  }

  // Auth guard
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return { path: '/login', query: { returnUrl: to.fullPath } }
  }

  // Admin only guard
  if (to.meta.requiresAdmin) {
    if (!isLoggedIn()) return { path: '/login' }
    if (getRole() !== 'ADMIN') return { path: '/' }
    return true
  }

  // Admin lock guard: if admin, redirect to /admin
  if (to.meta.adminLock && isLoggedIn() && getRole() === 'ADMIN' && !to.path.startsWith('/admin')) {
    return { path: '/admin' }
  }

  // Patient role only guard
  if (to.meta.requiresPatient) {
    if (!isLoggedIn()) return { path: '/login', query: { returnUrl: to.fullPath } }
    if (getRole() !== 'PATIENT') return { path: '' }
    return true
  }

  return true
})

export default router
