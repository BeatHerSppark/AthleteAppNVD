package finki.nvd.backend.mappers

import finki.nvd.backend.dto.PatientDTO
import finki.nvd.backend.model.Patient

object PatientMapper {
    fun mapPatientToResponseDTO(patient: Patient): PatientDTO = PatientDTO(
        patientId = patient.patientId!!,
        name = "${patient.user.firstName} ${patient.user.lastName}",
        dateOfBirth = patient.dateOfBirth,
        gender = patient.gender,
        dateOfLatestCheckup = patient.dateOfLatestCheckUp,
        embg = patient.user.embg,
        sportsmanCategory = patient.sportsmanCategory,
        doctor = "Dr. ${patient.doctor?.user?.firstName} ${patient.doctor?.user?.lastName} with specialization in '${patient.doctor?.specialization}'",
        email = patient.user.email ?: ""
    )
}