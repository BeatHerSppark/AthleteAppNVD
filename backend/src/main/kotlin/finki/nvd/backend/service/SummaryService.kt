package finki.nvd.backend.service

import finki.nvd.backend.dto.SummaryCreateRequest
import finki.nvd.backend.dto.SummaryDTO

interface SummaryService {
    fun findSummaryByReportId(reportId: Long) : SummaryDTO
    fun create(summary: SummaryCreateRequest) : Long
    fun getSummaryAI(reportId: Long): String
    fun update(reportId: Long, request: SummaryCreateRequest): Long
}