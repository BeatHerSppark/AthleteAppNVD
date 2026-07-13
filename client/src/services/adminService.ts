import apiClient from './apiClient'
import type { AppUserDTO, Page } from '../types'
import type { UserRole } from '../types'

const URL = '/api/admin'

export const adminService = {
  getPending(page = 0, size = 20, sort = 'createdAt,desc', embg?: string) {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('size', size.toString())
    params.set('sort', sort)
    if (embg) params.set('embg', embg)
    return apiClient.get<Page<AppUserDTO>>(`${URL}/get-all-pending`, { params })
  },

  updateUserRole(id: number, role: UserRole) {
    return apiClient.patch<AppUserDTO>(`${URL}/users/${id}/role`, null, {
      params: { role }
    })
  },

  deleteUser(id: number) {
    return apiClient.delete<void>(`${URL}/users/${id}`)
  }
}
