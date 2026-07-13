package finki.nvd.backend.dto

import finki.nvd.backend.model.Patient
import finki.nvd.backend.model.enum.Gender
import finki.nvd.backend.model.enum.SportsmanCategory
import java.time.LocalDate
import java.time.LocalDateTime

data class PatientDTO(
    val patientId: Long,
    val name: String,
    val embg: String,
    val dateOfBirth: LocalDate,
    val dateOfLatestCheckup: LocalDateTime?,
    val gender: Gender,
    val sportsmanCategory: SportsmanCategory,
    val email: String,
    val doctor: String
) {
    companion object {
        fun fromEntity(patient: Patient): PatientDTO {
            return PatientDTO(
                patientId = patient.patientId!!,
                name = "${patient.user.firstName} ${patient.user.lastName}",
                embg = patient.user.embg,
                dateOfBirth = patient.dateOfBirth,
                dateOfLatestCheckup = patient.dateOfLatestCheckUp,
                gender = patient.gender,
                sportsmanCategory = patient.sportsmanCategory,
                email = patient.user.email ?: "",
                doctor = "Dr. ${patient.doctor?.user?.firstName} ${patient.doctor?.user?.lastName}",
            )
        }
    }
}