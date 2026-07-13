import apiClient from './apiClient'
import type { CreateDoctorDTO } from '../types'

const URL = '/api/doctor'

export const doctorService = {
  saveDoctorEntity(doctorData: CreateDoctorDTO) {
    return apiClient.post(`${URL}/create-doctor-user`, doctorData)
  }
}
