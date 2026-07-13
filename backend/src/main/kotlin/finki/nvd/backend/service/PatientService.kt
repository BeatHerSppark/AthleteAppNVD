package finki.nvd.backend.service

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import finki.nvd.backend.dto.PatientDTO
import finki.nvd.backend.dto.PatientDataDTO
import finki.nvd.backend.model.Patient

interface PatientService {
    fun getPatientsByDoctorId(doctorId: Long, pageable: Pageable): Page<PatientDTO>
    fun searchPatientsByDoctorIdAndEmbg(doctorId: Long, embg: String, pageable: Pageable): Page<PatientDTO>
    fun getUnassignedPatients(embg: String, pageable: Pageable): Page<PatientDTO>
    fun createPatientFromUser(patientData: PatientDataDTO, userId: Long): Patient
}