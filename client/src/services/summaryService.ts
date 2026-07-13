import apiClient from './apiClient'
import type { Summary, SummaryForm } from '../types'

const URL = '/api/summary'

export const summaryService = {
  createSummary(summary: SummaryForm) {
    return apiClient.post<number>(URL, summary)
  },

  getSummaryAI(reportId: number) {
    return apiClient.get<string>(`${URL}/ai/${reportId}`)
  },

  patchSummary(reportId: number, summary: SummaryForm) {
    return apiClient.patch<number>(`${URL}/${reportId}`, summary)
  },

  getSummaryByReportId(reportId: number) {
    return apiClient.get<Summary>(`${URL}/${reportId}`)
  }
}
