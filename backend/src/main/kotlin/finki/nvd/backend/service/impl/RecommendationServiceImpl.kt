package finki.nvd.backend.service.impl

import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import finki.nvd.backend.dto.RecommendationCreateRequest
import finki.nvd.backend.dto.RecommendationResponse
import finki.nvd.backend.mappers.toDto
import finki.nvd.backend.repository.AthleteReportRepository
import finki.nvd.backend.repository.PatientRepository
import finki.nvd.backend.repository.RecommendationRepository
import finki.nvd.backend.service.RecommendationService

@Service
class RecommendationServiceImpl(
    private val recommendationRepository: RecommendationRepository,
    private val patientRepository: PatientRepository,
    private val athleteReportRepository: AthleteReportRepository
) : RecommendationService {
    override fun findRecommendationsByDoctorId(doctorId: Long): List<RecommendationResponse> =
        recommendationRepository.findByReportDoctorDoctorId(doctorId).map { recommendation ->
            recommendation.toDto()
        }


    override fun findRecommendationsByPatientId(patientId: Long): List<RecommendationResponse> {
        val patient = patientRepository.findById(patientId)
            .orElseThrow { throw EntityNotFoundException("There is no patient with id=$patientId in the database.") }
        return recommendationRepository.findByReportPatientPatientId(patientId).map { recommendation ->
            recommendation.toDto()
        };
    }

    override fun findRecommendationsByReportId(reportId: Long): List<RecommendationResponse> {
        val report = athleteReportRepository.findById(reportId)
            .orElseThrow { throw EntityNotFoundException("There is no report with id=$reportId in the database.") }
        return recommendationRepository.findByReportReportId(reportId).map { recommendation ->
            recommendation.toDto()
        };
    }

    override fun create(recommendation: RecommendationCreateRequest): Long {
        val report = athleteReportRepository.findById(recommendation.reportId!!)
            .orElseThrow { EntityNotFoundException("Report with id = ${recommendation.reportId} not found") }
        val res = RecommendationCreateRequest.toEntity(recommendation, report);
        recommendationRepository.save(res);

        return report.reportId!!;
    }
}