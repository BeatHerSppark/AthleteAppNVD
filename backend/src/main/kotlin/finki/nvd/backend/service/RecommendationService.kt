package finki.nvd.backend.service

import finki.nvd.backend.dto.RecommendationCreateRequest
import finki.nvd.backend.dto.RecommendationResponse

interface RecommendationService {
    fun findRecommendationsByDoctorId(doctorId: Long): List<RecommendationResponse>
    fun findRecommendationsByPatientId(patientId: Long): List<RecommendationResponse>
    fun findRecommendationsByReportId(reportId: Long): List<RecommendationResponse>
    fun create(recommendation: RecommendationCreateRequest) : Long
}