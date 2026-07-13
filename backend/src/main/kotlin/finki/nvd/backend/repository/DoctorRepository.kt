package finki.nvd.backend.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import finki.nvd.backend.model.Doctor

@Repository
interface DoctorRepository : JpaRepository<Doctor, Long> {
    fun findByUserEmbg(username: String): Doctor?
}