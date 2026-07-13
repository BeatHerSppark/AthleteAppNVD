package finki.nvd.backend.service

import finki.nvd.backend.model.Doctor

interface DoctorService {
    fun createDoctorFromUser(userId: Long, specialization: String): Doctor
}