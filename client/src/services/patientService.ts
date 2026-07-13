import apiClient from './apiClient'
import type { Patient, PatientDTO, ReportShort, Page, SportsmanCategory } from '../types'

const URL = '/api/patient'

export const patientService = {
  getPatientById(patientId: number) {
    return apiClient.get<PatientDTO>(`${URL}/${patientId}`)
  },

  createPatientFromUser(patientData: { id: number; sportsmanCategory: SportsmanCategory }) {
    return apiClient.post<Patient>(`${URL}/create-patient-user`, patientData)
  },

  getReportsByPatientId(patientId: number, page = 0, size = 10, sort = 'createdAt,desc') {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('size', size.toString())
    params.set('sort', sort)
    return apiClient.get<Page<ReportShort>>(`${URL}/${patientId}/reports`, { params })
  },

  getLatestRecommendations(patientId: number) {
    return apiClient.get(`${URL}/${patientId}/latest/recommendations`)
  },

  searchPatientsByEmbg(embg: string, patientType: boolean, doctorId: number, page = 0, size = 10, sort = 'dateOfLatestCheckUp,desc') {
    const params = new URLSearchParams()
    params.set('embg', embg)
    params.set('patientType', patientType.toString())
    params.set('page', page.toString())
    params.set('size', size.toString())
    params.set('sort', sort)
    const searchUrl = patientType ? '/api/doctor' : '/api/doctor'
    return apiClient.get<Page<PatientDTO>>(`${searchUrl}/${doctorId}/patients/search`, { params })
  }
}
