package finki.nvd.backend.dto

import finki.nvd.backend.model.enum.SportsmanCategory

data class PatientDataDTO(
    val id: Int,
    val sportsmanCategory: SportsmanCategory
)
