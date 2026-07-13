package finki.nvd.backend.service.impl

import jakarta.persistence.EntityNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import finki.nvd.backend.dto.SummaryCreateRequest
import finki.nvd.backend.dto.SummaryDTO
import finki.nvd.backend.mappers.toDto
import finki.nvd.backend.repository.AthleteReportRepository
import finki.nvd.backend.repository.SummaryRepository
import finki.nvd.backend.service.RecommendationService
import finki.nvd.backend.service.SummaryService

@Service
class SummaryServiceImpl(
    private val summaryRepository: SummaryRepository,
    private val athleteReportRepository: AthleteReportRepository,
    private val openAiService: OpenAiService,
    private val recommendationService: RecommendationService
) : SummaryService {

    override fun findSummaryByReportId(reportId: Long): SummaryDTO =
        summaryRepository.findByAthleteReportReportId(reportId)
            ?.toDto()
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Summary for reportId=$reportId not found")

    override fun create(summary: SummaryCreateRequest): Long {
        val report = athleteReportRepository.findById(summary.reportId!!)
            .orElseThrow { EntityNotFoundException("Report with id = ${summary.reportId} not found") }
        val res = SummaryCreateRequest.toEntity(summary, report)
        summaryRepository.save(res)

        return report.reportId!!
    }

    override fun getSummaryAI(reportId: Long): String {
        val recommendations = recommendationService.findRecommendationsByReportId(reportId)
        val summarized = openAiService.summarizeRecommendations(recommendations)
        return summarized
    }

    override fun update(reportId: Long, request: SummaryCreateRequest): Long {
        val summary = summaryRepository.findByAthleteReportReportId(reportId)
            ?: throw EntityNotFoundException("Report with id = $reportId not found")

        request.summarizedContent?.let { summary.summarizedContent = it }

        summaryRepository.save(summary)
        return reportId
    }
}