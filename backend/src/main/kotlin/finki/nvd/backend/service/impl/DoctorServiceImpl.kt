package finki.nvd.backend.service.impl

import org.springframework.stereotype.Service
import finki.nvd.backend.model.Doctor
import finki.nvd.backend.repository.DoctorRepository
import finki.nvd.backend.security.repository.AppUserRepository
import finki.nvd.backend.service.DoctorService

@Service
class DoctorServiceImpl(
    private val doctorRepository: DoctorRepository,
    private val userRepository: AppUserRepository
) : DoctorService {
    override fun createDoctorFromUser(
        userId: Long,
        specialization: String
    ): Doctor = doctorRepository.save(
        Doctor(user = userRepository.findById(userId).orElseThrow(), specialization = specialization)
    )
}