package finki.nvd.backend.dto

import finki.nvd.backend.model.enum.FlagLevel

data class MetricFlagDTO<T>(
    val value: T,
    val level: FlagLevel
)
