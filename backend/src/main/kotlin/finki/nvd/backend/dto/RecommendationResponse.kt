package finki.nvd.backend.dto

import finki.nvd.backend.model.enum.RecommendationType
import finki.nvd.backend.model.enum.RestrictionLevel

data class RecommendationResponse (
    val recommendationId: Long?,
    val reportId: Long,
    val type: RecommendationType,
    val restrictionLevel: RestrictionLevel,
    val label: String,
    val description: String,
    val costPerMonth: Int,
    val durationWeeks: Int,
    val frequencyPerDay: Int,
    val targetGoal: String,
    val effectivenessRating: Int,
    val doctorPersonalizedNotes: String
)