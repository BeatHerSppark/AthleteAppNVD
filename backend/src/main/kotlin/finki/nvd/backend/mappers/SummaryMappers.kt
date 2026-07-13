package finki.nvd.backend.mappers

import finki.nvd.backend.dto.SummaryDTO
import finki.nvd.backend.model.Summary

fun Summary.toDto(): SummaryDTO = SummaryDTO(
    summaryId = summaryId,
    reportId = athleteReport.reportId!!,
    summarizedContent = summarizedContent
)