import apiClient from './apiClient'
import type { ReportForm, ReportDetails, ReportFlags, Page, ReportShort, Recommendation } from '../types'

const URL = '/api/reports'

export const reportService = {
  createReport(report: ReportForm) {
    return apiClient.post<number>(URL, report)
  },

  updateReport(reportId: number, report: ReportForm) {
    return apiClient.post<number>(`${URL}/${reportId}`, report)
  },

  getReportById(id: number) {
    return apiClient.get<ReportDetails>(`${URL}/${id}`)
  },

  getReportFlags(reportId: number) {
    return apiClient.get<ReportFlags>(`${URL}/${reportId}/flags`)
  },

  getRecommendationsByReportId(reportId: number) {
    return apiClient.get<Recommendation[]>(`${URL}/${reportId}/recommendations`)
  },

  getReportsByPatientId(patientId: number, page = 0, size = 10, sort = 'createdAt,desc') {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('size', size.toString())
    params.set('sort', sort)
    return apiClient.get<Page<ReportShort>>(`/api/patient/${patientId}/reports`, { params })
  },

  getReportsByDoctorId(doctorId: number, page = 0, size = 10, sort = 'createdAt,desc') {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('size', size.toString())
    params.set('sort', sort)
    return apiClient.get<Page<ReportShort>>(`/api/doctor/${doctorId}/reports`, { params })
  }
}
