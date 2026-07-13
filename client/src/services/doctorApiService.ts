import apiClient from './apiClient'
import type { PatientDTO, ReportShort, Page } from '../types'

const URL = '/api/doctor'

export const doctorApiService = {
  getAllDoctors() {
    return apiClient.get(URL)
  },

  getDoctorById(id: number) {
    return apiClient.get(`${URL}/${id}`)
  },

  getPatientsByDoctorId(doctorId: number, page = 0, size = 10, sort = 'dateOfLatestCheckUp,desc') {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('size', size.toString())
    params.set('sort', sort)
    return apiClient.get<Page<PatientDTO>>(`${URL}/${doctorId}/patients`, { params })
  },

  searchPatients(doctorId: number, embg = '', patientType = false, page = 0, size = 10, sort = 'dateOfLatestCheckUp,desc') {
    const params = new URLSearchParams()
    params.set('embg', embg)
    params.set('patientType', patientType.toString())
    params.set('page', page.toString())
    params.set('size', size.toString())
    params.set('sort', sort)
    return apiClient.get<Page<PatientDTO>>(`${URL}/${doctorId}/patients/search`, { params })
  },

  getReportsByDoctorId(doctorId: number, page = 0, size = 10, sort = 'createdAt,desc') {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('size', size.toString())
    params.set('sort', sort)
    return apiClient.get<Page<ReportShort>>(`${URL}/${doctorId}/reports`, { params })
  }
}
