import apiClient from './apiClient'
import type { Mood, MoodStatistics, Page } from '../types'

const URL = '/api/moods'

export const moodService = {
  getAllMoods() {
    return apiClient.get<Mood[]>(URL)
  },

  filterSearch(
    patientId: number,
    from?: string,
    to?: string,
    moodEmotion?: string[],
    moodProgress?: string[],
    pageSize = 4,
    pageNumber = 1
  ) {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    if (moodEmotion) moodEmotion.forEach(e => params.append('moodEmotion', e))
    if (moodProgress) moodProgress.forEach(p => params.append('moodProgress', p))
    params.set('pageSize', pageSize.toString())
    params.set('pageNumber', pageNumber.toString())
    return apiClient.get<Page<Mood>>(`${URL}/${patientId}/search`, { params })
  },

  getAllMoodsForPatient(patientId: number) {
    return apiClient.get<Mood[]>(`${URL}/${patientId}/all-moods`)
  },

  getMoodById(moodId: number) {
    return apiClient.get<Mood>(`${URL}/info/${moodId}`)
  },

  createMood(mood: { patientId: number; moodEmotion: string; moodDescription: string; hoursSleptAverage: number }) {
    return apiClient.post<Mood>(URL, mood)
  },

  getMoodStatistics(id: number) {
    return apiClient.get<MoodStatistics>(`${URL}/${id}/statistics`)
  },

  getMoodsForSpecificPatient(patientId: number) {
    return apiClient.get<Mood[]>(`${URL}/${patientId}/all-moods`)
  }
}
