import apiClient from './apiClient'
import type { Recommendation, RecommendationFormDTO } from '../types'

const URL = '/api/recommendations'

export const recommendationService = {
  createRecommendation(rec: RecommendationFormDTO) {
    return apiClient.post<number>(URL, rec)
  },

  getRecommendationsByReportId(reportId: number) {
    return apiClient.get<Recommendation[]>(`/api/reports/${reportId}/recommendations`)
  },

  getLatestRecommendations(patientId: number) {
    return apiClient.get<Recommendation[]>(`/api/patient/${patientId}/latest/recommendations`)
  }
}
