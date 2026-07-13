package finki.nvd.backend.service

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import finki.nvd.backend.dto.AthleteReportFormDTO
import finki.nvd.backend.dto.AthleteReportResponse
import finki.nvd.backend.dto.AthleteReportShortDTO
import finki.nvd.backend.dto.ReportMetricFlaggerDTO

interface AthleteReportService {
    fun create(requestObject: AthleteReportFormDTO): Long
    fun findReportById(id: Long): AthleteReportResponse
    fun reportMetricsFlagging(reportId: Long): ReportMetricFlaggerDTO
    fun getReportsShortByPatientId(patientId: Long, pageable: Pageable): Page<AthleteReportShortDTO>
    fun getReportsShortByDoctorId(doctorId: Long, pageable: Pageable): Page<AthleteReportShortDTO>
    fun findLatestReportIdByPatientId(patientId: Long): Long
}