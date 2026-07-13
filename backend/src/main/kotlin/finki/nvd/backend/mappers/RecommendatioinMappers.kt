package finki.nvd.backend.mappers

import finki.nvd.backend.dto.RecommendationResponse
import finki.nvd.backend.model.Recommendation

fun Recommendation.toDto(): RecommendationResponse = RecommendationResponse(
    recommendationId = recommendationId,
    reportId = report.reportId!!,
    type = type,
    restrictionLevel = restrictionLevel,
    label = label,
    description = description,
    costPerMonth = costPerMonth,
    durationWeeks = durationWeeks,
    frequencyPerDay = frequencyPerDay,
    targetGoal = targetGoal,
    effectivenessRating = effectivenessRating,
    doctorPersonalizedNotes = doctorPersonalizedNotes
)